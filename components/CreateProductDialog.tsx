"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { api } from "@/lib/api";
import { Loader2, Plus } from "lucide-react";

interface CreateProductDialogProps {
  businessId: string; // Not used yet in API but should be for relation
  onProductCreated: () => void;
}

export function CreateProductDialog({ businessId, onProductCreated }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Fixed currency to INR (Indian Rupee)
  const currency = "INR";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: The current API route might not support business_id yet, but we should send it or update API.
      // Based on route.ts: POST /api/products takes { name, base_price }.
      // It inserts into 'products' table. If 'products' table has business_id, use it.
      // For MVP we just call create.
      await api.products.create({
        name,
        base_price: parseFloat(price),
        currency,
        // business_id: businessId // TODO: Update API to handle this relation
      });
      
      setOpen(false);
      setName("");
      setPrice("");
      onProductCreated();
    } catch (error) {
      console.error("Failed to create product:", error);
      // Ideally show toast error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a product to your catalog with pricing in Indian Rupees (₹).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Product Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Headphones"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">₹</span>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="pl-8"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}