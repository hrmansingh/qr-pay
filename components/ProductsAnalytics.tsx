"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Filter, Loader2 } from "lucide-react";
import { CreateProductDialog } from "./CreateProductDialog";
import { ProductQRDialog } from "./ProductQRDialog";

interface ProductsAnalyticsProps {
  businessId: string;
}

export function ProductsAnalytics({ businessId }: ProductsAnalyticsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch products assigned to this business
      const response = await fetch(`/api/business-products?business_id=${businessId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch business products');
      }
      const { businessProducts } = await response.json();
      
      // Extract products from business_products relationship
      const products = businessProducts.map((bp: any) => ({
        ...bp.products,
        id: bp.product_id, // Use the product_id as the id
        price_override: bp.price_override,
        business_product_id: bp.id
      }));
      
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [businessId]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Product Analytics</h2>
          <p className="text-sm text-gray-500">Track QR scans, purchases, and conversion rates</p>
        </div>
        <CreateProductDialog businessId={businessId} onProductCreated={fetchProducts} />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 bg-white rounded-lg" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              {loading ? (
                <tr key="loading">
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr key="empty">
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No products found. Create one to get started.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{product.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 text-right">₹{(product.price_override || product.base_price)?.toFixed(2) || '0.00'}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 text-right">{product.scans || 0}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 text-right">{product.purchases || 0}</td>
                    <td className="py-4 px-4 text-right">
                      <Badge
                        className="bg-gray-100 text-gray-700 border-gray-200 text-xs px-2 py-1"
                      >
                        0%
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-blue-600 text-right">
                      ₹0.00
                    </td>
                    <td className="py-4 px-4 text-right">
                      <ProductQRDialog product={product} businessId={businessId} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
