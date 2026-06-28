import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MAIN_CATEGORIES } from '@/lib/categories'
import { CategorySelection } from '@/lib/types'
import { 
  Sparkle, BookOpen, Heart, CheckSquare, Palette, 
  Users, House, CurrencyDollar, CookingPot, Airplane, 
  Briefcase, DotsThree 
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
  'dots-three': DotsThree
}

export function CategorySelector({ selection, onSelectionChange }: CategorySelectorProps) {
  const selectedMainCategory = MAIN_CATEGORIES.find(
    cat => cat.name === selection.mainCategory
  )

  const handleMainCategoryClick = (categoryName: string) => {
    if (selection.mainCategory === categoryName) {
      onSelectionChange({ mainCategory: null, subCategories: [] })
    } else {
      onSelectionChange({ mainCategory: categoryName, subCategories: [] })
    }
  }

  const handleSubCategoryClick = (subCategoryName: string) => {
    const currentSubs = selection.subCategories || []
    if (currentSubs.includes(subCategoryName)) {
      onSelectionChange({
        ...selection,
        subCategories: currentSubs.filter(s => s !== subCategoryName)
      })
    } else {
      onSelectionChange({
        ...selection,
        subCategories: [...currentSubs, subCategoryName]
      })
    }
  }

  const clearSelection = () => {
    onSelectionChange({ mainCategory: null, subCategories: [] })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Category</h3>
        {selection.mainCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1" weight="bold" size={16} />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="h-[200px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {MAIN_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon] || DotsThree
            const isSelected = selection.mainCategory === category.name

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

      {selectedMainCategory && (
        <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              Sub-Categories for {selectedMainCategory.name}
            </span>
            <span className="text-xs text-muted-foreground">
              (optional - select one or more)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedMainCategory.subCategories.map((subCat) => {
              const isSelected = selection.subCategories.includes(subCat)
              return (
                <Badge
                  key={subCat}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'hover:border-accent hover:bg-accent/10'
                  }`}
                  onClick={() => handleSubCategoryClick(subCat)}
                >
                  {subCat}
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
