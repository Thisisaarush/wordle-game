"use client"

import { Square } from "@/components/square"
import { useEffect, useState } from "react"

export default function Home() {
  const [userAttempt, setUserAttempt] = useState(0)
  const [attempts, setAttempts] = useState<string[][]>([[], [], [], [], []])
  const [keyColor, setKeyColor] = useState<string[][]>([[], [], [], [], []])

  let wordOfTheDay = "great"
  const totalAttemptsAllowed = 5

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key)
      console.log(userAttempt, totalAttemptsAllowed, attempts)

      if (userAttempt >= totalAttemptsAllowed) {
        alert(
          `You have reached the maximum number of attempts. The word was ${wordOfTheDay}`
        )
        return
      }
      const key = event.key
      const isLetter = /^[a-zA-Z]$/.test(key)
      const isBackspace = key === "Backspace"
      const isEnter = key === "Enter"

      // If the key is a letter
      if (isLetter && attempts[userAttempt].length < 5) {
        setAttempts((prevAttempts) => {
          const newAttempts = [...prevAttempts]
          newAttempts[userAttempt] = [...newAttempts[userAttempt], key]
          return newAttempts
        })
      }

      // If the key is backspace
      if (isBackspace && attempts[userAttempt].length > 0) {
        setAttempts((prevAttempts) => {
          const newAttempts = [...prevAttempts]
          newAttempts[userAttempt] = newAttempts[userAttempt].slice(0, -1)
          return newAttempts
        })
      }

      // If the key is enter
      if (isEnter && attempts[userAttempt].length === 5) {
        setUserAttempt((prev) => prev + 1)

        // Check if the user attempt is correct
        const isCorrect =
          attempts[userAttempt].join("").toLowerCase() ===
          wordOfTheDay.toLowerCase()

        if (isCorrect) {
          alert(
            `Congratulations! You have guessed the word correctly. 🎉 Total Attempts: ${
              userAttempt + 1
            }`
          )
        } else {
          const correctWord = wordOfTheDay.split("")
          const guessedWord = attempts[userAttempt]

          // Update key colors
          setKeyColor((prevKeyColor) => {
            const newKeyColor = [...prevKeyColor]
            const newColors = Array(5).fill("")

            for (let i = 0; i < 5; i++) {
              if (guessedWord[i] === correctWord[i]) {
                newColors[i] = "green"
              } else if (correctWord.includes(guessedWord[i])) {
                newColors[i] = "orange"
              } else {
                newColors[i] = "gray"
              }
            }

            newKeyColor[userAttempt] = newColors
            return newKeyColor
          })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [attempts, userAttempt, wordOfTheDay])

  return (
    <div className="flex justify-center flex-col items-center gap-2 min-h-screen">
      {attempts.map((attempt, parentIndex) => (
        <div
          key={parentIndex}
          className="flex justify-center items-center gap-2"
        >
          {attempts?.map((_, idx) => (
            <Square
              key={idx}
              letter={attempt[idx]}
              bgColor={keyColor[parentIndex][idx]}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
