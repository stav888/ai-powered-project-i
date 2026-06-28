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
  categories?: string[]
  isFavorite?: boolean
}

export interface GeneratedIdeaHistory {
  ideas: ProjectIdea[]
}

export interface MainCategory {
  name: string
  icon: string
  subCategories: string[]
}

export interface CategorySelection {
  mainCategories: string[]
  subCategories: Record<string, string[]>
}
