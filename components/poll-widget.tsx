"use client";

import { useState, useEffect } from "react";
import {
  VoteIcon,
  BarChart3,
  Users,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PollOption {
  id: number;
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: number;
  question: string;
  category: string;
  options: PollOption[];
  totalVotes: number;
  expiresAt: string | null;
  status: string;
  featured: boolean;
}

interface PollWidgetProps {
  featured?: boolean;
  category?: string;
  className?: string;
}

export function PollWidget({
  featured = false,
  category,
  className,
}: PollWidgetProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPolls();
  }, [featured, category]);

  // Check if user has already voted in this poll
  useEffect(() => {
    if (polls.length > 0) {
      const currentPoll = polls[currentPollIndex];
      const votedPolls = JSON.parse(
        localStorage.getItem("voted_polls") || "{}"
      );
      if (votedPolls[currentPoll.id]) {
        setHasVoted(true);
        setSelectedOption(votedPolls[currentPoll.id]);
        setShowResults(true);
      }
    }
  }, [polls, currentPollIndex]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (featured) params.append("featured", "true");
      if (category) params.append("category", category);
      params.append("status", "active");
      params.append("limit", "5");

      const response = await fetch(`/api/polls?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        setError("No active polls available");
        setPolls([]);
      } else {
        setPolls(data);
        setCurrentPollIndex(0);
        setSelectedOption(null);
        setHasVoted(false);
        setShowResults(false);
      }
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = () => {
    if (!polls[currentPollIndex]?.expiresAt) return null;

    const now = new Date();
    const expiration = new Date(polls[currentPollIndex].expiresAt as string);
    const diffMs = expiration.getTime() - now.getTime();

    if (diffMs <= 0) return "Expired";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h remaining`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m remaining`;
    }
  };

  const handleVote = async () => {
    if (!selectedOption || hasVoted || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const currentPoll = polls[currentPollIndex];

      const response = await fetch("/api/polls/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId: currentPoll.id,
          optionId: selectedOption,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit vote");
      }

      const data = await response.json();

      // Update the poll with new results
      const updatedPolls = [...polls];
      updatedPolls[currentPollIndex] = {
        ...currentPoll,
        options: data.results,
        totalVotes: data.totalVotes,
      };

      setPolls(updatedPolls);
      setHasVoted(true);
      setShowResults(true);
      setIsSubmitting(false);

      // Save to localStorage
      const votedPolls = JSON.parse(
        localStorage.getItem("voted_polls") || "{}"
      );
      localStorage.setItem(
        "voted_polls",
        JSON.stringify({
          ...votedPolls,
          [currentPoll.id]: selectedOption,
        })
      );

      toast({
        title: "Vote submitted",
        description: "Thank you for participating in our poll!",
      });
    } catch (err) {
      console.error("Error voting:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to submit vote",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const resetPoll = () => {
    setSelectedOption(null);
    setHasVoted(false);
    setShowResults(false);

    // Remove from localStorage
    const currentPoll = polls[currentPollIndex];
    const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}");
    delete votedPolls[currentPoll.id];
    localStorage.setItem("voted_polls", JSON.stringify(votedPolls));
  };

  const nextPoll = () => {
    if (currentPollIndex < polls.length - 1) {
      setCurrentPollIndex(currentPollIndex + 1);
      setSelectedOption(null);
      setHasVoted(false);
      setShowResults(false);
    }
  };

  const prevPoll = () => {
    if (currentPollIndex > 0) {
      setCurrentPollIndex(currentPollIndex - 1);
      setSelectedOption(null);
      setHasVoted(false);
      setShowResults(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Loading Poll...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || polls.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">No Active Polls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {error || "There are no active polls at the moment."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchPolls}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentPoll = polls[currentPollIndex];
  const hasMultiplePolls = polls.length > 1;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">
              {currentPoll.question}
            </CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="text-xs font-normal">
                {currentPoll.category}
              </Badge>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowResults(!showResults)}
            disabled={!hasVoted && showResults}
          >
            {showResults ? (
              <VoteIcon className="h-4 w-4" />
            ) : (
              <BarChart3 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!showResults ? (
          <RadioGroup
            value={selectedOption?.toString() || ""}
            onValueChange={(value) => setSelectedOption(Number(value))}
            className="space-y-3"
            disabled={hasVoted}
          >
            {currentPoll.options.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-3 transition-colors",
                  selectedOption === option.id && "border-primary bg-primary/5"
                )}
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="flex-1 cursor-pointer font-normal"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            {currentPoll.options.map((option) => (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {selectedOption === option.id && hasVoted && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                    <span
                      className={
                        selectedOption === option.id && hasVoted
                          ? "font-medium"
                          : ""
                      }
                    >
                      {option.text}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {option.percentage}%
                  </span>
                </div>
                <Progress
                  value={option.percentage}
                  className={cn(
                    "h-2",
                    selectedOption === option.id && hasVoted
                      ? "bg-primary/20"
                      : "bg-muted"
                  )}
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
          {currentPoll.expiresAt ? (
            <div className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" />
              <span>{getTimeRemaining()}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>
                {currentPoll.totalVotes}{" "}
                {currentPoll.totalVotes === 1 ? "vote" : "votes"}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {hasVoted ? (
            <>
              <Button variant="outline" size="sm" onClick={resetPoll}>
                Vote Again
              </Button>
              {hasMultiplePolls && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPoll}
                    disabled={currentPollIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPoll}
                    disabled={currentPollIndex === polls.length - 1}
                  >
                    Next
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              size="sm"
              disabled={!selectedOption || isSubmitting}
              onClick={handleVote}
            >
              {isSubmitting ? "Submitting..." : "Vote"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
