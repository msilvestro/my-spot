export const declineTime = (
  amount: number,
  type: "minutes" | "hours"
): string => {
  const timeTranslation = {
    minutes: ["minuto", "minuti"],
    hours: ["ora", "ore"],
  }
  const [singular, plural] = timeTranslation[type]
  return amount === 1 ? singular : plural
}
