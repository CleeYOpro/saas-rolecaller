"use client"

import type React from "react"
import { useState, useRef } from "react"
import "./shiny-button.css"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary"
  disabled?: boolean
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
}: ShinyButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <button
      ref={buttonRef}
      className={`shiny-cta ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <span>{children}</span>
    </button>
  )
}
