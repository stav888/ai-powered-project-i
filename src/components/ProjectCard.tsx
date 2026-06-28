import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check } from '@phosphor-icons/react'
import { ProjectIdea } from '@/lib/types'
import { toast } from 'sonner'
import { useState } from 'react'

interface ProjectCardProps {
  project: ProjectIdea
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
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
      className="project-card p-5 flex flex-col gap-4 border-border shadow-md hover:shadow-lg bg-card"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards'
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight leading-tight text-foreground">{project.name}</h3>
        </div>
        <Badge className={`w-fit shrink-0 text-xs px-2 py-0.5 font-medium ${getDifficultyColor(project.difficulty)}`}>
          {project.difficulty}
        </Badge>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.shortDescription}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          Key Features
        </h4>
        <ul className="space-y-2">
          {project.keyFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/85 leading-relaxed">
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
            className="bg-secondary/60 text-secondary-foreground border-border text-xs px-2 py-0.5"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Button 
        onClick={handleCopy}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm py-3 h-auto mt-1"
      >
        {copied ? (
          <>
            <Check className="mr-2" weight="bold" size={16} />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2" weight="bold" size={16} />
            Copy Prompt to Build in Spark
          </>
        )}
      </Button>
    </Card>
  )
}
