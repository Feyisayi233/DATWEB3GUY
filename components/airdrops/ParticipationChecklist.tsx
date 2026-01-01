"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { HtmlContent } from "./HtmlContent";

interface Step {
  index: number;
  title: string;
  content: string;
  html: string;
  completed: boolean;
  completedAt: string | null;
  notes: string | null;
}

interface ParticipationChecklistProps {
  airdropId: string;
  participationSteps: string;
}

export function ParticipationChecklist({
  airdropId,
  participationSteps,
}: ParticipationChecklistProps) {
  const { data: session } = useSession();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (session) {
      fetchProgress();
    } else {
      setFetching(false);
    }
  }, [session, airdropId]);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/airdrops/${airdropId}/progress`);
      if (res.ok) {
        const data = await res.json();
        setSteps(data.steps || []);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setFetching(false);
    }
  };

  const toggleStep = async (stepIndex: number, completed: boolean) => {
    if (!session) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/airdrops/${airdropId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepIndex,
          completed: !completed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update the step in local state
        setSteps((prevSteps) =>
          prevSteps.map((step) =>
            step.index === stepIndex
              ? {
                  ...step,
                  completed: data.progress.completed,
                  completedAt: data.progress.completedAt,
                }
              : step
          )
        );
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Participation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <HtmlContent content={participationSteps} />
          </div>
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <a
                href="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Sign in
              </a>{" "}
              to track your progress with a checklist
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (fetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Participation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Participation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <HtmlContent content={participationSteps} />
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Participation Checklist</CardTitle>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {completedCount}/{steps.length} completed
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.index}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border-2 transition-all",
                step.completed
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
              )}
            >
              <button
                onClick={() => toggleStep(step.index, step.completed)}
                disabled={loading}
                className={cn(
                  "flex-shrink-0 mt-1 transition-all",
                  step.completed
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h4
                  className={cn(
                    "font-semibold mb-2",
                    step.completed
                      ? "text-green-900 dark:text-green-100 line-through"
                      : "text-gray-900 dark:text-white"
                  )}
                >
                  Step {step.index + 1}: {step.title}
                </h4>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <HtmlContent content={step.html} />
                </div>
                {step.completedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Completed {new Date(step.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
