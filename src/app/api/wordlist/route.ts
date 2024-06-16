import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Read the file content from wordlist.txt
    const filePath = path.join(process.cwd(), "src/data", "wordlist.txt")
    const data = await fs.readFile(filePath, "utf8")

    // Split the content into lines (words)
    const words = data
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word.length > 0)

    // select a unique and random word for the day
    const epochMs = Date.now() - 1641013200000
    const msInDay = 1000 * 60 * 60 * 24
    const currentDay = Math.floor(epochMs / msInDay)
    const newWordOfTheDay = words[currentDay % words.length]

    return Response.json({ word: newWordOfTheDay })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to generate word" }, { status: 500 })
  }
}
