export const calculateWordCount = (text?: string): number =>
  text === undefined ? 0 : text.split(/\s+/).length

export const calculateReadingTime = (
  wordsPerMinute: number,
  text?: string,
): number => {
  const wordCount = calculateWordCount(text)
  // Calculate the reading time in minutes
  const readingTimeInMinutes = wordCount / wordsPerMinute
  // Round up to the nearest whole number
  const readingTime = Math.ceil(readingTimeInMinutes)
  return readingTime
}
