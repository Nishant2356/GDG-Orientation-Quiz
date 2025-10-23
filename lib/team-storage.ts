// In-memory storage for team data (in production, use a database)
interface TeamData {
  teamId: string
  teamLeaderMobile: string
  completedQuizzes: number[]
  unlockedQuizzes: number[] // Quizzes that have been unlocked with passphrase
  timestamp: number
}

const teamStorage = new Map<string, TeamData>()

export function generateTeamId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function validateTeam(mobileOrTeamId: string): { valid: boolean; teamId: string } {
  // Check if it's a team ID
  if (mobileOrTeamId.length === 8 && /^[A-Z0-9]+$/.test(mobileOrTeamId)) {
    const team = Array.from(teamStorage.values()).find((t) => t.teamId === mobileOrTeamId)
    if (team) {
      return { valid: true, teamId: mobileOrTeamId }
    }
  }

  // Check if it's a mobile number (10 digits)
  if (/^\d{10}$/.test(mobileOrTeamId)) {
    let team = Array.from(teamStorage.values()).find((t) => t.teamLeaderMobile === mobileOrTeamId)
    if (!team) {
      const newTeamId = generateTeamId()
      team = {
        teamId: newTeamId,
        teamLeaderMobile: mobileOrTeamId,
        completedQuizzes: [],
        unlockedQuizzes: [1], // First quiz is always unlocked
        timestamp: Date.now(),
      }
      teamStorage.set(newTeamId, team)
    }
    return { valid: true, teamId: team.teamId }
  }

  return { valid: false, teamId: "" }
}

export function getTeamData(teamId: string): TeamData | undefined {
  return teamStorage.get(teamId)
}

export function markQuizComplete(teamId: string, quizNumber: number): void {
  const team = teamStorage.get(teamId)
  if (team && !team.completedQuizzes.includes(quizNumber)) {
    team.completedQuizzes.push(quizNumber)
  }
}

export function unlockQuiz(teamId: string, quizNumber: number): void {
  const team = teamStorage.get(teamId)
  if (team && !team.unlockedQuizzes.includes(quizNumber)) {
    team.unlockedQuizzes.push(quizNumber)
  }
}

export function isQuizUnlocked(teamId: string, quizNumber: number): boolean {
  const team = teamStorage.get(teamId)
  if (!team) return false
  return team.unlockedQuizzes.includes(quizNumber)
}

export function isQuizCompleted(teamId: string, quizNumber: number): boolean {
  const team = teamStorage.get(teamId)
  if (!team) return false
  return team.completedQuizzes.includes(quizNumber)
}

export function getAllTeams(): TeamData[] {
  return Array.from(teamStorage.values())
}
