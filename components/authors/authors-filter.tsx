"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface AuthorsFilterProps {
  onSearch: (query: string) => void
  onSort: (sortBy: 'alphabetical' | 'popular') => void
}

export default function AuthorsFilter({ onSearch, onSort }: AuthorsFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<'alphabetical' | 'popular'>('alphabetical')
  
  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'alphabetical' | 'popular'
    setSortBy(value)
    onSort(value)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
            aria-label="Search authors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm whitespace-nowrap">
          Sort by:
        </label>
        <select 
          id="sort" 
          value={sortBy} 
          onChange={handleSortChange} 
          className="form-select"
          aria-label="Sort authors"
        >
          <option value="alphabetical">Alphabetical</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  )
}
