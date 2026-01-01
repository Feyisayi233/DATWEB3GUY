import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AirdropForm } from "@/components/admin/AirdropForm";
import { Badge } from "@/components/ui/Badge";
import { Gift } from "lucide-react";

async function getAirdrop(id: string) {
  return await prisma.airdrop.findUnique({
    where: { id },
  });
}

export default async function EditAirdropPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const airdrop = await getAirdrop(id);

  if (!airdrop) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="info" size="md" className="mb-4">
          <Gift className="h-4 w-4 mr-1" />
          Edit Content
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Edit Airdrop
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Update the details for: <span className="font-semibold text-gray-900 dark:text-white break-words">{airdrop.title}</span>
        </p>
      </div>
      <AirdropForm airdrop={airdrop} />
    </div>
  );
}

