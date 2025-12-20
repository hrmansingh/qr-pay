"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Eye, Store } from "lucide-react";

const businessesData = [
  {
    id: 1,
    name: "AudioTech Store",
    totalSales: 425,
    totalRevenue: 17200,
    status: "active" as const,
  },
  {
    id: 2,
    name: "Mobile Accessories Hub",
    totalSales: 312,
    totalRevenue: 8950,
    status: "active" as const,
  },
  {
    id: 3,
    name: "Tech Gadgets Pro",
    totalSales: 189,
    totalRevenue: 5430,
    status: "active" as const,
  },
  {
    id: 4,
    name: "Smart Home Solutions",
    totalSales: 98,
    totalRevenue: 3210,
    status: "inactive" as const,
  },
  {
    id: 5,
    name: "Gaming Gear Central",
    totalSales: 267,
    totalRevenue: 12840,
    status: "active" as const,
  },
  {
    id: 6,
    name: "Office Essentials",
    totalSales: 143,
    totalRevenue: 4120,
    status: "active" as const,
  },
];

export function BusinessesManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Businesses</h2>
          <p className="text-sm text-gray-500">Manage your business accounts and analytics</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Add New Business
        </Button>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businessesData.map((business) => (
          <Card key={business.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">{business.name}</CardTitle>
                  </div>
                </div>
                <Badge
                  className={
                    business.status === "active"
                      ? "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1"
                      : "bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-1"
                  }
                >
                  {business.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                  <p className="text-lg font-semibold text-gray-900">{business.totalSales}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Revenue</p>
                  <p className="text-lg font-semibold text-blue-600">${business.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Action Button */}
              <Button variant="outline" className="w-full bg-white rounded-lg text-gray-600 hover:bg-gray-50">
                <Eye className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}