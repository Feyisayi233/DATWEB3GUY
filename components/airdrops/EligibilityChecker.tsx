"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";

interface EligibilityCheckerProps {
  airdrop: {
    id: string;
    eligibilityCriteria: string;
  };
}

export function EligibilityChecker({ airdrop }: EligibilityCheckerProps) {
  const [walletAddress, setWalletAddress] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    eligible: boolean;
    message: string;
  } | null>(null);

  const handleCheck = async () => {
    if (!walletAddress.trim()) {
      setResult({
        eligible: false,
        message: "Please enter a wallet address",
      });
      return;
    }

    setChecking(true);
    // Simulate eligibility check
    // In a real implementation, this would call an API to check eligibility
    setTimeout(() => {
      setChecking(false);
      setResult({
        eligible: Math.random() > 0.5, // Random for demo
        message: Math.random() > 0.5
          ? "Congratulations! You are eligible for this airdrop."
          : "You are not currently eligible for this airdrop. Check the eligibility criteria above.",
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Eligibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wallet Address
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Button
          onClick={handleCheck}
          disabled={checking}
          className="w-full"
        >
          {checking ? "Checking..." : "Check Eligibility"}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-md flex items-start gap-3 ${
              result.eligible
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            {result.eligible ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                result.eligible
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {result.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

