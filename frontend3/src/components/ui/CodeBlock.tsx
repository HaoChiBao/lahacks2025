"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
  highlightLines?: number[]
  onLineClick?: (lineNumber: number) => void
}

export function CodeBlock({ code, language, highlightLines = [], onLineClick }: CodeBlockProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)

  const lines = code.split("\n")

  const handleLineClick = (lineNumber: number) => {
    if (onLineClick) {
      onLineClick(lineNumber)
    }
  }

  return (
    <pre className="relative overflow-x-auto rounded-md bg-gray-900 p-4 font-mono text-sm text-gray-100 shadow-inner">
      <code>
        {lines.map((line, index) => {
          const lineNumber = index + 1
          const isHighlighted = highlightLines.includes(lineNumber)

          return (
            <div
              key={index}
              className={cn(
                "flex px-2 py-1 rounded-md cursor-pointer transition-colors",
                isHighlighted && "bg-green-700/30",
                hoveredLine === lineNumber && "bg-gray-700/50",
              )}
              onClick={() => handleLineClick(lineNumber)}
              onMouseEnter={() => setHoveredLine(lineNumber)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span className="select-none w-8 text-gray-500 text-right mr-4">{lineNumber}</span>
              <span className="flex-1 whitespace-pre">{line || " "}</span>
            </div>
          )
        })}
      </code>
    </pre>
  )
}
