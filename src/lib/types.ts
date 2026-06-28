export type DifficultyLevel = 'Easy' | 'Medium' | 'Advanced'

export interface ProjectIdea {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  keyFeatures: string[]
  difficulty: DifficultyLevel
  tags: string[]
  sparkPrompt: string
  generatedAt: string
}

export interface GeneratedIdeaHistory {
  ideas: ProjectIdea[]
}
