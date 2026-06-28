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
  mainCategory: string | null
  subCategories: string[]
}
