"use client"

import Link from "next/link"
import { ShinyButton } from "@/components/ui/shiny-button"
import { motion } from "framer-motion"

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold font-display">
              YourSaaS
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShinyButton variant="secondary" className="hidden sm:inline-flex">
              Sign In
            </ShinyButton>
            <ShinyButton>Get Started</ShinyButton>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
