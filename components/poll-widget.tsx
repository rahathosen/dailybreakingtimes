"use client"

import { useState, useEffect } from "react"
import { VoteIcon, BarChart3, Users, RefreshCw, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface PollWidgetProps {
  id: string
  question: string
  options: PollOption[]
  totalVotes?: number
  expiresAt?: string
  category?: string
  className?: string
}

export function PollWidget({
  id,
  question,
  options: initialOptions,
  totalVotes: initialTotalVotes = 0,
  expiresAt,
  category,
  className,
}: PollWidgetProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [options, setOptions] = useState<PollOption[]>(initialOptions)
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Check if user has already voted in this poll
  useEffect(() => {
    const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}")
    if (votedPolls[id]) {
      setHasVoted(true)
      setSelectedOption(votedPolls[id])
      setShowResults(true)
    }
  }, [id])

  // Calculate time remaining until poll expires
  const getTimeRemaining = () => {
    if (!expiresAt) return null

    const now = new Date()
    const expiration = new Date(expiresAt)
    const diffMs = expiration.getTime() - now.getTime()

    if (diffMs <= 0) return "Expired"

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      return `${diffHours}h ${diffMinutes}m remaining`
    }
  }

  // Handle vote submission
  const handleVote = () => {
    if (!selectedOption || hasVoted || isSubmitting) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Update options with new vote
      const updatedOptions = options.map((option) => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 }
        }
        return option
      })

      // Recalculate percentages
      const newTotalVotes = totalVotes + 1
      const optionsWithPercentages = updatedOptions.map((option) => ({
        ...option,
        percentage: Math.round((option.votes / newTotalVotes) * 100),
      }))

      // Update state
      setOptions(optionsWithPercentages)
      setTotalVotes(newTotalVotes)
      setHasVoted(true)
      setShowResults(true)
      setIsSubmitting(false)

      // Save to localStorage
      const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}")
      localStorage.setItem(
        "voted_polls",
        JSON.stringify({
          ...votedPolls,
          [id]: selectedOption,
        }),
      )
    }, 1000)
  }

  // Reset poll (for demo purposes)
  const resetPoll = () => {
    setSelectedOption(null)
    setHasVoted(false)
    setShowResults(false)

    // Remove from localStorage
    const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}")
    delete votedPolls[id]
    localStorage.setItem("voted_polls", JSON.stringify(votedPolls))
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{question}</CardTitle>
            {category && (
              <CardDescription className="mt-1">
                <Badge variant="outline" className="text-xs font-normal">
                  {category}
                </Badge>
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowResults(!showResults)}
            disabled={!hasVoted && showResults}
          >
            {showResults ? <VoteIcon className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!showResults ? (
          <RadioGroup
            value={selectedOption || ""}
            onValueChange={setSelectedOption}
            className="space-y-3"
            disabled={hasVoted}
          >
            {options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3 transition-colors",
                  selectedOption === option.id && "border-primary bg-primary/5",
                )}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {selectedOption === option.id && hasVoted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    <span className={selectedOption === option.id && hasVoted ? "font-medium" : ""}>{option.text}</span>
                  </div>
                  <span className="text-sm font-medium">{option.percentage}%</span>
                </div>
                <Progress
                  value={option.percentage}
                  className={cn("h-2", selectedOption === option.id && hasVoted ? "bg-primary/20" : "bg-muted")}
                />
                <div className="text-xs text-muted-foreground">
                  {option.votes} {option.votes === 1 ? "vote" : "votes"}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-3">
        <div className="flex items-center text-xs text-muted-foreground">
          {expiresAt ? (
            <div className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" />
              <span>{getTimeRemaining()}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>
                {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!hasVoted ? (
            <Button size="sm" disabled={!selectedOption || isSubmitting} onClick={handleVote}>
              {isSubmitting ? "Submitting..." : "Vote"}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={resetPoll}>
              Vote Again
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
