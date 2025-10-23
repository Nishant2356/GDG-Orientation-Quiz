"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuizById } from "@/lib/quiz-data"
import { getTeamData, markQuizComplete } from "@/lib/team-storage"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<any>(null)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedTeamId = sessionStorage.getItem("teamId")
    if (!storedTeamId) {
      router.push("/")
      return
    }

    setTeamId(storedTeamId)

    const quizId = params.id as string
    const quizData = getQuizById(quizId)

    if (!quizData) {
      router.push("/quiz-start")
      return
    }

    // Check if already completed
    const teamData = getTeamData(storedTeamId)
    if (teamData?.completedQuizzes.includes(quizData.quizNumber)) {
      router.push("/quiz-start")
      return
    }

    setQuiz(quizData)
    setLoading(false)
  }, [params, router])

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === quiz.correctAnswer
    setIsCorrect(correct)
    setSubmitted(true)

    if (correct && teamId) {
      markQuizComplete(teamId, quiz.quizNumber)
    }
  }

  const handleNext = () => {
    router.push("/quiz-start")
  }

  if (loading || !quiz) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>
  }

  const nextQuizNumber = quiz.quizNumber + 1
  const nextQuizPassword = nextQuizNumber <= 9 ? `Password for Quiz ${nextQuizNumber}` : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quiz {quiz.quizNumber} of 9</CardTitle>
            <CardDescription>{quiz.question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!submitted ? (
              <>
                <div className="space-y-3">
                  {quiz.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedAnswer === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}
                        >
                          {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="w-full" size="lg">
                  Submit Answer
                </Button>
              </>
            ) : (
              <>
                <div
                  className={`p-6 rounded-lg text-center ${
                    isCorrect ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"
                  }`}
                >
                  <div className="text-4xl mb-2">{isCorrect ? "✓" : "✗"}</div>
                  <p className="text-xl font-bold mb-2">{isCorrect ? "Correct Answer!" : "Incorrect Answer"}</p>
                  <p className="text-gray-700">
                    The correct answer is: <strong>{quiz.options[quiz.correctAnswer]}</strong>
                  </p>
                </div>

                {isCorrect && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Your Puzzle Piece:</p>
                      <img
                        src={quiz.puzzleImageUrl || "/placeholder.svg"}
                        alt={`Puzzle piece ${quiz.quizNumber}`}
                        className="w-full rounded-lg mb-4"
                      />
                      <Button
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = quiz.puzzleImageUrl
                          link.download = `puzzle-piece-${quiz.quizNumber}.png`
                          link.click()
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Download Puzzle Piece
                      </Button>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                      <p className="font-semibold text-gray-800 mb-2">Hint for Next Location:</p>
                      <p className="text-lg font-bold text-blue-600 mb-2">{quiz.hint}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Location: <strong>{quiz.nextQrLocation}</strong>
                      </p>
                      {nextQuizPassword && (
                        <div className="mt-4 pt-4 border-t border-yellow-300">
                          <p className="text-xs text-gray-600 mb-1">Passphrase to unlock next quiz:</p>
                          <p className="text-sm font-mono bg-white p-2 rounded border border-yellow-200">
                            {quiz.quizNumber < 9 ? `Ask at ${quiz.nextQrLocation}` : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button onClick={handleNext} className="w-full" size="lg">
                  {isCorrect ? "Continue to Next Quiz" : "Back to Quiz List"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
