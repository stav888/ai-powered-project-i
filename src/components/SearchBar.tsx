import { Input } from '@/components/ui/input'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search projects...' }: SearchBarProps) {
  return (
    <div className="relative flex items-center w-full">
      <MagnifyingGlass 
        className="absolute left-4 text-muted-foreground pointer-events-none" 
        size={20} 
        weight="bold"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-12 h-12 text-base border-2 focus-visible:border-accent transition-colors"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="absolute right-2 h-8 w-8 p-0 hover:bg-muted"
        >
          <X size={16} weight="bold" />
        </Button>
      )}
    </div>
  )
}
