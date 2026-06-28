import { ProjectIdea, CategorySelection } from './types'

export async function generateProjectIdeas(
  count: number,
  excludeNames: string[],
  categorySelection?: CategorySelection
): Promise<ProjectIdea[]> {
  const categories: string[] = []
  
  if (categorySelection && categorySelection.mainCategories.length > 0) {
    categories.push(...categorySelection.mainCategories)
  }

  const categoryText = categories.length > 0 
    ? `Generate ${count} unique project ideas focused on: ${categories.join(', ')}.`
    : `Generate ${count} unique project ideas across different practical domains.`

  const excludeText = excludeNames.length > 0 
    ? `Do NOT create projects with these names: ${excludeNames.slice(-20).join(', ')}`
    : ''

  const promptText = `You are a creative project idea generator.

${categoryText}

${excludeText}

Create practical, useful, and interesting project ideas that can be built as web apps.

Return a JSON object with this exact structure:
{
  "projects": [
    {
      "name": "Project Name",
      "shortDescription": "One sentence describing the project (max 120 characters)",
      "fullDescription": "2-3 sentences explaining what this project does",
      "keyFeatures": [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4"
      ],
      "difficulty": "Easy",
      "tags": ["Tag1", "Tag2", "Tag3"],
      "sparkPrompt": "Build a web app called [name]. It should [description]. Features: [list features]. Design: clean and modern with good UX. Use React components and make it responsive."
    }
  ]
}

Difficulty must be one of: "Easy", "Medium", or "Advanced"
Each project must have 4-5 key features.
Each project must have 3-5 tags.
The sparkPrompt should be detailed and include: project description, all key features, design requirements, and any special functionality.`

  const prompt = spark.llmPrompt`${promptText}`

  try {
    const response = await spark.llm(prompt, 'gpt-4o-mini', true)
    
    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response from LLM')
    }

    const parsed = JSON.parse(response.trim())
    
    if (!parsed.projects || !Array.isArray(parsed.projects)) {
      throw new Error('Response missing projects array')
    }

    if (parsed.projects.length === 0) {
      throw new Error('No projects generated')
    }

    const validatedProjects = parsed.projects.slice(0, count).map((p: any, index: number) => {
      if (!p.name || !p.shortDescription || !p.keyFeatures || !p.difficulty || !p.tags || !p.sparkPrompt) {
        throw new Error(`Project ${index} missing required fields`)
      }

      return {
        id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        name: p.name,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription || p.shortDescription,
        keyFeatures: Array.isArray(p.keyFeatures) ? p.keyFeatures.slice(0, 5) : [],
        difficulty: p.difficulty,
        tags: Array.isArray(p.tags) ? p.tags.slice(0, 5) : [],
        sparkPrompt: p.sparkPrompt,
        generatedAt: new Date().toISOString(),
        categories: categories.length > 0 ? categories : undefined,
        isFavorite: false
      }
    })

    return validatedProjects
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Generation failed: ${errorMessage}`)
  }
}
