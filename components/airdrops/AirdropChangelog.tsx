"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { History, ChevronDown, ChevronUp, Plus, Minus, Edit } from "lucide-react";
import { formatChangeForDisplay, formatFieldName, truncateText } from "@/lib/airdrop-changes";

interface AirdropChange {
  id: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string;
  changeType: string;
  changedAt: Date;
}

interface AirdropChangelogProps {
  changes: AirdropChange[];
}

export function AirdropChangelog({ changes }: AirdropChangelogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());

  if (changes.length === 0) {
    return null;
  }

  // Group changes by date
  const groupedChanges = changes.reduce((acc, change) => {
    const date = new Date(change.changedAt);
    const dateKey = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(change);
    return acc;
  }, {} as Record<string, AirdropChange[]>);

  const displayChanges = isExpanded ? changes : changes.slice(0, 5);
  const hasMore = changes.length > 5;

  const toggleChangeExpansion = (changeId: string) => {
    const newExpanded = new Set(expandedChanges);
    if (newExpanded.has(changeId)) {
      newExpanded.delete(changeId);
    } else {
      newExpanded.add(changeId);
    }
    setExpandedChanges(newExpanded);
  };

  const getChangeTypeBadge = (changeType: string) => {
    switch (changeType) {
      case "added":
        return (
          <Badge variant="success" size="sm" className="flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Added
          </Badge>
        );
      case "removed":
        return (
          <Badge variant="error" size="sm" className="flex items-center gap-1">
            <Minus className="h-3 w-3" />
            Removed
          </Badge>
        );
      default:
        return (
          <Badge variant="info" size="sm" className="flex items-center gap-1">
            <Edit className="h-3 w-3" />
            Updated
          </Badge>
        );
    }
  };

  return (
    <Card className="border-2 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <History className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          What&apos;s New
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayChanges.map((change) => {
            const isExpandedChange = expandedChanges.has(change.id);
            const isTextChange = change.fieldName !== "status" && change.fieldName !== "startDate" && change.fieldName !== "endDate";
            const showDiff = isTextChange && (change.oldValue || change.newValue.length > 100);

            return (
              <div
                key={change.id}
                className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getChangeTypeBadge(change.changeType)}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatFieldName(change.fieldName)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatChangeForDisplay(change).split(" ").slice(-2).join(" ")}
                      </span>
                    </div>
                    {!showDiff && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatChangeForDisplay(change)}
                      </p>
                    )}
                    {showDiff && !isExpandedChange && (
                      <div className="space-y-1">
                        {change.oldValue && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-through">
                            Old: {truncateText(change.oldValue, 150)}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          New: {truncateText(change.newValue, 150)}
                        </p>
                      </div>
                    )}
                    {showDiff && isExpandedChange && (
                      <div className="space-y-2 mt-2">
                        {change.oldValue && (
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3">
                            <p className="text-xs font-semibold text-red-800 dark:text-red-400 mb-1">
                              Previous Value:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {change.oldValue}
                            </p>
                          </div>
                        )}
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-3">
                          <p className="text-xs font-semibold text-green-800 dark:text-green-400 mb-1">
                            New Value:
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {change.newValue}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {showDiff && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleChangeExpansion(change.id)}
                      className="shrink-0"
                    >
                      {isExpandedChange ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          More
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show All Changes ({changes.length})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
