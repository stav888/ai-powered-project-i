# AI-Powered Project Ideas Generator

A sophisticated web application that generates unique, high-quality project ideas tailored to AI/ML developers, complete with ready-to-use prompts for building in GitHub Spark.

**Experience Qualities**:
1. **Inspiring** - Each project idea should spark creativity and make users excited to build
2. **Professional** - Portfolio-quality design that feels premium and trustworthy
3. **Efficient** - Seamless generation and management of ideas with instant access to build prompts

**Complexity Level**: Light Application (multiple features with basic state)
This is a project idea generator with state management for history, LLM integration for generating unique ideas, and clipboard functionality. It requires managing generated ideas, preventing duplicates, and persisting history.

## Essential Features

### Feature 1: AI Project Idea Generation
- **Functionality**: Generates 3 unique, never-before-seen project ideas using AI
- **Purpose**: Provides developers with curated, actionable project suggestions
- **Trigger**: User clicks "Generate 3 New Ideas" button
- **Progression**: Button click → Loading state → LLM generates 3 unique ideas → Cards appear with smooth animation → Ideas added to history
- **Success criteria**: Exactly 3 new cards appear, no duplicates from session, ideas are relevant to AI/ML/productivity domains

### Feature 2: Persistent History Management
- **Functionality**: Automatically saves all generated ideas with timestamps and displays them in chronological order
- **Purpose**: Allows users to review past ideas and access them later
- **Trigger**: Automatic save after generation; user can scroll to history section
- **Progression**: Ideas generated → Automatically saved to persistent storage → Displayed in "Previously Generated Ideas" section → User can click to view full details
- **Success criteria**: All ideas persist across sessions, chronologically ordered, clickable to expand details

### Feature 3: Copy Spark Prompt
- **Functionality**: Generates and copies a comprehensive, ready-to-use prompt for building the project in GitHub Spark
- **Purpose**: Removes friction between inspiration and action
- **Trigger**: User clicks "Copy Prompt to Build in Spark" button on any project card
- **Progression**: Button click → Prompt generated with full specifications → Copied to clipboard → Visual confirmation toast appears
- **Success criteria**: Prompt is detailed, actionable, and successfully copies to clipboard with user feedback

### Feature 4: Initial Project Display
- **Functionality**: Shows 6 pre-generated project ideas on first load
- **Purpose**: Provides immediate value without requiring user action
- **Trigger**: Page loads for the first time (no history exists)
- **Progression**: Page loads → Check for history → If none, generate 6 initial ideas → Display cards → Save to history
- **Success criteria**: 6 diverse, high-quality ideas appear immediately on first visit

## Edge Case Handling

- **No history on first visit**: Generate 6 initial ideas automatically
- **Duplicate prevention**: Track all generated idea names in session to prevent repeats
- **LLM failure**: Show friendly error message with retry option
- **Clipboard API unavailable**: Fall back to manual copy with instructions
- **Long history lists**: Virtual scrolling or pagination for performance with 50+ ideas
- **Mobile viewport**: Cards stack vertically, buttons remain easily tappable

## Design Direction

The design should evoke feelings of **inspiration, clarity, and professional sophistication**. Think of a high-end portfolio site meets a premium SaaS product - clean, spacious, and elegant. The interface should feel calm and focused, allowing the project ideas to shine without visual clutter. Subtle animations and interactions should feel refined and purposeful, never gimmicky.

## Color Selection

A refined, modern palette that communicates innovation and professionalism with high contrast for readability.

- **Primary Color**: Deep indigo `oklch(0.35 0.15 270)` - Represents innovation, AI, and technical sophistication
- **Secondary Colors**: 
  - Soft slate gray `oklch(0.95 0.005 270)` for backgrounds - Creates calm, spacious feel
  - Medium slate `oklch(0.65 0.02 270)` for secondary text - Professional and readable
- **Accent Color**: Electric cyan `oklch(0.70 0.18 210)` - Eye-catching for CTAs and important actions, represents cutting-edge technology
- **Foreground/Background Pairings**:
  - Primary (Deep Indigo #3D2D6B): White text (#FFFFFF) - Ratio 8.2:1 ✓
  - Accent (Electric Cyan #2DB9DA): Dark gray (#1A1A1A) - Ratio 7.1:1 ✓
  - Background (Soft Slate #F5F5F7): Dark text (#1A1A1A) - Ratio 14.8:1 ✓
  - Cards (Pure White #FFFFFF): Dark text (#1A1A1A) - Ratio 16.5:1 ✓

## Font Selection

Typography should feel modern, technical yet approachable, with excellent readability for both headings and body text.

**Primary Font**: Space Grotesk (headings) - Modern geometric sans with technical character
**Secondary Font**: Inter (body) - Exceptional readability and professional feel

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold/48px/tight (-0.02em)
  - H2 (Section Titles): Space Grotesk Semibold/32px/tight (-0.01em)
  - H3 (Project Names): Space Grotesk Semibold/24px/normal
  - Body (Descriptions): Inter Regular/16px/relaxed (1.6)
  - Small (Tags, Meta): Inter Medium/14px/normal
  - Button Text: Inter Semibold/16px/normal

## Animations

Animations should feel purposeful and refined - enhancing clarity rather than showing off. Use smooth, natural timing with slight ease-in-out curves.

**Key Animations**:
- **Card entrance**: Subtle fade-up with stagger (200ms delay between cards)
- **Button interactions**: Gentle scale on hover (1.02x), quick press feedback
- **Copy confirmation**: Toast slides in from top with bounce
- **Loading state**: Elegant pulse on generate button
- **History expansion**: Smooth height transition when clicking past ideas

## Component Selection

- **Components**:
  - `Card` - Main container for project ideas with custom styling
  - `Button` - Primary CTA with variants for generate vs copy actions
  - `Badge` - Difficulty levels and tags with custom color schemes
  - `ScrollArea` - For history section if list grows long
  - `Separator` - Clean division between sections
  - `Tooltip` - Helpful hints on interactive elements
  - Sonner `toast` - Success feedback for copy actions

- **Customizations**:
  - Custom project card component with hover effects and shadow elevation
  - Difficulty badge with color coding (green/amber/purple)
  - Tag system with subtle background colors
  - Hero section with gradient background pattern

- **States**:
  - Generate button: Default (gradient) / Hover (lifted) / Loading (pulsing) / Disabled (muted)
  - Copy button: Default (outline) / Hover (filled) / Success (checkmark briefly)
  - Project cards: Default (subtle shadow) / Hover (elevated shadow + scale)
  - History items: Collapsed (preview only) / Expanded (full details)

- **Icon Selection**:
  - Sparkles (generation/AI magic)
  - Copy/ClipboardText (copy to clipboard)
  - Clock/CalendarBlank (timestamps)
  - Tag (category tags)
  - Check (success confirmation)
  - Lightbulb (ideas/inspiration)

- **Spacing**:
  - Page padding: px-6 md:px-12 lg:px-24
  - Section gaps: gap-16 md:gap-24
  - Card grid: gap-6 md:gap-8
  - Card internal padding: p-6 md:p-8
  - Element spacing: gap-4 (default), gap-6 (sections)

- **Mobile**:
  - Single column card layout on mobile
  - Larger touch targets (min 44px)
  - Sticky generate button on mobile
  - Collapsible history by default on small screens
  - Reduced padding but maintained breathing room
