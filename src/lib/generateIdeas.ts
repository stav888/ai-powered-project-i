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
    console.log('Generating ideas with prompt for categories:', categories)
    console.log('Calling LLM...')
    
    const response = await spark.llm(prompt, 'gpt-4o', true)
    
    console.log('LLM response received')
    console.log('Response type:', typeof response)
    console.log('Response length:', response?.length)
    
    if (!response || typeof response !== 'string') {
      console.error('Invalid LLM response type:', typeof response)
      throw new Error('LLM returned an invalid response (not a string)')
    }

    if (response.length === 0) {
      console.error('LLM returned empty string')
      throw new Error('LLM returned an empty response')
    }

    let parsed
    try {
      const cleanedResponse = response.trim()
      console.log('Attempting to parse response, first 200 chars:', cleanedResponse.substring(0, 200))
      parsed = JSON.parse(cleanedResponse)
      console.log('Successfully parsed JSON')
      console.log('Parsed keys:', Object.keys(parsed))
      console.log('Projects count:', parsed?.projects?.length)
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON')
      console.error('Response preview (first 500 chars):', response.substring(0, 500))
      console.error('Response preview (last 200 chars):', response.substring(Math.max(0, response.length - 200)))
      console.error('Parse error details:', parseError)
      throw new Error(`JSON parse failed: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`)
    }
    
    if (!parsed || typeof parsed !== 'object') {
      console.error('Parsed result is not an object:', parsed)
      throw new Error('LLM response is not a valid JSON object')
    }

    if (!parsed.projects) {
      console.error('Response missing "projects" key. Keys found:', Object.keys(parsed))
      throw new Error('LLM response missing "projects" property')
    }

    if (!Array.isArray(parsed.projects)) {
      console.error('"projects" is not an array, it is:', typeof parsed.projects)
      throw new Error('LLM response "projects" is not an array')
    }

    if (parsed.projects.length === 0) {
      console.error('LLM returned empty projects array')
      throw new Error('No projects were generated (empty array)')
    }

    console.log(`Processing ${parsed.projects.length} projects (expecting ${count})`)

    const validatedProjects = parsed.projects.slice(0, count).map((p: any, index: number) => {
      const missingFields = []
      if (!p.name) missingFields.push('name')
      if (!p.shortDescription) missingFields.push('shortDescription')
      if (!p.keyFeatures) missingFields.push('keyFeatures')
      if (!p.difficulty) missingFields.push('difficulty')
      if (!p.tags) missingFields.push('tags')
      if (!p.sparkPrompt) missingFields.push('sparkPrompt')
      
      if (missingFields.length > 0) {
        console.error(`Project ${index} (${p.name || 'unnamed'}) is missing fields:`, missingFields)
        console.error(`Project data:`, JSON.stringify(p, null, 2))
        throw new Error(`Project ${index} is missing required fields: ${missingFields.join(', ')}`)
      }

      return {
        id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
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

    console.log('✓ Successfully validated', validatedProjects.length, 'projects')
    return validatedProjects
    
  } catch (error) {
    console.error('❌ Error generating ideas - Full error:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate project ideas: ${error.message}`)
    }
    throw new Error(`Failed to generate project ideas: ${String(error)}`)
  }
}
