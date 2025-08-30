"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, TrendingUp, Globe, Zap, Sparkles, Filter } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onCategorySelect: (category: string) => void
  selectedCategory: string
}

const popularCategories = [
  { id: "general", label: "General", icon: Globe, color: "from-blue-500 to-blue-600" },
  { id: "technology", label: "Technology", icon: Zap, color: "from-purple-500 to-purple-600" },
  { id: "business", label: "Business", icon: TrendingUp, color: "from-green-500 to-green-600" },
  { id: "sports", label: "Sports", icon: TrendingUp, color: "from-orange-500 to-orange-600" },
  { id: "entertainment", label: "Entertainment", icon: TrendingUp, color: "from-pink-500 to-pink-600" },
  { id: "health", label: "Health", icon: TrendingUp, color: "from-red-500 to-red-600" },
  { id: "science", label: "Science", icon: TrendingUp, color: "from-indigo-500 to-indigo-600" },
]

export function SearchBar({ onSearch, onCategorySelect, selectedCategory }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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
    <motion.div 
      className="w-full space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            animate={{ 
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="h-5 w-5" />
          </motion.div>
          
          <Input
            type="text"
            placeholder="Search for news topics, keywords, or sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-12 pr-24 h-14 text-base border-border/50 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20 hover:border-border/70 rounded-xl shadow-sm"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="h-9 w-9 p-0 hover:bg-muted/50 hover-scale focus-ring rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                disabled={!searchQuery.trim() || isSearching}
                className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground hover-glow-primary focus-ring rounded-lg font-medium shadow-sm"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-3 w-3 border-b-2 border-current"
                    />
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </form>

      {/* Category Pills */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center gap-3 text-base text-muted-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="p-1.5 bg-muted/50 rounded-lg"
          >
            <TrendingUp className="h-4 w-4" />
          </motion.div>
          <span className="font-medium">Popular Categories:</span>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-1 bg-primary/10 rounded-lg"
          >
            <Sparkles className="h-3 w-3 text-primary" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {popularCategories.map((category, index) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id
            return (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r " + category.color + " text-white shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent hover:border-border/50"
                }`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.4 + index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: isSelected ? "0 10px 25px rgba(0,0,0,0.2)" : "0 5px 15px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <motion.div
                  animate={{ 
                    rotate: isSelected ? [0, 10, -10, 0] : 0,
                    scale: isSelected ? 1.1 : 1
                  }}
                  transition={{ 
                    duration: isSelected ? 2 : 0.2, 
                    repeat: isSelected ? Infinity : 0,
                    repeatDelay: isSelected ? 1 : 0
                  }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                {category.label}
                {isSelected && (
                  <motion.div
                    layoutId="selected-category"
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          className="flex items-center gap-4 pt-4 border-t border-border/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            className="flex items-center gap-2.5 text-sm text-muted-foreground/70"
            whileHover={{ scale: 1.02 }}
          >
            <div className="p-1.5 bg-muted/50 rounded-lg">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <span>Quick filters available</span>
          </motion.div>
          
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-sm text-primary/70 bg-primary/5 px-3 py-2 rounded-lg"
            >
              <span>Active:</span>
              <span className="font-semibold capitalize">{selectedCategory}</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
