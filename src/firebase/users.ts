import { database } from "."

export type User = {
  name: string
  endTime?: number | null
  email: string
  emailAlt?: string
  customRunningTime?: number
  infiniteReservation?: boolean
}

export const isWatching = (user: User, currentTime: number): boolean => {
  if (!user.endTime) {
    return false
  }
  const secondsLeft = user.endTime - Math.floor(currentTime / 1000)
  return user.infiniteReservation || secondsLeft > 0
}

export const updateEndTime = async (
  userId: string,
  endTime: number | null
): Promise<void> => {
  database.ref(`users/${userId}/endTime`).set(endTime)
}

export const updateCustomRunningTime = async (
  userId: string,
  runningTime: number
): Promise<void> => {
  database.ref(`users/${userId}/customRunningTime`).set(runningTime)
}

export const updateinfiniteReservation = async (
  userId: string,
  infiniteReservation: boolean
): Promise<void> => {
  database.ref(`users/${userId}/infiniteReservation`).set(infiniteReservation)
}
