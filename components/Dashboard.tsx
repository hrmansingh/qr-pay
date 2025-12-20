"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, TrendingUp, QrCode, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { date: "Mon", sales: 45 },
  { date: "Tue", sales: 52 },
  { date: "Wed", sales: 38 },
  { date: "Thu", sales: 61 },
  { date: "Fri", sales: 73 },
  { date: "Sat", sales: 89 },
  { date: "Sun", sales: 67 },
];

const productData = [
  { name: "Headphones", revenue: 8900 },
  { name: "Phone Case", revenue: 3200 },
  { name: "Charger", revenue: 2100 },
  { name: "Screen Protector", revenue: 1800 },
  { name: "Cable", revenue: 1200 },
];

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sales Over Time */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">Sales Over Time</h3>
            <p className="text-sm text-gray-500">Last 7 days performance</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="sales" stroke="#5b5ff9" strokeWidth={2} dot={{ fill: "#5b5ff9", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Selling Products */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900">Top Selling Products</h3>
            <p className="text-sm text-gray-500">Revenue by product category</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} angle={-20} textAnchor="end" height={70} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="revenue" fill="#5b5ff9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}