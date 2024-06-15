"use client"

import { useCallback, useEffect, useState } from "react"
import { db } from "@/lib/db"

// Components
import { Square } from "@/components/square"
import { OnScreenKeyboard } from "@/components/onScreenKeyboard"

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

  // Handle key press for both physical and on-screen keyboard
  const handleKeyDown = useCallback(
    (onScreenKey?: string, event?: KeyboardEvent) => {
      if (userAttempt >= totalAttemptsAllowed) {
        return
      }

      const key = (event?.key || onScreenKey || "").toLowerCase()
      const isLetter = /^[a-zA-Z]$/.test(key)
      const isBackspace = key === "backspace"
      const isEnter = key === "enter"

      // If the key is a letter
      if (isLetter && attempts[userAttempt]?.length < 5 && !isCorrectGuess) {
        setAttempts((prevAttempts) => {
          const newAttempts = [...prevAttempts]
          newAttempts[userAttempt] = [...newAttempts[userAttempt], key]
          return newAttempts
        })
      }

      // If the key is backspace
      if (isBackspace && attempts[userAttempt]?.length > 0) {
        setAttempts((prevAttempts) => {
          const newAttempts = [...prevAttempts]
          newAttempts[userAttempt] = newAttempts[userAttempt].slice(0, -1)
          return newAttempts
        })
      }

      // If the key is enter
      if (isEnter && attempts[userAttempt]?.length === 5) {
        setUserAttempt((prev) => prev + 1)

        // Check if the user attempt is correct
        const isCorrect = attempts[userAttempt].join("") === wordOfTheDay

        setIsCorrectGuess(isCorrect)

        if (isCorrect) {
          setKeyColor((prevKeyColor) => {
            const newKeyColor = [...prevKeyColor]
            newKeyColor[userAttempt] = Array(5).fill("green")
            return newKeyColor
          })
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
    },
    [attempts, isCorrectGuess, userAttempt, wordOfTheDay]
  )

  // Fetch word of the day
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch("/api/wordlist")
        if (!response.ok) {
          throw new Error("Failed to fetch word")
        }
        const data = await response.json()
        setWordOfTheDay(data.word)
      } catch (err) {
        console.error("Error while fetching word", err)
      }
    }

    fetchWord()
  }, [])

  // Initialize state from localStorage
  useEffect(() => {
    const storedTimestamp = localStorage.getItem("timestamp")
    if (storedTimestamp) {
      const currentDay = new Date().getDay()
      const storedDay = new Date(storedTimestamp).getDay()
      if (currentDay !== storedDay) {
        localStorage.clear()
        setUserAttempt(0)
        setAttempts(() => Array(totalAttemptsAllowed).fill([]))
        setKeyColor(() => Array(totalAttemptsAllowed).fill([]))
        setIsCorrectGuess(false)
      }
    }
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
      // Only update the timestamp when the user makes a new attempt
      if (userAttempt > 0) {
        const now = new Date()
        localStorage.setItem("timestamp", now.toISOString())
      }
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

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => handleKeyDown("", e),
    [handleKeyDown]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent)

    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent)
    }
  }, [handleKeyDownEvent])

  if (!hasMounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-12 md:gap-16 py-10">
      <div className="font-medium text-3xl max-w-xl text-center">
        {isCorrectGuess ? (
          <p className="text-xl text-balance">
            Congratulations! You have guessed the word correctly. 🎉 Total
            Attempts: {userAttempt}
          </p>
        ) : !isCorrectGuess && userAttempt === totalAttemptsAllowed ? (
          <p className="text-xl text-balance">
            You have reached the maximum number of attempts. The word was :{" "}
            {wordOfTheDay.toUpperCase()}
          </p>
        ) : (
          "Guess The Word"
        )}
      </div>

      <div className="flex justify-center flex-col items-center gap-2">
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

      <OnScreenKeyboard handleKeyDown={handleKeyDown} />

      <div className="flex flex-col gap-4 border p-6 rounded-md border-black dark:border-white">
        <div>
          Instructions: <br />
          - You have a total of 5 attempts to guess the word. <br />
          - Press Enter to submit your guess. <br />
          - Press Backspace to delete the last letter. <br />
        </div>
        <div>
          Color Guide: <br />
          - 💚 Green color indicates correct letter and position. <br />
          - 🧡 Orange color indicates correct letter but wrong position. <br />
          - 🩶 Gray color indicates wrong letter. <br />
        </div>
      </div>
    </div>
  )
}
