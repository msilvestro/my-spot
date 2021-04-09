import { database } from "."

export type User = {
  name: string
  endTime: number
  email: string
  emailAlt?: string
  customRunningTime?: number
}

export const isWatching = (user: User, currentTime: number): boolean => {
  const secondsLeft = user.endTime - Math.floor(currentTime / 1000)
  return secondsLeft > 0
}

export const updateEndTime = async (
  userId: string,
  duration: number
): Promise<void> => {
  database
    .ref(`users/${userId}/endTime`)
    .set(Math.floor(Date.now() / 1000) + duration * 60)
}

export const updateCustomRunningTime = async (
  userId: string,
  runningTime: number
): Promise<void> => {
  database.ref(`users/${userId}/customRunningTime`).set(runningTime)
}
