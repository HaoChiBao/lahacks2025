"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
  highlightLines?: number[]
  onLineClick?: (lineNumber: number) => void
}

// export function CodeBlock({ code, language, highlightLines = [], onLineClick }: CodeBlockProps) {
export function CodeBlock({ code, highlightLines = [], onLineClick }: CodeBlockProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)

  const lines = code.split("\n")

  const handleLineClick = (lineNumber: number) => {
    if (onLineClick) {
      onLineClick(lineNumber)
    }
  }

  return (
    <pre className="relative overflow-x-auto rounded-md bg-gray-100 p-4 font-mono text-sm text-gray-900 shadow-inner">
      <code>
        {lines.map((line, index) => {
          const lineNumber = index + 1
          const isHighlighted = highlightLines.includes(lineNumber)

          return (
            <div
              key={index}
              className={cn(
                "flex px-2 py-1 rounded-md cursor-pointer transition-colors",
                isHighlighted && "bg-yellow-200",
                hoveredLine === lineNumber && "bg-gray-300",
              )}
              onClick={() => handleLineClick(lineNumber)}
              onMouseEnter={() => setHoveredLine(lineNumber)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              <span
                className="select-none text-gray-500 text-right mr-4"
                style={{ width: "2rem" }} // Fixed width for alignment
              >
                {lineNumber}
              </span>
              <span className="flex-1 whitespace-pre">{line || " "}</span>
            </div>
          )
        })}
      </code>
    </pre>
  )
}
