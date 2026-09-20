"use client"

import { useState } from "react"
import Link from "next/link"
import { ShinyButton } from "@/components/ui/shiny-button"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

const links = [
  { href: "/how-it-works", label: "See How It Works" },
  { href: "/changelog", label: "Changelog" },
]

export function Navigation() {
  const [open, setOpen] = useState(false)

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
              rolecaller.
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ShinyButton variant="secondary" href="/sign-in">
                Admin Sign In
              </ShinyButton>
            </div>
            <ShinyButton href="/form">Add Your School</ShinyButton>
            <button
              type="button"
              className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="md:hidden flex flex-col gap-1 pb-4 border-t border-border pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-foreground"
            >
              Admin Sign In
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  )
}
