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
      className="project-card p-4 flex flex-col gap-3 border-border shadow-sm relative"
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
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-accent/10"
        >
          <Heart 
            size={18}
            weight={project.isFavorite ? 'fill' : 'regular'}
            className={project.isFavorite ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}
          />
        </Button>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3 pr-9">
          <h3 className="text-base font-semibold tracking-tight leading-tight">{project.name}</h3>
          <Badge className={`shrink-0 text-xs px-1.5 py-0 ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          {project.shortDescription}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
          Key Features
        </h4>
        <ul className="space-y-1">
          {project.keyFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80 leading-snug">
              <span className="mt-1 h-1 w-1 rounded-full bg-accent shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag, i) => (
          <Badge 
            key={i} 
            variant="outline"
            className="bg-secondary/50 text-secondary-foreground border-border/50 text-xs px-1.5 py-0"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Button 
        onClick={handleCopy}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs py-2 h-auto"
      >
        {copied ? (
          <>
            <Check className="mr-1.5" weight="bold" size={14} />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-1.5" weight="bold" size={14} />
            Copy Prompt to Build in Spark
          </>
        )}
      </Button>
    </Card>
  )
}
