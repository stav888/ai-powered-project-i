import { ProjectIdea, CategorySelection } from './types'

export async function generateProjectIdeas(
  count: number,
  excludeNames: string[],
  categorySelection?: CategorySelection,
  favoriteProjects?: ProjectIdea[]
): Promise<ProjectIdea[]> {
  const excludeList = excludeNames.length > 0 
    ? `\n\nIMPORTANT: Do NOT generate any projects with these names (already generated): ${excludeNames.join(', ')}`
    : ''

  let categoryContext = ''
  const categories: string[] = []
  
  if (favoriteProjects && favoriteProjects.length > 0) {
    const favCategories = new Set<string>()
    favoriteProjects.forEach(proj => {
      if (proj.categories) {
        proj.categories.forEach(cat => favCategories.add(cat))
      }
    })
    
    if (favCategories.size > 0) {
      categories.push(...Array.from(favCategories))
      categoryContext = `\n\nFOCUS: Generate project ideas inspired by the user's favorite projects. Their favorites suggest interest in these categories: ${Array.from(favCategories).join(', ')}. Create similar but unique projects that would appeal to someone who liked those favorites.`
    }
  } else if (categorySelection && categorySelection.mainCategories.length > 0) {
    categories.push(...categorySelection.mainCategories)
    
    const subCatList: string[] = []
    Object.keys(categorySelection.subCategories).forEach(mainCat => {
      const subs = categorySelection.subCategories[mainCat]
      if (subs && subs.length > 0) {
        subCatList.push(...subs)
        categories.push(...subs)
      }
    })
    
    if (categorySelection.mainCategories.length === 1) {
      const mainCat = categorySelection.mainCategories[0]
      if (subCatList.length > 0) {
        categoryContext = `\n\nFOCUS: Generate project ideas that meaningfully combine "${mainCat}" with these specific sub-categories: ${subCatList.join(', ')}. The projects should authentically serve these combined purposes, not just superficially mention them.`
      } else {
        categoryContext = `\n\nFOCUS: Generate project ideas for the "${mainCat}" category. Make them practical, useful, and specifically tailored to this domain.`
      }
    } else {
      if (subCatList.length > 0) {
        categoryContext = `\n\nFOCUS: Generate innovative project ideas that combine multiple categories: ${categorySelection.mainCategories.join(', ')}. Also incorporate these sub-categories where relevant: ${subCatList.join(', ')}. Create projects that authentically blend these domains in interesting ways.`
      } else {
        categoryContext = `\n\nFOCUS: Generate innovative project ideas that combine multiple categories: ${categorySelection.mainCategories.join(', ')}. Create projects that authentically blend these domains in interesting and practical ways.`
      }
    }
  }

  const baseTopics = (categorySelection && categorySelection.mainCategories.length > 0)
    ? `projects combining: ${categorySelection.mainCategories.join(', ')}`
    : (favoriteProjects && favoriteProjects.length > 0)
    ? `projects inspired by user's favorites`
    : `developers interested in:
- AI Agents
- RAG (Retrieval Augmented Generation)
- LLM Tooling
- Learning Resources
- Productivity Tools`

  const inspirationText = (categorySelection && categorySelection.mainCategories.length > 0) || (favoriteProjects && favoriteProjects.length > 0)
    ? `Draw inspiration from successful apps and tools in this space, but make them feel modern, AI-enhanced where appropriate, and built for GitHub Spark's capabilities. The projects should feel:
- Smart and personalized (like AnythingLLM's contextual understanding)
- Evolving and agent-like (like Hermes Agent's adaptive behavior)
- High-quality and well-structured (like awesome-claude-skills prompting)
- Practical and actionable (like Aider's development approach)`
    : `Draw inspiration from:
- AnythingLLM (personal knowledge and contextual understanding)
- Hermes Agent (evolving, personalized agent-like experiences)
- Awesome Claude Skills (high-quality, structured prompting)
- Aider (practical and well-structured development approach)
- Chunkr (intelligent document and data processing)`

  const prompt = window.spark.llmPrompt`You are an expert AI product designer and project idea generator.

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

The Spark prompt should be detailed and include:
- Clear project description
- Complete feature list with specific functionality
- Design requirements (modern, clean, premium UI)
- Any AI/LLM behavior specifications if relevant
- User interaction flows
- Data persistence needs (using useKV for persistent data, useState for temporary UI state)
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

  try {
    const response = await window.spark.llm(prompt, 'gpt-4o', true)
    const parsed = JSON.parse(response)
    
    if (!parsed.projects || !Array.isArray(parsed.projects)) {
      throw new Error('Invalid response format')
    }

    return parsed.projects.map((p: any) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: p.name,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      keyFeatures: p.keyFeatures,
      difficulty: p.difficulty,
      tags: p.tags,
      sparkPrompt: p.sparkPrompt,
      generatedAt: new Date().toISOString(),
      categories: categories.length > 0 ? categories : undefined,
      isFavorite: false
    }))
  } catch (error) {
    console.error('Error generating ideas:', error)
    throw new Error('Failed to generate project ideas')
  }
}
