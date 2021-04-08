import { database } from "."

export type User = {
  name: string
  endTime: number
  email: string
  emailAlt?: string
}

export const isWatching = (user: User, currentTime: number): boolean => {
  const secondsLeft = user.endTime - Math.floor(currentTime / 1000)
  return secondsLeft > 0
}

export const setEndTime = async (
  userId: string,
  duration: number
): Promise<void> => {
  database
    .ref(`users/${userId}/endTime`)
    .set(Math.floor(Date.now() / 1000) + duration * 60)
}
