"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllQuizLinks, getQuizById } from "@/lib/quiz-data"
import { getTeamData, unlockQuiz, isQuizUnlocked, isQuizCompleted } from "@/lib/team-storage"
import QuizCard from "@/components/quiz-card"

export default function QuizStart() {
  const [teamId, setTeamId] = useState<string | null>(null)
  const [teamData, setTeamData] = useState<any>(null)
  const [quizLinks, setQuizLinks] = useState<any[]>([])
  const [unlockErrors, setUnlockErrors] = useState<{ [key: number]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const storedTeamId = sessionStorage.getItem("teamId")
    if (!storedTeamId) {
      router.push("/")
      return
    }

    setTeamId(storedTeamId)
    const team = getTeamData(storedTeamId)
    setTeamData(team)
    setQuizLinks(getAllQuizLinks())
  }, [router])

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`)
  }

  const handleUnlockQuiz = (quizNumber: number, password: string) => {
    const quiz = getAllQuizLinks().find((q) => q.quizNumber === quizNumber)
    if (!quiz) return

    const quizData = getQuizById(quiz.id)
    if (!quizData) return

    // Check if password is correct (case-insensitive)
    if (password.toUpperCase() === quizData.unlockPassword.toUpperCase()) {
      if (teamId) {
        unlockQuiz(teamId, quizNumber)
        // Update team data to reflect the change
        const updatedTeam = getTeamData(teamId)
        setTeamData(updatedTeam)
        setUnlockErrors({ ...unlockErrors, [quizNumber]: "" })
      }
    } else {
      setUnlockErrors({ ...unlockErrors, [quizNumber]: "Incorrect passphrase. Try again!" })
    }
  }

  const isPartiallyLocked = (quizNumber: number): boolean => {
    if (!teamData) return false
    const lastCompletedQuiz = Math.max(...teamData.completedQuizzes, 0)
    // A quiz is partially locked if it's the next quiz after the last completed one
    return quizNumber === lastCompletedQuiz + 1 && !isQuizCompleted(teamId, quizNumber)
  }

  if (!teamId || !teamData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const completedCount = teamData.completedQuizzes.length

  const lastCompletedQuiz = Math.max(...teamData.completedQuizzes, 0)
  const nextQuizNumber = lastCompletedQuiz + 1
  const nextQuiz = quizLinks.find((q) => q.quizNumber === nextQuizNumber)

  // If all quizzes are completed, show completion message
  if (completedCount === 9) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 border-2 border-green-500">
            <CardHeader>
              <CardTitle className="text-green-600">🎉 All Quizzes Completed!</CardTitle>
              <CardDescription>Team ID: {teamData.teamId}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">You've successfully completed all 9 quizzes!</p>
              <p className="text-gray-600 mt-2">Collect all your puzzle pieces to complete the challenge.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome to the Quiz Challenge!</CardTitle>
            <CardDescription>Team ID: {teamData.teamId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold">Progress: {completedCount} / 9 quizzes completed</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / 9) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {nextQuiz && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {completedCount === 0 ? "Quiz 1: Get Started!" : `Quiz ${nextQuizNumber}: Next Challenge`}
            </h2>
            <div>
              <QuizCard
                quizNumber={nextQuiz.quizNumber}
                isCompleted={false}
                isUnlocked={isQuizUnlocked(teamId, nextQuiz.quizNumber)}
                isPartiallyLocked={isPartiallyLocked(nextQuiz.quizNumber)}
                onStartQuiz={() => handleStartQuiz(nextQuiz.id)}
                unlockPassword={getQuizById(nextQuiz.id)?.unlockPassword || ""}
                onUnlock={(password) => handleUnlockQuiz(nextQuiz.quizNumber, password)}
              />
              {unlockErrors[nextQuiz.quizNumber] && (
                <p className="text-red-600 text-sm mt-2 text-center">{unlockErrors[nextQuiz.quizNumber]}</p>
              )}
            </div>
          </div>
        )}

        <Card className="mt-6 bg-yellow-50 border-yellow-300">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700">
              <strong>How it works:</strong> Complete each quiz to get a puzzle piece and a passphrase hint. Use the
              hint to find the next location and enter the passphrase to unlock the next quiz!
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
