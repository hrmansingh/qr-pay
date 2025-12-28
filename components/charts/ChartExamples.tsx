"use client";

import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Tooltip,
  Legend
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/lightswind/chart';

// Sample data for different chart types
const lineData = [
  { month: 'Jan', sales: 4000, revenue: 2400 },
  { month: 'Feb', sales: 3000, revenue: 1398 },
  { month: 'Mar', sales: 2000, revenue: 9800 },
  { month: 'Apr', sales: 2780, revenue: 3908 },
  { month: 'May', sales: 1890, revenue: 4800 },
  { month: 'Jun', sales: 2390, revenue: 3800 },
];

const barData = [
  { category: 'Electronics', value: 4000, growth: 12 },
  { category: 'Clothing', value: 3000, growth: 8 },
  { category: 'Books', value: 2000, growth: 15 },
  { category: 'Home', value: 2780, growth: 5 },
  { category: 'Sports', value: 1890, growth: 20 },
];

const pieData = [
  { name: 'Desktop', value: 400, fill: '#8884d8' },
  { name: 'Mobile', value: 300, fill: '#82ca9d' },
  { name: 'Tablet', value: 200, fill: '#ffc658' },
  { name: 'Other', value: 100, fill: '#ff7c7c' },
];

const areaData = [
  { month: 'Jan', users: 4000, sessions: 2400 },
  { month: 'Feb', users: 3000, sessions: 1398 },
  { month: 'Mar', users: 2000, sessions: 9800 },
  { month: 'Apr', users: 2780, sessions: 3908 },
  { month: 'May', users: 1890, sessions: 4800 },
  { month: 'Jun', users: 2390, sessions: 3800 },
];

const radarData = [
  { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Security', A: 98, B: 130, fullMark: 150 },
  { subject: 'Usability', A: 86, B: 130, fullMark: 150 },
  { subject: 'Reliability', A: 99, B: 100, fullMark: 150 },
  { subject: 'Scalability', A: 85, B: 90, fullMark: 150 },
  { subject: 'Maintainability', A: 65, B: 85, fullMark: 150 },
];

const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

// Chart configurations
const lineChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const barChartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
  growth: {
    label: "Growth %",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const areaChartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function LineChartExample() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Line Chart</h3>
      <ChartContainer config={lineChartConfig} className="min-h-[200px] w-full">
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="var(--color-sales)" 
            strokeWidth={2}
            dot={{ fill: "var(--color-sales)" }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--color-revenue)" 
            strokeWidth={2}
            dot={{ fill: "var(--color-revenue)" }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export function BarChartExample() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
      <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export function PieChartExample() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
      <ChartContainer config={pieChartConfig} className="min-h-[200px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}

export function AreaChartExample() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Area Chart</h3>
      <ChartContainer config={areaChartConfig} className="min-h-[200px] w-full">
        <AreaChart data={areaData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="users" 
            stackId="1" 
            stroke="var(--color-users)" 
            fill="var(--color-users)" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="sessions" 
            stackId="1" 
            stroke="var(--color-sessions)" 
            fill="var(--color-sessions)" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export function RadarChartExample() {
  const radarConfig = {
    A: {
      label: "Product A",
      color: "hsl(var(--chart-1))",
    },
    B: {
      label: "Product B", 
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Radar Chart</h3>
      <ChartContainer config={radarConfig} className="min-h-[200px] w-full">
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Radar 
            name="Product A" 
            dataKey="A" 
            stroke="var(--color-A)" 
            fill="var(--color-A)" 
            fillOpacity={0.6} 
          />
          <Radar 
            name="Product B" 
            dataKey="B" 
            stroke="var(--color-B)" 
            fill="var(--color-B)" 
            fillOpacity={0.6} 
          />
        </RadarChart>
      </ChartContainer>
    </div>
  );
}

export function ScatterChartExample() {
  const scatterConfig = {
    data: {
      label: "Data Points",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Scatter Chart</h3>
      <ChartContainer config={scatterConfig} className="min-h-[200px] w-full">
        <ScatterChart data={scatterData}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="X Value" />
          <YAxis type="number" dataKey="y" name="Y Value" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Scatter name="Data" dataKey="z" fill="var(--color-data)" />
        </ScatterChart>
      </ChartContainer>
    </div>
  );
}

export function ComposedChartExample() {
  const composedConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
    growth: {
      label: "Growth",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Composed Chart (Bar + Line)</h3>
      <ChartContainer config={composedConfig} className="min-h-[200px] w-full">
        <ComposedChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="sales" fill="var(--color-sales)" />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--color-revenue)" 
            strokeWidth={2}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}

// Main component that shows all chart examples
export default function AllChartsExample() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Lightswind Chart Examples</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LineChartExample />
        <BarChartExample />
        <AreaChartExample />
        <PieChartExample />
        <RadarChartExample />
        <ScatterChartExample />
      </div>
      
      <div className="w-full">
        <ComposedChartExample />
      </div>
    </div>
  );
}