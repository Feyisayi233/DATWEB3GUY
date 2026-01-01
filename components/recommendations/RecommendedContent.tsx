import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Gift } from "lucide-react";
import { getRecommendations, type ContentType } from "@/lib/recommendations";

interface RecommendedContentProps {
  currentId: string;
  type: ContentType;
  tags?: string;
  status?: string;
}

export async function RecommendedContent({ currentId, type, tags, status }: RecommendedContentProps) {
  const recommendations = await getRecommendations({
    currentId,
    type,
    tags,
    status,
    limit: 4,
  });

  if (recommendations.length === 0) {
    return null;
  }

  const getTypeIcon = () => Gift;
  const getTypePath = () => "/airdrops";
  const getTypeColor = () => "indigo";

  const Icon = getTypeIcon();
  const basePath = getTypePath();
  const color = getTypeColor();

  return (
    <div className="mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((item: any) => (
          <Card
            key={item.id}
            className={`border-2 hover:border-${color}-200 dark:hover:border-${color}-800 transition-all duration-300 group`}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    item.status === "reward available" ? "success" :
                    item.status === "confirmed" ? "info" :
                    item.status === "verification" ? "info" :
                    "default"
                  }
                  size="sm"
                  className="capitalize"
                >
                  {item.status}
                </Badge>
              </div>
              <CardTitle className={`text-xl group-hover:text-${color}-600 dark:group-hover:text-${color}-400 transition-colors`}>
                {item.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`${basePath}/${item.slug}`}>
                <Button variant="outline" size="sm" className={`w-full group-hover:border-${color}-400`}>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
