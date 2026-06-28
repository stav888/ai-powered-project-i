import { Button } from '@/components/ui/button'
import { MAIN_CATEGORIES } from '@/lib/categories'
import { CategorySelection } from '@/lib/types'
import { 
  Sparkle, BookOpen, Heart, CheckSquare, Palette, 
  Users, CurrencyDollar, Briefcase, DotsThree, Robot, Brain
} from '@phosphor-icons/react'
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
  'currency-dollar': CurrencyDollar,
  'briefcase': Briefcase,
  'robot': Robot,
  'brain': Brain,
  'dots-three': DotsThree
}

export function CategorySelector({ selection, onSelectionChange }: CategorySelectorProps) {
  const handleCategoryClick = (categoryName: string) => {
    const isCurrentlySelected = selection.mainCategories.includes(categoryName)
    
    if (isCurrentlySelected) {
      onSelectionChange({
        mainCategories: selection.mainCategories.filter(c => c !== categoryName),
        subCategories: {}
      })
    } else {
      onSelectionChange({
        mainCategories: [...selection.mainCategories, categoryName],
        subCategories: {}
      })
    }
  }

  const clearSelection = () => {
    onSelectionChange({ mainCategories: [], subCategories: {} })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Select Categories</h3>
          <span className="text-xs text-muted-foreground">(select multiple)</span>
        </div>
        {selection.mainCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-muted-foreground hover:text-foreground h-8 px-3 text-xs"
          >
            <X className="mr-1.5" weight="bold" size={14} />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {MAIN_CATEGORIES.map((category) => {
          const Icon = iconMap[category.icon] || DotsThree
          const isSelected = selection.mainCategories.includes(category.name)

          return (
            <Button
              key={category.name}
              variant={isSelected ? 'default' : 'outline'}
              className={`h-auto py-3 px-3 flex flex-col items-center gap-1.5 ${
                isSelected 
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                  : 'hover:border-accent hover:bg-accent/5'
              }`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <Icon size={20} weight={isSelected ? 'fill' : 'regular'} />
              <span className="text-xs text-center leading-tight font-medium">
                {category.name}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
