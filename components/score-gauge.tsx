"use client"

import { useEffect, useState } from "react"

interface ScoreGaugeProps {
  score: number
  size?: number
}

export function ScoreGauge({ score, size = 200 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const getColor = (value: number) => {
    if (value >= 80) return "rgb(34 197 94)" // success
    if (value >= 60) return "rgb(234 179 8)" // accent/warning
    return "rgb(239 68 68)" // destructive
  }

  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(39 39 42)"
          strokeWidth="12"
          className="opacity-30"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(animatedScore)}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-bold text-5xl" style={{ color: getColor(animatedScore) }}>
          {animatedScore}
        </div>
        <div className="text-muted-foreground text-sm">out of 100</div>
      </div>
    </div>
  )
}
