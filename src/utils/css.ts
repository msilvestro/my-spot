export const toggleClass = (className = "selected", condition: boolean) => {
  return condition ? ` ${className}` : ""
}
