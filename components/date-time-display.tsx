"use client"

import { useState, useEffect } from "react"

export function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState("")

  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      const now = new Date()

      // Bangladesh is UTC+6
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }

      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(now)
      setDateTime(formattedDate)
    }

    // Update immediately and then every second
    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-sm text-muted-foreground">
      <span>{dateTime}</span>
    </div>
  )
}
