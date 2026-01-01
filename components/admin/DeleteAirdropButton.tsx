"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteAirdropButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this airdrop?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/airdrops/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete airdrop");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:border-red-300"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

