"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { validateTeam } from "@/lib/team-storage"

export default function Home() {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const trimmedInput = input.trim()
    const result = validateTeam(trimmedInput)

    if (result.valid) {
      sessionStorage.setItem("teamId", result.teamId)
      router.push(`/quiz-start`)
    } else {
      setError("Invalid Team ID or Mobile Number. Please enter a valid 10-digit mobile number or 8-character team ID.")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500"></div>

      <div className="w-full max-w-md">
        {/* GDG Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="text-4xl font-bold">
              <span className="text-blue-600">G</span>
              <span className="text-red-600">D</span>
              <span className="text-yellow-500">G</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SOIT RGPV</h1>
        </div>

        <Card className="border-2 border-blue-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
            <CardTitle className="text-3xl text-blue-700">Orientation Quiz</CardTitle>
            <CardDescription className="text-gray-700">Begin your GDG journey</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="input" className="text-sm font-semibold text-gray-700">
                  Team Leader Mobile Number or Team ID
                </label>
                <Input
                  id="input"
                  type="text"
                  placeholder="Enter 10-digit mobile or 8-char team ID"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="text-center border-2 border-blue-200 focus:border-blue-500 h-12 text-lg"
                />
                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={loading}
              >
                {loading ? "Validating..." : "Start Quiz"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
              <p className="font-bold text-gray-900 mb-3 flex items-center">
                <span className="text-blue-600 mr-2">📋</span>
                Instructions
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">1.</span>
                  <span>Enter your team leader's 10-digit mobile number</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 font-bold">2.</span>
                  <span>Or enter your 8-character team ID if you have one</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 font-bold">3.</span>
                  <span>Complete all 9 quizzes to collect puzzle pieces</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2 font-bold">4.</span>
                  <span>Return to the orientation hall with all pieces</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">Made with ❤️ by GDG SOIT RGPV</p>
      </div>
    </main>
  )
}
