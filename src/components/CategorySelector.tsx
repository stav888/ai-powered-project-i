import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MAIN_CATEGORIES } from '@/lib/categories'
import { CategorySelection } from '@/lib/types'
import { 
  Sparkle, BookOpen, Heart, CheckSquare, Palette, 
  Users, House, CurrencyDollar, CookingPot, Airplane, 
  Briefcase, DotsThree, Plant, HouseLine, GameController,
  HandsClapping, Moon, FilmStrip, Robot, FlowArrow,
  ListChecks, TerminalWindow, Brain, ChartLine, PenNib,
  Browser, GitBranch, Chats
} from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X } from '@phosphor-icons/react'

interface CategorySelectorProps {
  selection: CategorySelection
  onSelectionChange: (selection: CategorySelection) => void
}

const iconMap: Record<string, any> = {
  'sparkles': Sparkle,
  'book': BookOpen,
  'heart': Heart,
  'check-square': CheckSquare,
  'palette': Palette,
  'users': Users,
  'home': House,
  'currency-dollar': CurrencyDollar,
  'cooking-pot': CookingPot,
  'airplane': Airplane,
  'briefcase': Briefcase,
  'dots-three': DotsThree,
  'plant': Plant,
  'house-line': HouseLine,
  'game-controller': GameController,
  'hands-clapping': HandsClapping,
  'moon': Moon,
  'film-strip': FilmStrip,
  'robot': Robot,
  'flow-arrow': FlowArrow,
  'list-checks': ListChecks,
  'terminal-window': TerminalWindow,
  'brain': Brain,
  'chart-line': ChartLine,
  'pen-nib': PenNib,
  'browser': Browser,
  'git-branch': GitBranch,
  'chats': Chats
}

export function CategorySelector({ selection, onSelectionChange }: CategorySelectorProps) {
  const handleMainCategoryClick = (categoryName: string) => {
    const isCurrentlySelected = selection.mainCategories.includes(categoryName)
    
    if (isCurrentlySelected) {
      const newSubCategories = { ...selection.subCategories }
      delete newSubCategories[categoryName]
      
      onSelectionChange({
        mainCategories: selection.mainCategories.filter(c => c !== categoryName),
        subCategories: newSubCategories
      })
    } else {
      onSelectionChange({
        mainCategories: [...selection.mainCategories, categoryName],
        subCategories: selection.subCategories
      })
    }
  }

  const handleSubCategoryClick = (mainCategoryName: string, subCategoryName: string) => {
    const currentSubs = selection.subCategories[mainCategoryName] || []
    const newSubCategories = { ...selection.subCategories }
    
    if (currentSubs.includes(subCategoryName)) {
      newSubCategories[mainCategoryName] = currentSubs.filter(s => s !== subCategoryName)
      if (newSubCategories[mainCategoryName].length === 0) {
        delete newSubCategories[mainCategoryName]
      }
    } else {
      newSubCategories[mainCategoryName] = [...currentSubs, subCategoryName]
    }

    onSelectionChange({
      ...selection,
      subCategories: newSubCategories
    })
  }

  const clearSelection = () => {
    onSelectionChange({ mainCategories: [], subCategories: {} })
  }

  const selectedCategories = MAIN_CATEGORIES.filter(cat => 
    selection.mainCategories.includes(cat.name)
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Select Categories</h3>
          <span className="text-xs text-muted-foreground">(select multiple)</span>
        </div>
        {selection.mainCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1" weight="bold" size={16} />
            Clear All
          </Button>
        )}
      </div>

      <ScrollArea className="h-[280px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {MAIN_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon] || DotsThree
            const isSelected = selection.mainCategories.includes(category.name)

            return (
              <Button
                key={category.name}
                variant={isSelected ? 'default' : 'outline'}
                className={`h-auto py-4 px-4 flex flex-col items-center gap-2 ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'hover:border-accent hover:bg-accent/5'
                }`}
                onClick={() => handleMainCategoryClick(category.name)}
              >
                <Icon size={24} weight={isSelected ? 'fill' : 'regular'} />
                <span className="text-xs text-center leading-tight font-medium">
                  {category.name}
                </span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {selectedCategories.length > 0 && (
        <div className="flex flex-col gap-4">
          {selectedCategories.map((category) => (
            <div 
              key={category.name}
              className="flex flex-col gap-3 p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  (optional sub-categories)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.subCategories.map((subCat) => {
                  const isSelected = (selection.subCategories[category.name] || []).includes(subCat)
                  return (
                    <Badge
                      key={subCat}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                          : 'hover:border-accent hover:bg-accent/10'
                      }`}
                      onClick={() => handleSubCategoryClick(category.name, subCat)}
                    >
                      {subCat}
                    </Badge>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
