export function union<T>(lists: T[][]): T[] {
  const set = new Set<T>()
  lists.forEach((list) => {
    list.forEach((item) => {
      set.add(item)
    })
  })
  return [...set]
}
