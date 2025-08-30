
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Search, Globe, User } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/bias", label: "Bias Detection" },
    { href: "/about", label: "About" },
  ]

  const authenticatedNavItems = [
    { href: "/", label: "Home" },
    { href: "/bias", label: "Bias Detection" },
    { href: "/analyze", label: "Analyze" },
    { href: "/profile", label: "Profile" },
    { href: "/about", label: "About" },
  ]

  const currentNavItems = isSignedIn ? authenticatedNavItems : navItems

  const isActive = (href: string) => pathname === href

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <Globe className="h-9 w-9 text-primary" />
                <span className="text-2xl font-serif font-bold text-foreground">
                  TruSight
                </span>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="h-9 w-9 bg-muted/60 rounded-lg animate-pulse" />
              <div className="h-9 w-9 bg-muted/60 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Desktop Navigation - Left aligned */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            {currentNavItems.map((item, index) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`relative px-4 py-3 text-sm font-medium transition-all duration-300 hover:text-primary rounded-lg hover:bg-muted/30 ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Logo - Centered */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                className="p-2 rounded-xl bg-primary/10"
              >
                <Globe className="h-9 w-9 text-primary" />
              </motion.div>
              <span className="text-3xl font-serif font-bold text-foreground tracking-tight">
                TruSight
              </span>
            </motion.div>
          </Link>

          {/* Right side - Search, Theme Toggle, and Auth */}
          <div className="flex items-center space-x-6">
            {/* Search Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex h-10 w-10 hover:bg-muted/50 hover-scale focus-ring rounded-xl"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Authentication */}
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10",
                        userButtonPopoverCard: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                        userButtonPopoverActionButton: "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                      }
                    }}
                  />
                </motion.div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 px-4 hover:bg-muted/50 hover-scale focus-ring rounded-lg font-medium"
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        size="sm" 
                        className="h-9 px-5 hover-scale focus-ring rounded-lg font-medium shadow-sm"
                      >
                        Sign Up
                      </Button>
                    </motion.div>
                  </SignUpButton>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-muted/50 hover-scale focus-ring rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden border-t border-border/60 mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div 
                className="space-y-2 py-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {currentNavItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={`block px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-lg mx-2 ${
                          isActive(item.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </div>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Auth Buttons */}
                {!isSignedIn && (
                  <motion.div 
                    className="flex flex-col space-y-3 pt-4 mt-4 border-t border-border/60 mx-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full justify-start hover:bg-muted/50 hover-scale focus-ring rounded-lg h-11">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full justify-start hover-scale focus-ring rounded-lg h-11 shadow-sm">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
