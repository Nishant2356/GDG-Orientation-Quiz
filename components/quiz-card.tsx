"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, LockOpen, CheckCircle, Zap } from "lucide-react"
import UnlockPasswordModal from "./unlock-password-modal"

interface QuizCardProps {
  quizNumber: number
  isCompleted: boolean
  isUnlocked: boolean
  isPartiallyLocked: boolean
  onStartQuiz: () => void
  unlockPassword: string
  onUnlock: (password: string) => void
}

export default function QuizCard({
  quizNumber,
  isCompleted,
  isUnlocked,
  isPartiallyLocked,
  onStartQuiz,
  unlockPassword,
  onUnlock,
}: QuizCardProps) {
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  // State 1: Completed
  if (isCompleted) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 shadow-md hover:shadow-lg transition-all">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-700 mb-1">Quiz {quizNumber}</div>
          <div className="text-green-600 font-semibold text-sm">✓ Completed</div>
        </CardContent>
      </Card>
    )
  }

  // State 2: Unlocked
  if (isUnlocked) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-105 transform">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-200 p-3 rounded-full">
              <LockOpen className="w-8 h-8 text-blue-700" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mb-1">Quiz {quizNumber}</div>
          <div className="text-blue-600 font-semibold text-sm mb-4">Ready to Start</div>
          <Button
            onClick={onStartQuiz}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
            size="sm"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  // State 3: Partially Locked (needs passphrase)
  if (isPartiallyLocked) {
    return (
      <>
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 shadow-md hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-yellow-200 p-3 rounded-full animate-pulse">
                <Zap className="w-8 h-8 text-yellow-700" />
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-700 mb-1">Quiz {quizNumber}</div>
            <div className="text-yellow-600 font-semibold text-sm mb-4">Enter Passphrase to Unlock</div>
            <Button
              onClick={() => setShowUnlockModal(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold"
              size="sm"
            >
              Unlock with Passphrase
            </Button>
          </CardContent>
        </Card>

        <UnlockPasswordModal
          isOpen={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          onUnlock={(password) => {
            onUnlock(password)
            setShowUnlockModal(false)
          }}
          quizNumber={quizNumber}
        />
      </>
    )
  }

  // State 4: Fully Locked (no button, no interaction)
  return (
    <Card className="opacity-60 border-2 border-gray-300 bg-gray-100 cursor-not-allowed">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-gray-300 p-3 rounded-full">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-500 mb-1">Quiz {quizNumber}</div>
        <div className="text-gray-400 font-semibold text-sm">Locked</div>
      </CardContent>
    </Card>
  )
}
