"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UnlockPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onUnlock: (password: string) => void
  quizNumber: number
}

export default function UnlockPasswordModal({ isOpen, onClose, onUnlock, quizNumber }: UnlockPasswordModalProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!password.trim()) {
      setError("Please enter a passphrase")
      return
    }
    onUnlock(password)
    setPassword("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unlock Quiz {quizNumber}</CardTitle>
          <CardDescription>Enter the passphrase found at the previous location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Passphrase</label>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="Enter passphrase"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit()
                }
              }}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Unlock
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
