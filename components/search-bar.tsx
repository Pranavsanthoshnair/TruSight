"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, TrendingUp, Globe, Zap } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onCategorySelect: (category: string) => void
  selectedCategory: string
}

const popularCategories = [
  { id: "general", label: "General", icon: Globe },
  { id: "technology", label: "Technology", icon: Zap },
  { id: "business", label: "Business", icon: TrendingUp },
  { id: "sports", label: "Sports", icon: TrendingUp },
  { id: "entertainment", label: "Entertainment", icon: TrendingUp },
  { id: "health", label: "Health", icon: TrendingUp },
  { id: "science", label: "Science", icon: TrendingUp },
]

export function SearchBar({ onSearch, onCategorySelect, selectedCategory }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      onSearch(searchQuery.trim())
      // Reset search state after a delay
      setTimeout(() => setIsSearching(false), 1000)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId === selectedCategory ? "" : categoryId)
  }

  const clearSearch = () => {
    setSearchQuery("")
    onSearch("")
  }

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for news topics, keywords, or sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-20 h-12 text-base border-border/50 focus:border-border transition-colors"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className="h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                  Search
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Category Pills */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Popular Categories:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularCategories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id
            return (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-3 w-3" />
                {category.label}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
