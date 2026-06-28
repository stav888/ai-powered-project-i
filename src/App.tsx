import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ProjectCard } from '@/components/ProjectCard'
import { CategorySelector } from '@/components/CategorySelector'
import { SearchBar } from '@/components/SearchBar'
import { generateProjectIdeas } from '@/lib/generateIdeas'
import { ProjectIdea, CategorySelection } from '@/lib/types'
import { Sparkle, Clock, Heart } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [history, setHistory] = useKV<ProjectIdea[]>('project-ideas-history', [])
  const [currentIdeas, setCurrentIdeas] = useState<ProjectIdea[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categorySelection, setCategorySelection] = useState<CategorySelection>({
    mainCategories: [],
    subCategories: {}
  })
  const [generateFromFavorites, setGenerateFromFavorites] = useState(false)

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
      
      const favoriteProjects = generateFromFavorites 
        ? historyArray.filter(idea => idea.isFavorite)
        : undefined

      const newIdeas = await generateProjectIdeas(
        count,
        existingNames,
        categorySelection.mainCategories.length > 0 ? categorySelection : undefined,
        favoriteProjects
      )
      
      setCurrentIdeas(newIdeas)
      setHistory(currentHistory => [...(currentHistory || []), ...newIdeas])
      
      let generationContext = ''
      if (generateFromFavorites && favoriteProjects && favoriteProjects.length > 0) {
        generationContext = ` based on your ${favoriteProjects.length} favorite${favoriteProjects.length === 1 ? '' : 's'}`
      } else if (categorySelection.mainCategories.length > 0) {
        generationContext = ` for ${categorySelection.mainCategories.join(', ')}`
        const allSubCats = Object.values(categorySelection.subCategories).flat()
        if (allSubCats.length > 0) {
          generationContext += ` (${allSubCats.join(', ')})`
        }
      }
      
      toast.success(`Generated ${count} new project ideas${generationContext}!`, {
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

  const handleToggleFavorite = (id: string) => {
    setHistory(currentHistory => {
      const updated = (currentHistory || []).map(idea =>
        idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
      )
      
      setCurrentIdeas(prevIdeas => 
        prevIdeas.map(idea =>
          idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
        )
      )
      
      return updated
    })
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

  const favoriteCount = useMemo(() => {
    return (history || []).filter(idea => idea.isFavorite).length
  }, [history])

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
          <p className="text-sm text-muted-foreground">Generating initial ideas...</p>
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
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col gap-5">
          
          <header className="flex flex-col gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkle className="w-6 h-6 text-accent" weight="fill" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                AI-Powered Project Ideas
              </h1>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
              Discover unique project ideas across multiple categories. Each idea comes with a ready-to-use prompt for GitHub Spark.
            </p>
          </header>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, description, tags, or categories..."
          />

          {!searchQuery && (
            <>
              <CategorySelector
                selection={categorySelection}
                onSelectionChange={setCategorySelection}
              />

              {favoriteCount > 0 && (
                <div className="flex items-center justify-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <Heart 
                    className={generateFromFavorites ? "text-red-500" : "text-muted-foreground"} 
                    size={20} 
                    weight={generateFromFavorites ? "fill" : "regular"}
                  />
                  <Label htmlFor="generate-favorites" className="text-sm font-medium cursor-pointer">
                    Generate from {favoriteCount} Favorite{favoriteCount === 1 ? '' : 's'}
                  </Label>
                  <Switch
                    id="generate-favorites"
                    checked={generateFromFavorites}
                    onCheckedChange={setGenerateFromFavorites}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={() => handleGenerate(3)}
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 text-sm shadow-md hover:shadow-lg transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Sparkle className="mr-2 animate-spin" weight="fill" size={18} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkle className="mr-2" weight="fill" size={18} />
                      Generate 3 New Ideas
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          <section className="flex flex-col gap-4">
            {searchQuery && (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  Search Results
                </h2>
                <span className="text-xs text-muted-foreground">
                  ({displayedIdeas.length} {displayedIdeas.length === 1 ? 'result' : 'results'})
                </span>
              </div>
            )}
            
            {displayedIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedIdeas.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No projects found matching "{searchQuery}"
                </p>
                <Button
                  variant="link"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm"
                >
                  Clear search
                </Button>
              </div>
            ) : null}
          </section>

          {!searchQuery && olderIdeas.length > 0 && (
            <>
              <Separator className="my-4" />
              
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" weight="bold" />
                  <h2 className="text-xl font-semibold tracking-tight">
                    Previously Generated Ideas
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {olderIdeas.map((project, index) => (
                    <div key={project.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(project.generatedAt)}</span>
                      </div>
                      <ProjectCard 
                        project={project} 
                        index={index}
                        onToggleFavorite={handleToggleFavorite}
                      />
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
