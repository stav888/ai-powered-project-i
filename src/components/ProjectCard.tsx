import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Heart } from '@phosphor-icons/react'
import { ProjectIdea } from '@/lib/types'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProjectCardProps {
  project: ProjectIdea
  index?: number
  onToggleFavorite?: (id: string) => void
}

export function ProjectCard({ project, index = 0, onToggleFavorite }: ProjectCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(project.sparkPrompt)
      setCopied(true)
      toast.success('Prompt copied to clipboard!', {
        description: 'Ready to paste into GitHub Spark'
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy', {
        description: 'Please try again'
      })
    }
  }

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(project.id)
      toast.success(
        project.isFavorite ? 'Removed from favorites' : 'Added to favorites',
        {
          description: project.isFavorite 
            ? 'Project unmarked as favorite' 
            : 'Project marked as favorite'
        }
      )
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-[oklch(0.75_0.15_145)] text-[oklch(0.20_0.10_145)]'
      case 'Medium':
        return 'bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.10_75)]'
      case 'Advanced':
        return 'bg-[oklch(0.65_0.20_300)] text-[oklch(0.95_0.05_300)]'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card 
      className="project-card p-6 md:p-8 flex flex-col gap-6 border-border shadow-sm relative"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 h-10 w-10 p-0 hover:bg-accent/10"
        >
          <Heart 
            size={24}
            weight={project.isFavorite ? 'fill' : 'regular'}
            className={project.isFavorite ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}
          />
        </Button>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4 pr-12">
          <h3 className="text-2xl font-semibold tracking-tight">{project.name}</h3>
          <Badge className={`shrink-0 ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </Badge>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          {project.shortDescription}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
          Key Features
        </h4>
        <ul className="space-y-2">
          {project.keyFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <Badge 
            key={i} 
            variant="outline"
            className="bg-secondary/50 text-secondary-foreground border-border/50"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Button 
        onClick={handleCopy}
        className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        size="lg"
      >
        {copied ? (
          <>
            <Check className="mr-2" weight="bold" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2" weight="bold" />
            Copy Prompt to Build in Spark
          </>
        )}
      </Button>
    </Card>
  )
}
