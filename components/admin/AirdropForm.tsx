"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { RichTextEditor } from "./RichTextEditor";

const airdropSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["potential", "confirmed", "verification", "reward available"]),
  socialLinks: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  rewardType: z.string().optional(),
  cost: z.string().optional(),
  taskType: z.string().optional(),
  verificationLink: z.string().optional(),
  rewardAvailableLink: z.string().optional(),
  rewardDate: z.string().optional(),
  instructions: z.string().optional(),
  eligibilityCriteria: z.string().optional(),
  participationSteps: z.string().optional(),
  tokenDetails: z.string().optional(),
  affiliateLinks: z.string().optional(),
  featuredImage: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean(),
});

type AirdropFormData = z.infer<typeof airdropSchema>;

interface AirdropFormProps {
  airdrop?: {
    id: string;
    title: string;
    description: string;
    status: string;
    socialLinks: string;
    startDate: string | null;
    endDate: string | null;
    rewardType: string;
    cost: string;
    taskType: string;
    verificationLink: string | null;
    rewardAvailableLink: string | null;
    rewardDate: string;
    instructions: string;
    eligibilityCriteria: string;
    participationSteps: string;
    tokenDetails: string;
    affiliateLinks: string;
    featuredImage: string | null;
    tags: string;
    published: boolean;
  };
}

export function AirdropForm({ airdrop }: AirdropFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Parse social links JSON
  const getDefaultSocialLinks = () => {
    if (airdrop?.socialLinks) {
      try {
        const parsed = JSON.parse(airdrop.socialLinks);
        return {
          twitter: parsed.twitter || "",
          discord: parsed.discord || "",
          telegram: parsed.telegram || "",
          website: parsed.website || "",
        };
      } catch {
        return { twitter: "", discord: "", telegram: "", website: "" };
      }
    }
    return { twitter: "", discord: "", telegram: "", website: "" };
  };

  const [socialLinks, setSocialLinks] = useState(getDefaultSocialLinks());

  // Helper to format date for datetime-local input
  const formatDateForInput = (date: string | Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    // Format as YYYY-MM-DDTHH:mm for datetime-local
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AirdropFormData>({
    resolver: zodResolver(airdropSchema),
    defaultValues: airdrop
      ? {
          title: airdrop.title,
          description: airdrop.description,
          status: airdrop.status as "potential" | "confirmed" | "verification" | "reward available",
          socialLinks: airdrop.socialLinks || "",
          startDate: formatDateForInput(airdrop.startDate),
          endDate: formatDateForInput(airdrop.endDate),
          rewardType: airdrop.rewardType || "",
          cost: airdrop.cost || "",
          taskType: airdrop.taskType || "",
          verificationLink: airdrop.verificationLink || "",
          rewardAvailableLink: airdrop.rewardAvailableLink || "",
          rewardDate: airdrop.rewardDate || "TBA",
          instructions: airdrop.instructions || "",
          eligibilityCriteria: airdrop.eligibilityCriteria || "",
          participationSteps: airdrop.participationSteps || "",
          tokenDetails: airdrop.tokenDetails || "",
          affiliateLinks: airdrop.affiliateLinks || "",
          featuredImage: airdrop.featuredImage || "",
          tags: airdrop.tags || "",
          published: airdrop.published,
        }
      : {
          status: "potential",
          published: false,
          rewardDate: "TBA",
        },
  });

  const published = watch("published");
  const status = watch("status");
  const rewardDate = watch("rewardDate");
  const participationSteps = watch("participationSteps");

  const onSubmit = async (data: AirdropFormData) => {
    setLoading(true);
    setError("");

    try {
      // Format social links as JSON
      const socialLinksJson = JSON.stringify(socialLinks);
      
      // Format dates
      const submitData = {
        ...data,
        socialLinks: socialLinksJson,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      };

      const url = airdrop ? `/api/airdrops/${airdrop.id}` : "/api/airdrops";
      const method = airdrop ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save airdrop");
      }

      router.push("/admin/airdrops");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {airdrop && airdrop.published && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-1">⚠️ Published Airdrop</p>
          <p className="text-sm">
            This airdrop is published and visible to users. Any changes you make will be tracked and displayed in the changelog on the public page.
          </p>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Title *"
            {...register("title")}
            error={errors.title?.message}
          />
          <Textarea
            label="Description *"
            rows={4}
            {...register("description")}
            error={errors.description?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="potential">Potential</option>
              <option value="confirmed">Confirmed</option>
              <option value="verification">Verification</option>
              <option value="reward available">Reward Available</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>
          <Input
            label="Featured Image URL"
            {...register("featuredImage")}
            error={errors.featuredImage?.message}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="Tags (comma-separated)"
            {...register("tags")}
            error={errors.tags?.message}
            placeholder="tag1, tag2, tag3"
          />
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Twitter/X URL"
            type="url"
            value={socialLinks.twitter}
            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            placeholder="https://twitter.com/..."
          />
          <Input
            label="Discord URL"
            type="url"
            value={socialLinks.discord}
            onChange={(e) => setSocialLinks({ ...socialLinks, discord: e.target.value })}
            placeholder="https://discord.gg/..."
          />
          <Input
            label="Telegram URL"
            type="url"
            value={socialLinks.telegram}
            onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })}
            placeholder="https://t.me/..."
          />
          <Input
            label="Website URL"
            type="url"
            value={socialLinks.website}
            onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
            placeholder="https://example.com"
          />
        </CardContent>
      </Card>

      {/* Time & Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Time & Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="datetime-local"
              {...register("startDate")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="datetime-local"
              {...register("endDate")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reward Information */}
      <Card>
        <CardHeader>
          <CardTitle>Reward Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Reward Type"
            {...register("rewardType")}
            error={errors.rewardType?.message}
            placeholder="e.g., Tokens, NFTs, Points"
          />
          <Input
            label="Cost"
            {...register("cost")}
            error={errors.cost?.message}
            placeholder="e.g., Free, $10, 0.1 ETH"
          />
          <Input
            label="Task Type"
            {...register("taskType")}
            error={errors.taskType?.message}
            placeholder="e.g., Social Media, On-chain, Quiz"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reward Date
            </label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="TBA"
                  checked={rewardDate === "TBA"}
                  onChange={(e) => setValue("rewardDate", e.target.value)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">TBA</span>
              </label>
              <label className="flex items-center gap-2 flex-1">
                <input
                  type="radio"
                  value="date"
                  checked={rewardDate !== "TBA" && rewardDate !== ""}
                  onChange={() => setValue("rewardDate", new Date().toISOString().split("T")[0])}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={rewardDate !== "TBA" ? rewardDate : ""}
                  onChange={(e) => setValue("rewardDate", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={rewardDate === "TBA"}
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Links */}
      {(status === "verification" || status === "reward available") && (
        <Card>
          <CardHeader>
            <CardTitle>Status Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "verification" && (
              <Input
                label="Verification Link"
                type="url"
                {...register("verificationLink")}
                error={errors.verificationLink?.message}
                placeholder="https://example.com/verify"
              />
            )}
            {status === "reward available" && (
              <Input
                label="Reward Available Link"
                type="url"
                {...register("rewardAvailableLink")}
                error={errors.rewardAvailableLink?.message}
                placeholder="https://example.com/claim"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            label="Instructions"
            rows={6}
            {...register("instructions")}
            error={errors.instructions?.message}
            placeholder="Provide clear instructions for participants..."
          />
        </CardContent>
      </Card>

      {/* Eligibility & Participation */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility & Participation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Eligibility Criteria"
            rows={6}
            {...register("eligibilityCriteria")}
            error={errors.eligibilityCriteria?.message}
            placeholder="List the eligibility requirements..."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Participation Steps *
            </label>
            <RichTextEditor
              value={participationSteps || ""}
              onChange={(value) => setValue("participationSteps", value)}
              placeholder="Enter detailed participation steps with formatting, images, and links..."
              error={errors.participationSteps?.message}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Use the editor to format text, add images, embed links, and create lists.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Token Details"
            rows={4}
            {...register("tokenDetails")}
            error={errors.tokenDetails?.message}
            placeholder="Token name, symbol, total supply, etc."
          />
          <Textarea
            label="Affiliate Links (JSON format)"
            rows={4}
            {...register("affiliateLinks")}
            error={errors.affiliateLinks?.message}
            placeholder='{"Wallet": "https://...", "Exchange": "https://..."}'
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter as JSON object with label: URL pairs
          </p>
        </CardContent>
      </Card>

      {/* Publishing */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setValue("published", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Publish this airdrop
            </span>
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : airdrop ? "Update Airdrop" : "Create Airdrop"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/airdrops")}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
