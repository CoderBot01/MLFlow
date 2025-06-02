import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import type { KpiCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function KpiCard({ title, value, description, icon: Icon, trend, trendValue }: KpiCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
      {trend && trendValue && (
         <CardFooter className="text-xs">
            <span className={cn("flex items-center", trendColor)}>
              <TrendIcon className="h-4 w-4 mr-1" />
              {trendValue}
            </span>
            <span className="text-muted-foreground ml-1">vs last period</span>
         </CardFooter>
      )}
    </Card>
  );
}
