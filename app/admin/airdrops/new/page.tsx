import { AirdropForm } from "@/components/admin/AirdropForm";
import { Badge } from "@/components/ui/Badge";
import { Gift } from "lucide-react";

export default function NewAirdropPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="info" size="md" className="mb-4">
          <Gift className="h-4 w-4 mr-1" />
          New Content
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Create New Airdrop
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Fill in the details below to create a new airdrop
        </p>
      </div>
      <AirdropForm />
    </div>
  );
}

