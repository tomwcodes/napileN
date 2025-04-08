"use client"

import { useState, useEffect } from "react"
import { User } from "@/lib/types"
import { getAllUsers } from "@/lib/data"
import AuthorsFilter from "@/components/authors/authors-filter"
import AuthorCard from "@/components/authors/author-card"
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination"

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<User[]>([])
  const [totalAuthors, setTotalAuthors] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  
  const authorsPerPage = 12
  const totalPages = Math.ceil(totalAuthors / authorsPerPage)
  
  // Fetch authors when page, search, or sort changes
  useEffect(() => {
    async function fetchAuthors() {
      setLoading(true)
      try {
        // Removed sortBy from getAllUsers call
        const result = await getAllUsers(currentPage, authorsPerPage, searchQuery) 
        setAuthors(result.users)
        setTotalAuthors(result.total)
      } catch (error) {
        console.error("Error fetching authors:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAuthors()
  }, [currentPage, searchQuery]) // Removed sortBy dependency
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => handlePageChange(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      )
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Skip first and last pages as they're always shown
      
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      )
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    return items
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Authors</h1>
      
      {/* Removed onSort prop */}
      <AuthorsFilter onSearch={handleSearch} /> 
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No authors found.</p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {renderPaginationItems()}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
