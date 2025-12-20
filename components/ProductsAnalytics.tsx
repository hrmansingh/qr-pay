"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Filter, QrCode } from "lucide-react";

const productsData = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    scans: 523,
    purchases: 127,
    conversion: 24.3,
    revenue: 38098.73,
  },
  {
    id: 2,
    name: "Smartphone Case - Premium",
    price: 49.99,
    scans: 412,
    purchases: 98,
    conversion: 23.8,
    revenue: 4899.02,
  },
  {
    id: 3,
    name: "USB-C Fast Charger",
    price: 34.99,
    scans: 387,
    purchases: 85,
    conversion: 22.0,
    revenue: 2974.15,
  },
  {
    id: 4,
    name: "Tempered Glass Screen Protector",
    price: 19.99,
    scans: 298,
    purchases: 72,
    conversion: 24.2,
    revenue: 1439.28,
  },
  {
    id: 5,
    name: "Lightning to USB-C Cable",
    price: 24.99,
    scans: 267,
    purchases: 61,
    conversion: 22.8,
    revenue: 1524.39,
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    price: 59.99,
    scans: 189,
    purchases: 42,
    conversion: 22.2,
    revenue: 2519.58,
  },
];

export function ProductsAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Product Analytics</h2>
        <p className="text-sm text-gray-500">Track QR scans, purchases, and conversion rates</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search products..." className="pl-9 bg-white rounded-lg" />
        </div>
        <Button variant="outline" className="w-full sm:w-[140px] bg-white rounded-lg text-gray-600">
          <Filter className="w-4 h-4 mr-2" />
          All Products
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product Name</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">QR Scans</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Purchases</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Conversion</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productsData.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">{product.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 text-right">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 text-right">{product.scans.toLocaleString()}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 text-right">{product.purchases}</td>
                  <td className="py-4 px-4 text-right">
                    <Badge
                      className={
                        product.conversion >= 24
                          ? "bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1"
                          : "bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-1"
                      }
                    >
                      {product.conversion}%
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-blue-600 text-right">
                    ${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="outline" size="sm" className="bg-white rounded-lg text-gray-600 hover:bg-gray-50">
                      <QrCode className="w-3 h-3 mr-1" />
                      Generate QR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}