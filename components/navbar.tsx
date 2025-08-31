"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Globe, User, Target, HelpCircle } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  const navItems = [
    { href: "/", label: "Home", icon: Globe },
    { href: "/bias", label: "Bias Detection", icon: Target },
    { href: "/about", label: "About", icon: HelpCircle },
  ]

  const authenticatedNavItems = [
    { href: "/", label: "Home", icon: Globe },
    { href: "/bias", label: "Bias Detection", icon: Target },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/about", label: "About", icon: HelpCircle },
  ]

  const currentNavItems = isSignedIn ? authenticatedNavItems : navItems

  const isActive = (href: string) => pathname === href

  return (
    <>
      <div className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="mx-auto max-w-7xl bg-background/30 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl shadow-black/10">
          <div className="flex h-16 items-center justify-between px-6 relative">
            {/* Logo - Left Side */}
            <motion.div 
              className="flex-shrink-0 z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Globe className="h-8 w-8 text-primary transition-colors duration-200" />
                  <span className="text-xl font-semibold text-foreground">
                    TruSight
                  </span>
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Navigation - Absolutely Centered */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2 absolute left-1/2 transform -translate-x-1/2">
              {currentNavItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        size="sm"
                        className={`h-9 px-4 transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm ${
                          isActive(item.href) 
                            ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25" 
                            : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Right side - Theme Toggle and Auth */}
            <motion.div 
              className="flex items-center space-x-4 flex-shrink-0 z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Theme Toggle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Authentication */}
              <div className="flex items-center space-x-2">
                {isSignedIn ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200",
                          userButtonPopoverCard: "bg-background/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/20 rounded-xl",
                          userButtonPopoverActionButton: "text-foreground hover:bg-white/10 dark:hover:bg-white/5 transition-colors",
                        }
                      }}
                    />
                  </motion.div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200 backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button 
                        size="sm"
                        className="bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9 rounded-full hover:bg-white/10 dark:hover:bg-white/5 backdrop-blur-sm"
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
            </motion.div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation - Separate from main navbar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-20 left-4 right-4 z-40 lg:hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="bg-background/95 backdrop-blur-2xl border border-border rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="p-4 space-y-2">
                {currentNavItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant={isActive(item.href) ? "default" : "ghost"}
                          className={`w-full justify-start h-12 text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    </motion.div>
                  )
                })}
                
                {/* Mobile Auth Buttons */}
                {!isSignedIn && (
                  <motion.div 
                    className="flex flex-col space-y-2 pt-4 border-t border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <SignInButton mode="modal">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 h-12"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button 
                        className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
