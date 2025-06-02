"use client";

import { Activity, BarChartBig, Cpu, DollarSign, PackageCheck, PlusCircle, Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import type { KpiCardProps } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LineChart, Line, ResponsiveContainer } from "recharts";

const kpiData: KpiCardProps[] = [
  { title: "Active Models", value: "12", icon: Rocket, description: "Currently deployed and serving predictions.", trend: "up", trendValue: "+2" },
  { title: "Total Experiments", value: "157", icon: Target, description: "Completed and ongoing experiments.", trend: "up", trendValue: "+10%" },
  { title: "Avg. Training Time", value: "45 min", icon: Cpu, description: "Average duration per training job.", trend: "down", trendValue: "-5 min" },
  { title: "Deployment Success", value: "98.7%", icon: PackageCheck, description: "Successful deployments last 30 days.", trend: "neutral", trendValue: "0.1%" },
];

const modelPerformanceData = [
  { month: "Jan", accuracy: 0.82 }, { month: "Feb", accuracy: 0.85 },
  { month: "Mar", accuracy: 0.83 }, { month: "Apr", accuracy: 0.88 },
  { month: "May", accuracy: 0.90 }, { month: "Jun", accuracy: 0.89 },
];

const resourceUtilizationData = [
  { resource: "CPU", usage: 75 }, { resource: "Memory", usage: 60 },
  { resource: "GPU", usage: 85 }, { resource: "Disk", usage: 40 },
];

const chartConfig = {
  accuracy: { label: "Accuracy", color: "hsl(var(--chart-1))" },
  usage: { label: "Usage (%)", color: "hsl(var(--chart-2))" },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">MLOps Dashboard</h1>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Model Performance Over Time</CardTitle>
            <CardDescription>Tracking accuracy of a key model.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={modelPerformanceData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0.7, 1.0]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Line dataKey="accuracy" type="monotone" stroke="var(--color-accuracy)" strokeWidth={2} dot={false} />
                 <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>Current cluster resource usage.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={resourceUtilizationData} layout="vertical" margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="usage" tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
                <YAxis type="category" dataKey="resource" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
