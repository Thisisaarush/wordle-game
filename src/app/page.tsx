"use client"

import { Square } from "@/components/square"
import { useEffect, useState } from "react"

// Utility function to get initial state from localStorage or set default
const getInitialState = (
  key: string,
  defaultValue: string | number | boolean | string[][]
) => {
  const savedState = typeof window !== "undefined" && localStorage.getItem(key)
  try {
    if (savedState) return JSON.parse(savedState)
    return defaultValue
  } catch (error) {
    console.error(`Error parsing localStorage key “${key}”: ${error}`)
    return defaultValue
  }
}

export default function Home() {
  const totalAttemptsAllowed = 5

  // Fix for hydration mismatch
  const [hasMounted, setHasMounted] = useState(false)

  const [wordOfTheDay, setWordOfTheDay] = useState<string>("")
  const [userAttempt, setUserAttempt] = useState<number>(0)
  const [attempts, setAttempts] = useState<string[][]>([])
  const [keyColor, setKeyColor] = useState<string[][]>([])
  const [isCorrectGuess, setIsCorrectGuess] = useState<boolean>(false)

  // Initialize state from localStorage
  useEffect(() => {
    setWordOfTheDay(getInitialState("wordOfTheDay", "great"))
    setUserAttempt(getInitialState("userAttempt", 0))
    setAttempts(
      getInitialState("attempts", Array(totalAttemptsAllowed).fill([]))
    )
    setKeyColor(
      getInitialState("keyColor", Array(totalAttemptsAllowed).fill([]))
    )
    setIsCorrectGuess(getInitialState("isCorrectGuess", false))

    setHasMounted(true)
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("wordOfTheDay", JSON.stringify(wordOfTheDay))
      localStorage.setItem("userAttempt", JSON.stringify(userAttempt))
      localStorage.setItem("attempts", JSON.stringify(attempts))
      localStorage.setItem("keyColor", JSON.stringify(keyColor))
      localStorage.setItem("isCorrectGuess", JSON.stringify(isCorrectGuess))
    }
  }, [
    attempts,
    hasMounted,
    isCorrectGuess,
    keyColor,
    userAttempt,
    wordOfTheDay,
  ])

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
      if (isLetter && attempts[userAttempt].length < 5 && !isCorrectGuess) {
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

        setIsCorrectGuess(isCorrect)

        if (isCorrect) {
          setKeyColor((prevKeyColor) => {
            const newKeyColor = [...prevKeyColor]
            newKeyColor[userAttempt] = Array(5).fill("green")
            return newKeyColor
          })
          setTimeout(() => {
            alert(
              `Congratulations! You have guessed the word correctly. 🎉 Total Attempts: ${
                userAttempt + 1
              }`
            )
          }, 1000)
        } else {
          const correctWord = wordOfTheDay.split("")
          const guessedWord = attempts[userAttempt]

          // Update key colors
          setKeyColor((prevKeyColor) => {
            const newKeyColor = [...prevKeyColor]
            const newColors = Array(5).fill("")

            for (let i = 0; i < 5; i++) {
              if (
                guessedWord[i].toLowerCase() === correctWord[i].toLowerCase()
              ) {
                newColors[i] = "green"
              } else if (correctWord.includes(guessedWord[i].toLowerCase())) {
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
  }, [attempts, isCorrectGuess, userAttempt, wordOfTheDay])

  if (!hasMounted) {
    return null
  }

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
