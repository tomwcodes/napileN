"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

export default function ContentFilter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("recent")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // This would be replaced with Appwrite query in phase 2
    console.log("Searching for:", searchTerm)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex-1">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        </form>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="filter" className="text-sm whitespace-nowrap">
          Sort by:
        </label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="form-select">
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="comments">Most Comments</option>
        </select>
      </div>
    </div>
  )
}

