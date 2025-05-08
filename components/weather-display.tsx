"use client"

import { useState, useEffect } from "react"
import { Sunrise, Sunset, Thermometer } from "lucide-react"

export function WeatherDisplay() {
  const [weather, setWeather] = useState({
    temperature: "28°C",
    sunrise: "5:42 AM",
    sunset: "6:18 PM",
  })

  // In a real app, you would fetch this data from a weather API
  useEffect(() => {
    // Simulate API call
    const fetchWeather = () => {
      // This would be replaced with actual API call
      setWeather({
        temperature: "28°C",
        sunrise: "5:42 AM",
        sunset: "6:18 PM",
      })
    }

    fetchWeather()
    // Set up interval to refresh weather data
    const interval = setInterval(fetchWeather, 1800000) // 30 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
      <div className="flex items-center">
        <Thermometer className="h-4 w-4 mr-1" />
        <span>{weather.temperature}</span>
      </div>
      <div className="flex items-center">
        <Sunrise className="h-4 w-4 mr-1" />
        <span>{weather.sunrise}</span>
      </div>
      <div className="flex items-center">
        <Sunset className="h-4 w-4 mr-1" />
        <span>{weather.sunset}</span>
      </div>
    </div>
  )
}
