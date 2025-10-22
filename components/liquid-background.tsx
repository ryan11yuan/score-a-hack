"use client"

import { useEffect, useRef } from "react"

export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let mouseX = 0
    let mouseY = 0

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Metaball class for liquid effect
    class Metaball {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string

      constructor(x: number, y: number, radius: number, color: string) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.radius = radius
        this.color = color
      }

      update(mouseX: number, mouseY: number) {
        // Move towards mouse slightly
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 300) {
          this.vx += (dx / dist) * 0.02
          this.vy += (dy / dist) * 0.02
        }

        // Apply velocity
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1

        // Damping
        this.vx *= 0.99
        this.vy *= 0.99

        // Keep within bounds
        this.x = Math.max(0, Math.min(canvas!.width, this.x))
        this.y = Math.max(0, Math.min(canvas!.height, this.y))
      }
    }

    // Create metaballs
    const metaballs: Metaball[] = [
      new Metaball(canvas.width * 0.3, canvas.height * 0.3, 150, "rgba(99, 102, 241, 0.4)"), // indigo
      new Metaball(canvas.width * 0.7, canvas.height * 0.5, 180, "rgba(234, 179, 8, 0.3)"), // yellow
      new Metaball(canvas.width * 0.5, canvas.height * 0.7, 120, "rgba(139, 92, 246, 0.35)"), // purple
    ]

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 1)" // Dark background with slight transparency for trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update metaballs
      metaballs.forEach((ball) => ball.update(mouseX, mouseY))

      // Draw metaballs with glow
      metaballs.forEach((ball) => {
        const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius)
        gradient.addColorStop(0, ball.color)
        gradient.addColorStop(0.5, ball.color.replace(/[\d.]+\)$/g, "0.2)"))
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Apply blur filter for liquid effect
      ctx.filter = "blur(30px)"
      ctx.drawImage(canvas, 0, 0)
      ctx.filter = "none"

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ mixBlendMode: "screen" }} />
}
