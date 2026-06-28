import { ProjectIdea, CategorySelection } from './types'

export async function generateProjectIdeas(
  count: number,
  excludeNames: string[],
  categorySelection?: CategorySelection
): Promise<ProjectIdea[]> {
  const excludeList = excludeNames.length > 0 
    ? `\n\nIMPORTANT: Do NOT generate any projects with these names (already generated): ${excludeNames.join(', ')}`
    : ''

  let categoryContext = ''
  const categories: string[] = []
  
  if (categorySelection && categorySelection.mainCategories.length > 0) {
    categories.push(...categorySelection.mainCategories)
    
    if (categorySelection.mainCategories.length === 1) {
      const mainCat = categorySelection.mainCategories[0]
      categoryContext = `\n\nFOCUS: Generate project ideas for the "${mainCat}" category. Make them practical, useful, and specifically tailored to this domain.`
    } else {
      categoryContext = `\n\nFOCUS: Generate innovative project ideas that combine multiple categories: ${categorySelection.mainCategories.join(', ')}. Create projects that authentically blend these domains in interesting and practical ways.`
    }
  }

  const baseTopics = (categorySelection && categorySelection.mainCategories.length > 0)
    ? `projects for: ${categorySelection.mainCategories.join(', ')}`
    : `creative and practical projects across different domains`

  const inspirationText = `Create projects that feel modern, practical, and well-designed for GitHub Spark's capabilities.`

  const promptText = `You are an expert AI product designer and project idea generator.

Generate exactly ${count} unique, innovative project ideas for ${baseTopics}.
${categoryContext}

${inspirationText}

For each project idea, provide:
1. A catchy, memorable project name (2-4 words)
2. A compelling short description (1-2 sentences, max 150 characters)
3. A detailed full description (2-3 sentences explaining the concept)
4. 4-5 specific key features (each 1 sentence, actionable and clear)
5. Difficulty level: "Easy", "Medium", or "Advanced"
6. 3-5 relevant tags (e.g., "Productivity", "AI", "Learning", etc.)
7. A comprehensive Spark prompt that could be used to build this project in GitHub Spark

The Spark prompt should be highly detailed, elaborate, and production-ready. It must include:
- Clear and compelling project description with context and purpose
- Complete feature list with specific functionality and user interactions
- Detailed UI/UX requirements (modern design, color scheme suggestions, layout structure, component hierarchy)
- Specific AI/LLM behavior specifications (if relevant) including prompt engineering approaches, context handling, and response formatting
- User interaction flows and edge cases
- Data persistence strategy (using useKV for persistent data like user preferences/saved items, useState for temporary UI state)
- Responsive design requirements and mobile considerations
- Error handling and loading states
- Accessibility considerations
- Any third-party integrations or APIs needed
- Example data structures or schemas when relevant

Make the Spark prompt significantly more complete, structured, and actionable than a basic description. It should be a comprehensive blueprint that a developer could use immediately.
${excludeList}

Return the result as a valid JSON object with a single property called "projects" that contains an array of project objects.

Use this exact format:
{
  "projects": [
    {
      "name": "Project Name Here",
      "shortDescription": "Brief catchy description",
      "fullDescription": "Longer detailed description of what this project does and why it matters.",
      "keyFeatures": [
        "Feature 1 description",
        "Feature 2 description",
        "Feature 3 description",
        "Feature 4 description"
      ],
      "difficulty": "Easy|Medium|Advanced",
      "tags": ["Tag1", "Tag2", "Tag3"],
      "sparkPrompt": "Complete detailed prompt for building in Spark..."
    }
  ]
}`

  const prompt = spark.llmPrompt`${promptText}`

  try {
    const response = await spark.llm(prompt, 'gpt-4o', true)
    
    if (!response || typeof response !== 'string') {
      console.error('Invalid LLM response:', response)
      throw new Error('LLM returned an invalid response')
    }

    let parsed
    try {
      parsed = JSON.parse(response)
    } catch (parseError) {
      console.error('Failed to parse LLM response:', response)
      console.error('Parse error:', parseError)
      throw new Error('Failed to parse LLM response as JSON')
    }
    
    if (!parsed.projects || !Array.isArray(parsed.projects)) {
      console.error('Invalid response structure:', parsed)
      throw new Error('LLM response missing projects array')
    }

    if (parsed.projects.length !== count) {
      console.warn(`Expected ${count} projects but got ${parsed.projects.length}`)
    }

    const validatedProjects = parsed.projects.map((p: any, index: number) => {
      if (!p.name || !p.shortDescription || !p.keyFeatures || !p.difficulty || !p.tags || !p.sparkPrompt) {
        console.error(`Project ${index} is missing required fields:`, p)
        throw new Error(`Project ${index} is incomplete`)
      }

      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: p.name,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription || p.shortDescription,
        keyFeatures: Array.isArray(p.keyFeatures) ? p.keyFeatures : [],
        difficulty: p.difficulty,
        tags: Array.isArray(p.tags) ? p.tags : [],
        sparkPrompt: p.sparkPrompt,
        generatedAt: new Date().toISOString(),
        categories: categories.length > 0 ? categories : undefined,
        isFavorite: false
      }
    })

    return validatedProjects
  } catch (error) {
    console.error('Error generating ideas:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate project ideas: ${error.message}`)
    }
    throw new Error('Failed to generate project ideas')
  }
}
