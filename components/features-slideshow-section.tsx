"use client"

import { Download, School } from "lucide-react"
import { ShinyButton } from "@/components/ui/shiny-button"
import Link from "next/link"

export function ScriptureHeroSection() {
  return (
    <section className="relative pt-32 pb-12 flex items-center justify-center bg-white overflow-hidden">

      {/* Smaller container */}
      <div className="mx-auto px-6 text-center max-w-3xl bg-white relative z-10">
        {/* Verse */}
        <blockquote className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-gray-700 tracking-wide">
          “Let the little children come to me and do not hinder them,
          for the kingdom of heaven belongs to such as these.”
        </blockquote>

        <cite className="block mt-6 text-lg sm:text-xl text-gray-500 font-medium">
          Matthew 19:14
        </cite>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <ShinyButton className="text-base px-8 py-5 font-medium flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Download for Teachers
          </ShinyButton>

          <Link href="/form">
            <ShinyButton
              variant="secondary"
              className="text-base px-8 py-5 font-medium backdrop-blur border border-black/10 flex items-center"
            >
              <School className="w-5 h-5 mr-2" />
              Add Your School
            </ShinyButton>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ScriptureHeroSection