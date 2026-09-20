"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import "./shiny-button.css"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "red"   // ← added "red"
  disabled?: boolean
  /** Defaults to "button" so it never submits a surrounding form by accident. */
  type?: "button" | "submit" | "reset"
  /** When set, renders a link (<a>) instead of a <button>. */
  href?: string
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  type = "button",
  href,
}: ShinyButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = buttonRef.current ?? linkRef.current
    if (el) {
      const rect = el.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const classes = `shiny-cta ${variant} ${className}`
  const style = {
    "--mouse-x": `${mousePosition.x}px`,
    "--mouse-y": `${mousePosition.y}px`,
  } as React.CSSProperties

  if (href) {
    return (
      <Link
        ref={linkRef}
        href={href}
        className={classes}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        style={style}
      >
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      style={style}
    >
      <span>{children}</span>
    </button>
  )
}
