"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface AuthorsFilterProps {
  onSearch: (query: string) => void
}

export default function AuthorsFilter({ onSearch }: AuthorsFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

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
    </div>
  )
}
