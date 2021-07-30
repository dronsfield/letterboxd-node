export function except<T>(toSubtractFrom: T[], toSubtract: T[]): T[] {
  return toSubtractFrom.filter((item) => {
    return toSubtract.indexOf(item) < 0
  })
}
