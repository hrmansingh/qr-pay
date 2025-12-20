"use client";

import { Card } from "./ui/card";
import { DollarSign, TrendingUp, QrCode, Activity } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./lightswind/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const salesData = [
  { date: "Mon", sales: 45, revenue: 2250 },
  { date: "Tue", sales: 52, revenue: 2600 },
  { date: "Wed", sales: 38, revenue: 1900 },
  { date: "Thu", sales: 61, revenue: 3050 },
  { date: "Fri", sales: 73, revenue: 3650 },
  { date: "Sat", sales: 89, revenue: 4450 },
  { date: "Sun", sales: 67, revenue: 3350 },
];

const productData = [
  { name: "Headphones", revenue: 8900, sales: 178, profit: 2670 },
  { name: "Phone Case", revenue: 3200, sales: 160, profit: 960 },
  { name: "Charger", revenue: 2100, sales: 105, profit: 630 },
  { name: "Screen Protector", revenue: 1800, sales: 180, profit: 540 },
  { name: "Cable", revenue: 1200, sales: 120, profit: 360 },
];

const pieData = [
  { name: "Headphones", value: 8900, fill: "#8884d8" },
  { name: "Phone Case", value: 3200, fill: "#82ca9d" },
  { name: "Charger", value: 2100, fill: "#ffc658" },
  { name: "Screen Protector", value: 1800, fill: "#ff7c7c" },
  { name: "Cable", value: 1200, fill: "#8dd1e1" },
];

const radarData = [
  { product: "Headphones", revenue: 89, sales: 89, profit: 89 },
  { product: "Phone Case", revenue: 36, sales: 80, profit: 32 },
  { product: "Charger", revenue: 24, sales: 53, profit: 21 },
  { product: "Screen Protector", revenue: 20, sales: 90, profit: 18 },
  { product: "Cable", revenue: 13, sales: 60, profit: 12 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#5b5ff9",
  },
  revenue: {
    label: "Revenue",
    color: "#8884d8",
  },
  profit: {
    label: "Profit",
    color: "#82ca9d",
  },
};

export function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Total Sales</div>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">425</div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12.5% from last week
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">$17,200</div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +8.2% from last week
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Total QR Scans</div>
            <QrCode className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">1,842</div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +15.3% from last week
          </div>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-2">23.1%</div>
          <div className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +2.4% from last week
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Line Chart - Sales Over Time */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">Sales Trend</h3>
            <p className="text-sm text-gray-500">Daily sales and revenue</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="var(--color-sales)" 
                strokeWidth={2} 
                dot={{ fill: "var(--color-sales)", r: 4 }} 
              />
            </LineChart>
          </ChartContainer>
        </Card>

        {/* Bar Chart - Product Revenue */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">Product Revenue</h3>
            <p className="text-sm text-gray-500">Revenue by product category</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" height={70} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>

        {/* Area Chart - Revenue Growth */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">Revenue Growth</h3>
            <p className="text-sm text-gray-500">Weekly revenue trend</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                fill="var(--color-revenue)" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        {/* Pie Chart - Revenue Distribution */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">Revenue Distribution</h3>
            <p className="text-sm text-gray-500">Product revenue breakdown</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </Card>

        {/* Radar Chart - Product Performance */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">Product Performance</h3>
            <p className="text-sm text-gray-500">Multi-dimensional product analysis</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="product" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar
                name="Revenue"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="var(--color-revenue)"
                fillOpacity={0.3}
              />
              <Radar
                name="Sales"
                dataKey="sales"
                stroke="var(--color-sales)"
                fill="var(--color-sales)"
                fillOpacity={0.3}
              />
              <Radar
                name="Profit"
                dataKey="profit"
                stroke="var(--color-profit)"
                fill="var(--color-profit)"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
}