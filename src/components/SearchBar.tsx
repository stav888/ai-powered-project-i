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
        className="absolute left-3 text-muted-foreground pointer-events-none" 
        size={16} 
        weight="bold"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 h-9 text-sm border-2 focus-visible:border-accent transition-colors"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="absolute right-1 h-7 w-7 p-0 hover:bg-muted"
        >
          <X size={14} weight="bold" />
        </Button>
      )}
    </div>
  )
}
