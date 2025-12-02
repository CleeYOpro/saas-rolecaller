"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "Vendors & Manufacturers",
    description:
      "Get paid upfront, empower customers with flexible payments, and leave the collections burden to us. Partner channel approved.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Reseller Partners",
    description: "Cut closing from weeks to minutes with easy financing, seamless checkout, and faster payouts.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Buyers",
    description:
      "Allow your customers to access the technology and services they need to be successful with flexible payment options.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Enterprise Solutions",
    description:
      "Scale your business with enterprise-grade financing solutions, custom terms, and dedicated support for high-volume transactions.",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export function FeaturesSlideshowSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Calculate which slides to show (current + next 1 or 2 depending on screen size)
  const getVisibleSlides = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      visible.push(slides[(currentIndex + i) % slides.length])
    }
    return visible
  }

  return (
    <section className="py-20 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-balance max-w-2xl">
            Win-win for your business, partners, and customers
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleSlides().map((slide) => (
              <div key={slide.id} className="group">
                <div className="rounded-2xl overflow-hidden mb-6 bg-muted/50">
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{slide.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{slide.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
