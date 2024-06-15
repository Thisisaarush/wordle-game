import { db } from "@/lib/db"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    const dbCache = await db.wordOfTheDay.findFirst()
    const cachedWord = dbCache?.word
    const cachedDate = dbCache?.createdAt.toISOString().split("T")[0]

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Check if we have a cached word for today
    if (cachedWord && cachedDate === today) {
      return Response.json({ word: cachedWord })
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

    if (!dbCache) {
      await db.wordOfTheDay.create({
        data: { word, createdAt: new Date() },
      })
    } else {
      await db.wordOfTheDay.update({
        where: { id: dbCache.id },
        data: { word, createdAt: new Date() },
      })
    }

    return Response.json({ word })
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to read DB" }, { status: 500 })
  }
}
