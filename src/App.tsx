import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProjectCard } from '@/components/ProjectCard'
import { CategorySelector } from '@/components/CategorySelector'
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
  const [categorySelection, setCategorySelection] = useState<CategorySelection>({
    mainCategories: [],
    subCategories: {}
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
        categorySelection.mainCategories.length > 0 ? categorySelection : undefined
      )
      
      setCurrentIdeas(newIdeas)
      setHistory(currentHistory => [...(currentHistory || []), ...newIdeas])
      
      let generationContext = ''
      if (categorySelection.mainCategories.length > 0) {
        generationContext = ` for ${categorySelection.mainCategories.join(', ')}`
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
  const olderIdeas = historyArray.slice(0, -6).reverse()

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-10">
        <div className="flex flex-col gap-8">
          
          <header className="flex flex-col gap-2.5 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <Sparkle className="w-5 h-5 text-accent" weight="fill" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                AI-Powered Project Ideas
              </h1>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover unique project ideas across multiple categories. Each idea comes with a ready-to-use prompt for GitHub Spark.
            </p>
          </header>

          <CategorySelector
            selection={categorySelection}
            onSelectionChange={setCategorySelection}
          />

          <div className="flex justify-center pt-2">
            <Button
              onClick={() => handleGenerate(3)}
              disabled={isGenerating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-sm shadow-md hover:shadow-lg transition-all"
            >
              {isGenerating ? (
                <>
                  <Sparkle className="mr-2.5 animate-spin" weight="fill" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkle className="mr-2.5" weight="fill" size={20} />
                  Generate 3 New Ideas
                </>
              )}
            </Button>
          </div>

          <section className="flex flex-col gap-5">
            {currentIdeas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentIdeas.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>

          {olderIdeas.length > 0 && (
            <>
              <Separator className="my-6" />
              
              <section className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-muted-foreground" weight="bold" />
                  <h2 className="text-lg font-semibold tracking-tight">
                    Previously Generated Ideas
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {olderIdeas.map((project, index) => (
                    <div key={project.id} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(project.generatedAt)}</span>
                      </div>
                      <ProjectCard 
                        project={project} 
                        index={index}
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
