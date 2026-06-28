import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProjectCard } from '@/components/ProjectCard'
import { CategorySelector } from '@/components/CategorySelector'
import { SearchBar } from '@/components/SearchBar'
import { generateProjectIdeas } from '@/lib/generateIdeas'
import { ProjectIdea, CategorySelection } from '@/lib/types'
import { Sparkle, Clock } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [history, setHistory] = useKV<ProjectIdea[]>('project-ideas-history', [])
  const [currentIdeas, setCurrentIdeas] = useState<ProjectIdea[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categorySelection, setCategorySelection] = useState<CategorySelection>({
    mainCategory: null,
    subCategories: []
  })

  useEffect(() => {
    const initializeIdeas = async () => {
      const historyArray = history || []
      if (historyArray.length === 0) {
        await handleGenerate(6)
      } else {
        setCurrentIdeas(historyArray.slice(-6))
      }
      setIsInitialLoad(false)
    }

    initializeIdeas()
  }, [])

  const handleGenerate = async (count: number = 3) => {
    setIsGenerating(true)
    try {
      const historyArray = history || []
      const existingNames = historyArray.map(idea => idea.name)
      const newIdeas = await generateProjectIdeas(
        count,
        existingNames,
        categorySelection.mainCategory || undefined,
        categorySelection.subCategories.length > 0 ? categorySelection.subCategories : undefined
      )
      
      setCurrentIdeas(newIdeas)
      setHistory(currentHistory => [...(currentHistory || []), ...newIdeas])
      
      const categoryInfo = categorySelection.mainCategory
        ? ` for ${categorySelection.mainCategory}${categorySelection.subCategories.length > 0 ? ` (${categorySelection.subCategories.join(', ')})` : ''}`
        : ''
      
      toast.success(`Generated ${count} new project ideas${categoryInfo}!`, {
        description: 'Scroll down to explore them'
      })
    } catch (error) {
      toast.error('Failed to generate ideas', {
        description: 'Please try again'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const filteredIdeas = useMemo(() => {
    const historyArray = history || []
    if (!searchQuery.trim()) return historyArray

    const query = searchQuery.toLowerCase().trim()
    return historyArray.filter(idea =>
      idea.name.toLowerCase().includes(query) ||
      idea.shortDescription.toLowerCase().includes(query) ||
      idea.fullDescription.toLowerCase().includes(query) ||
      idea.tags.some(tag => tag.toLowerCase().includes(query)) ||
      (idea.categories && idea.categories.some(cat => cat.toLowerCase().includes(query)))
    )
  }, [history, searchQuery])

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkle className="w-12 h-12 mx-auto mb-4 text-accent animate-pulse" />
          <p className="text-muted-foreground">Generating initial ideas...</p>
        </div>
      </div>
    )
  }

  const historyArray = history || []
  const displayedIdeas = searchQuery ? filteredIdeas : currentIdeas
  const olderIdeas = searchQuery ? [] : historyArray.slice(0, -6).reverse()

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-20">
        <div className="flex flex-col gap-12 md:gap-16">
          
          <header className="flex flex-col gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Sparkle className="w-10 h-10 md:w-12 md:h-12 text-accent" weight="fill" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                AI-Powered Project Ideas
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover unique project ideas across multiple categories. Each idea comes with a ready-to-use prompt for GitHub Spark.
            </p>
          </header>

          <div className="flex flex-col gap-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, description, tags, or categories..."
            />
          </div>

          {!searchQuery && (
            <>
              <section className="flex flex-col gap-6">
                <CategorySelector
                  selection={categorySelection}
                  onSelectionChange={setCategorySelection}
                />
              </section>

              <div className="flex justify-center">
                <Button
                  onClick={() => handleGenerate(3)}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Sparkle className="mr-2 animate-spin" weight="fill" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkle className="mr-2" weight="fill" />
                      Generate 3 New Ideas
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          <section className="flex flex-col gap-8">
            {searchQuery && (
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Search Results
                </h2>
                <span className="text-muted-foreground">
                  ({displayedIdeas.length} {displayedIdeas.length === 1 ? 'result' : 'results'})
                </span>
              </div>
            )}
            
            {displayedIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {displayedIdeas.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No projects found matching "{searchQuery}"
                </p>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear search
                </Button>
              </div>
            ) : null}
          </section>

          {!searchQuery && olderIdeas.length > 0 && (
            <>
              <Separator className="my-8" />
              
              <section className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-muted-foreground" weight="bold" />
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                    Previously Generated Ideas
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {olderIdeas.map((project, index) => (
                    <div key={project.id} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(project.generatedAt)}</span>
                      </div>
                      <ProjectCard project={project} index={index} />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default App