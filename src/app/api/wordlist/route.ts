import { promises as fs } from "fs"
import path from "path"

export const dynamic = "force-dynamic"

async function writeCachedWord(word: { word: string; date: string }) {
  const filePath = path.join(process.cwd(), "src/data", "cachedWord.json")
  await fs.writeFile(filePath, JSON.stringify(word), "utf8")
}

async function readCachedWord(): Promise<{
  word: string
  date: string
} | null> {
  const filePath = path.join(process.cwd(), "src/data", "cachedWord.json")
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

export async function GET(request: Request) {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]
    // Read the cached word from the file
    let cachedWord = await readCachedWord()

    // Check if we have a cached word for today
    if (cachedWord && cachedWord.date === today) {
      return Response.json({ word: cachedWord.word })
    }

    // Read the file content from wordlist.txt
    const filePath = path.join(process.cwd(), "src/data", "wordlist.txt")
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
    // Write the cached word to the file
    await writeCachedWord(cachedWord)

    return Response.json({ word })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to read file" }, { status: 500 })
  }
}
