# AI-Powered Project Ideas Generator (Enhanced)

A sophisticated web application that generates unique, high-quality project ideas across diverse life categories and tool domains, complete with ready-to-use prompts for building in GitHub Spark.

**Experience Qualities**:
1. **Inspiring** - Each project idea sparks creativity across all aspects of life, from spirituality to technical tools
2. **Organized** - Intuitive category system with 27 main categories (Life Areas + Tools) and sub-categories for targeted idea generation
3. **Discoverable** - Powerful search functionality and favorites system to find and refine relevant ideas

**Complexity Level**: Light Application (multiple features with basic state)
This is an enhanced project idea generator with multi-category selection, favorites-based generation, search functionality, state management for history, LLM integration for context-aware generation, and clipboard functionality.

## Essential Features

### Feature 1: Multi-Category Selection & AI Generation
- **Functionality**: Users select from 27 main categories (Life Areas + Tools) and optional sub-categories to generate targeted project ideas
- **Purpose**: Provides personalized, relevant project suggestions that combine multiple domains creatively
- **Trigger**: User selects multiple categories → optionally selects sub-categories → clicks "Generate 3 New Ideas"
- **Progression**: Multi-category selection → Visual feedback → LLM generates 3 ideas combining selected categories → Cards appear with smooth animation → Ideas saved to history with category metadata
- **Success criteria**: Generated ideas authentically combine the selected categories, no repetition within session, relevant tags and features

### Feature 2: Favorites System with Smart Generation
- **Functionality**: Users can mark projects as favorites (heart icon) and generate new ideas based on favorite patterns
- **Purpose**: Allows personalized idea generation based on user preferences and interests
- **Trigger**: User marks favorites → enables "Generate from Favorites" toggle → clicks generate
- **Progression**: User favorites projects → System analyzes favorite categories → Generates new ideas inspired by those patterns → New ideas display with similar themes
- **Success criteria**: Favorites persist across sessions, generate button adapts to favorites, new ideas reflect favorite themes

### Feature 3: Real-Time Search
- **Functionality**: Search across all generated ideas by name, description, tags, or categories
- **Purpose**: Quickly find previously generated ideas without scrolling through history
- **Trigger**: User types in search bar at top of page
- **Progression**: User types query → Results filter in real-time → Matching ideas display → User can clear search to return to main view
- **Success criteria**: Search is instant, matches are relevant, shows result count, graceful empty state

### Feature 4: Persistent History with Timestamps
- **Functionality**: Automatically saves all generated ideas with generation timestamps and category context
- **Purpose**: Allows users to review past ideas and track when they were created
- **Trigger**: Automatic save after each generation
- **Progression**: Ideas generated → Saved with timestamp and categories → Displayed in "Previously Generated Ideas" section → Older ideas show generation date
- **Success criteria**: All ideas persist across sessions, chronologically ordered, category info preserved

### Feature 5: Copy Spark Prompt
- **Functionality**: Generates and copies a comprehensive, ready-to-use prompt for building the project in GitHub Spark
- **Purpose**: Removes friction between inspiration and action
- **Trigger**: User clicks "Copy Prompt to Build in Spark" on any project card
- **Progression**: Button click → Prompt copied to clipboard → Visual success toast with checkmark → Button shows "Copied!" briefly
- **Success criteria**: Prompt is detailed, actionable, successfully copies with user feedback

### Feature 6: Initial Project Display
- **Functionality**: Shows 6 pre-generated diverse project ideas on first load
- **Purpose**: Provides immediate value and demonstrates the app's capabilities
- **Trigger**: Page loads for the first time (no history exists)
- **Progression**: Page loads → Check for history → If none, generate 6 initial ideas across various themes → Display cards → Save to history
- **Success criteria**: 6 diverse, high-quality ideas from different categories appear immediately on first visit

## Edge Case Handling

- **No history on first visit**: Generate 6 diverse initial ideas automatically
- **No favorites selected**: Disable/hide "Generate from Favorites" toggle
- **Duplicate prevention**: Track all generated idea names in session to prevent repeats
- **LLM failure**: Show friendly error message with retry option
- **Clipboard API unavailable**: Fallback with error toast
- **Empty search results**: Show clear message with button to clear search
- **Multiple categories without sub-categories**: Generate ideas that meaningfully combine main categories
- **Multiple categories with sub-categories**: Generate ideas that blend all selected domains
- **Long history lists**: Efficient rendering with proper sections
- **Mobile viewport**: Cards stack vertically, category grid responsive (2→3→4→5 columns), touch-friendly, favorites toggle accessible

## Design Direction

The design should evoke **inspiration, clarity, and professional sophistication** with a sense of **exploration and discovery**. The interface feels calm and organized, with the expanded category selector being inviting and the search being prominent. Favorites integration adds a personal touch. Subtle animations enhance the feeling of ideas "coming to life" without being distracting.

## Color Selection

A refined, modern palette that communicates innovation and versatility with excellent readability.

- **Primary Color**: Deep indigo `oklch(0.35 0.15 270)` - Represents innovation and thoughtful creativity
- **Secondary Colors**: 
  - Soft slate gray `oklch(0.95 0.005 270)` for backgrounds - Creates calm, spacious feel
  - Medium slate `oklch(0.50 0.02 270)` for secondary text - Professional and readable
- **Accent Color**: Electric cyan `oklch(0.70 0.18 210)` - Eye-catching for search, CTAs, and selection states
- **Favorite Color**: Red for favorited hearts - Clear visual indicator
- **Foreground/Background Pairings**:
  - Primary (Deep Indigo): White text - Ratio 8.2:1 ✓
  - Accent (Electric Cyan): Dark text - Ratio 7.1:1 ✓
  - Background (Soft Slate): Dark text - Ratio 14.8:1 ✓
  - Cards (Pure White): Dark text - Ratio 16.5:1 ✓
  - Selected Categories: Primary background with white text for clear distinction
  - Favorites: Red heart icons for clear favorited state

## Font Selection

Typography should feel modern, technical yet approachable, with excellent readability for both headings and body text.

**Primary Font**: Space Grotesk (headings) - Modern geometric sans with technical character
**Secondary Font**: Inter (body) - Exceptional readability and professional feel

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold/48px/tight (-0.02em)
  - H2 (Section Titles): Space Grotesk Semibold/32px/tight (-0.01em)
  - H3 (Project Names): Space Grotesk Semibold/24px/normal
  - Category Labels: Inter Medium/12px/tight
  - Body (Descriptions): Inter Regular/16px/relaxed (1.6)
  - Small (Tags, Meta): Inter Medium/14px/normal
  - Search Input: Inter Regular/16px/normal

## Animations

Animations should feel purposeful and refined - enhancing clarity and delight.

**Key Animations**:
- **Card entrance**: Subtle fade-up with stagger (100ms delay between cards)
- **Category selection**: Quick highlight transition with subtle scale
- **Favorite heart**: Smooth fill animation when toggled
- **Search interactions**: Smooth appearance of clear button
- **Button interactions**: Gentle hover lift, quick press feedback
- **Copy confirmation**: Toast slides in from top with success icon
- **Loading state**: Elegant rotating sparkle on generate button
- **Scroll behavior**: Smooth scroll to new ideas after generation

## Component Selection

- **Components**:
  - `Card` - Project idea containers with hover effects and favorite button
  - `Button` - Primary CTAs with multiple variants (primary, outline, ghost)
  - `Badge` - Difficulty levels, tags, and sub-category pills
  - `Input` - Search bar with icon and clear button
  - `Switch` - Favorites generation toggle
  - `ScrollArea` - For expanded category grid overflow (280px height)
  - `Separator` - Clean division between current and history sections
  - Sonner `toast` - Success/error feedback
  - Custom `CategorySelector` - Grid of selectable categories (5 columns on XL) with sub-category expansion
  - Custom `SearchBar` - Prominent search with magnifying glass icon and clear functionality
  - Custom `ProjectCard` - Card with heart icon favorite button and copy prompt

- **Customizations**:
  - Category selector with icon grid (27 categories) and expandable sub-categories
  - Favorites toggle with heart icon and count display
  - Search bar with large target area and prominent placement
  - Project cards with heart button in top-right corner
  - Difficulty badges with custom color coding (green/amber/purple)
  - Sub-category badges that toggle on/off with visual feedback

- **States**:
  - Generate button: Default / Hover (lifted) / Loading (spinning sparkle) / Disabled (muted)
  - Copy button: Default / Hover (filled) / Success (checkmark briefly)
  - Favorite button: Unfavorited (outline heart) / Favorited (filled red heart) / Hover
  - Favorites toggle: Off (disabled if no favorites) / On (generates from favorites)
  - Category buttons: Unselected (outline) / Selected (filled primary) / Hover (subtle lift)
  - Sub-category badges: Unselected (outline) / Selected (accent filled) / Hover (background tint)
  - Search input: Empty / Typing / Has results / No results / Focused (border accent)
  - Project cards: Default (subtle shadow) / Hover (elevated shadow + transform)

- **Icon Selection**:
  - Sparkle (generation/AI magic, page header)
  - MagnifyingGlass (search functionality)
  - Heart (favorite system - filled when favorited)
  - Category icons: Sparkle, BookOpen, Heart, CheckSquare, Palette, Users, House, CurrencyDollar, CookingPot, Airplane, Briefcase, Plant, HouseLine, GameController, HandsClapping, Moon, FilmStrip, Robot, FlowArrow, ListChecks, TerminalWindow, Brain, ChartLine, PenNib, Browser, GitBranch, Chats
  - Copy (clipboard action)
  - Check (success confirmation)
  - Clock (timestamps, history section)
  - X (clear search, clear category selection)

- **Spacing**:
  - Page padding: px-6 md:px-12 lg:px-24
  - Section gaps: gap-12 md:gap-16
  - Card grid: gap-6 md:gap-8
  - Card internal padding: p-6 md:p-8
  - Category grid: gap-3
  - Category scroll area: h-[280px]
  - Search bar height: h-12

- **Mobile**:
  - Single column card layout on mobile
  - Category grid: 2 columns on mobile, 3 on tablet, 4 on desktop, 5 on XL screens
  - Search bar full width with responsive padding
  - Larger touch targets (min 44px)
  - Category selector with scrollable area
  - Favorites toggle easily accessible
  - Maintained breathing room with adjusted spacing
  - Sub-categories wrap gracefully in mobile view

## Main Categories

### Life Areas (17 categories):
1. **Spirituality & Manifestation**: Meditation, Affirmations, Astrology, Tarot, Energy practices
2. **Learning & Personal Growth**: Skills, Languages, Books, Courses, Knowledge management
3. **Health & Wellness**: Fitness, Nutrition, Mental health, Sleep, Habits
4. **Productivity**: Tasks, Time tracking, Focus, Notes, Project planning
5. **Creativity**: Writing, Art, Music, Photography, Content creation
6. **Relationships & Dating**: Dating apps, Communication, Compatibility, Gift planning
7. **Family**: Parenting, Chores, Family calendar, Meal planning, Kids activities
8. **Finance & Money**: Budgeting, Expenses, Investments, Savings, Bill tracking
9. **Food & Cooking**: Recipes, Meal planning, Groceries, Restaurants, Nutrition
10. **Travel & Experiences**: Trip planning, Travel journal, Bucket lists, Itineraries
11. **Career & Work**: Job search, Resume, Networking, Interview prep, Skills
12. **Environment & Sustainability**: Carbon footprint, Green habits, Sustainable shopping, Waste reduction, Smart energy, Green transportation
13. **Home & Household Management**: Task management, Home maintenance, Organization, Cleaning, Renovations, Bills
14. **Hobbies & Leisure**: Discovering hobbies, Tracking hobbies, Quality time, Creative leisure, Games, Rest
15. **Community & Social Involvement**: Volunteering, Community events, Neighbors, Giving, Groups, Social involvement
16. **Sleep & Recovery**: Sleep tracking, Evening routines, Naps, Activity-rest balance, Calming rituals, Energy tracking
17. **Entertainment & Culture**: Movies, Music, Books, Cultural events, Video games, Exploring cultures

### Tools (10 categories):
18. **AI Tools & Models**: LLM Integration, AI Agents, RAG Systems, Prompt Engineering, Model Fine-tuning, Contextual AI
19. **Automation & Workflow Tools**: Task Automation, Workflow Builders, Integration Tools, Batch Processing, API Orchestration
20. **Productivity & Task Management Tools**: Todo Lists, Kanban Boards, Time Blocking, Focus Timers, Goal Trackers, Progress Dashboards
21. **Development & CLI Tools**: Code Generators, CLI Utilities, Dev Productivity, Build Tools, Testing Tools, Debugging Helpers
22. **Knowledge Management & Second Brain Tools**: Note Taking Systems, Personal Knowledge Base, Zettelkasten, Link Management, Knowledge Graphs
23. **Tracking, Habits & Dashboard Tools**: Habit Trackers, Analytics Dashboards, Life Metrics, Data Visualization, Personal Analytics
24. **Design, Content & Creation Tools**: Design Systems, Content Generators, Asset Managers, Creative Templates, Style Guides
25. **Browser Extensions & Utilities**: Tab Management, Bookmark Tools, Web Clippers, Reading Enhancement, Privacy Tools
26. **Project & Code Management Tools**: Project Planning, Version Control UI, Code Review Tools, Documentation, Issue Tracking
27. **Communication & Collaboration Tools**: Team Chat, Video Meeting Tools, Collaborative Docs, Feedback Systems, Meeting Management
