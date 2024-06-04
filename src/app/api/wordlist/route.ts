import { promises as fs } from "fs"
import path from "path"

let cachedWord: { word: string; date: string } | null = null

export async function GET(request: Request) {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Check if we have a cached word for today
    if (cachedWord && cachedWord.date === today) {
      return Response.json({ word: cachedWord.word })
    }

    // Read the file content
    const filePath = path.join(process.cwd(), "public", "wordlist.txt")
    const data = await fs.readFile(filePath, "utf8")

    // Split the content into lines (words)
    const words = data
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word.length > 0)

    // Select a random word
    const word =
      words.length > 0 ? words[Math.floor(Math.random() * words.length)] : ""

    // Cache the word for today
    cachedWord = { word, date: today }

    return Response.json({ word })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to read file" }, { status: 500 })
  }
}
