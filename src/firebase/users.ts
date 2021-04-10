import { database } from "."

export type User = {
  name: string
  endTime: number // make me possibly undefined
  email: string
  emailAlt?: string
  customRunningTime?: number
  infiniteWatching?: boolean
}

export const isWatching = (user: User, currentTime: number): boolean => {
  if (!user.endTime) {
    return false
  }
  const secondsLeft = user.endTime - Math.floor(currentTime / 1000)
  return user.infiniteWatching || secondsLeft > 0
}

export const updateEndTime = async (
  userId: string,
  duration: number | null
): Promise<void> => {
  database
    .ref(`users/${userId}/endTime`)
    .set(duration ? Math.floor(Date.now() / 1000) + duration * 60 : null)
}

export const updateCustomRunningTime = async (
  userId: string,
  runningTime: number
): Promise<void> => {
  database.ref(`users/${userId}/customRunningTime`).set(runningTime)
}

export const updateInfiniteWatching = async (
  userId: string,
  infiniteWatching: boolean
): Promise<void> => {
  database.ref(`users/${userId}/infiniteWatching`).set(infiniteWatching)
}
