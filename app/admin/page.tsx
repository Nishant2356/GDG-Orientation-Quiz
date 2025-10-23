"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllTeams } from "@/lib/team-storage"
import { getAllQuizLinks } from "@/lib/quiz-data"

export default function AdminDashboard() {
  const [teams, setTeams] = useState<any[]>([])
  const [quizLinks, setQuizLinks] = useState<any[]>([])

  useEffect(() => {
    setTeams(getAllTeams())
    setQuizLinks(getAllQuizLinks())
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Dashboard - Orientation Quiz</CardTitle>
            <CardDescription>Manage quiz links and track team progress</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quiz Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Links</CardTitle>
              <CardDescription>9 unique quiz links for QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {quizLinks.map((quiz) => (
                  <div key={quiz.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-sm mb-2">Quiz {quiz.quizNumber}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-200 p-2 rounded flex-1 overflow-x-auto">
                        {`http://localhost:3000${quiz.link}`}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`http://localhost:3000${quiz.link}`)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teams Section */}
          <Card>
            <CardHeader>
              <CardTitle>Teams Progress</CardTitle>
              <CardDescription>Total teams: {teams.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teams.length === 0 ? (
                  <p className="text-gray-500 text-sm">No teams have started yet</p>
                ) : (
                  teams.map((team) => (
                    <div key={team.teamId} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-sm">
                        {team.teamId} - {team.teamLeaderMobile}
                      </p>
                      <p className="text-xs text-gray-600">Completed: {team.completedQuizzes.length}/9</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(team.completedQuizzes.length / 9) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-blue-50 border-blue-300">
          <CardHeader>
            <CardTitle className="text-lg">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">1. Generate QR Codes</p>
              <p className="text-gray-700">
                Copy the quiz links above and generate QR codes using any QR code generator (e.g., qr-server.com)
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">2. Place QR Codes</p>
              <p className="text-gray-700">Place each QR code at the location mentioned in the quiz hints</p>
            </div>
            <div>
              <p className="font-semibold mb-1">3. Track Progress</p>
              <p className="text-gray-700">Refresh this page to see team progress in real-time</p>
            </div>
            <div>
              <p className="font-semibold mb-1">4. Validate Winners</p>
              <p className="text-gray-700">At the end, teams return with all 9 puzzle pieces for validation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
