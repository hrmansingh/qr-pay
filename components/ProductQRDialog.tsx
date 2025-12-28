"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { QrCode, Download, Loader2, IndianRupee } from "lucide-react";
import { Product } from "../lib/types";

interface ProductQRDialogProps {
  product: Product & { business_id?: string };
  businessId: string;
}

export function ProductQRDialog({ product, businessId }: ProductQRDialogProps) {
  const [open, setOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(product.base_price || 0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (open && product) {
      setAmount(product.base_price || 0);
      // Don't auto-generate, let user set amount first
    }
  }, [open, product]);

  const generateQR = async () => {
    if (!amount || amount <= 0) {
      return;
    }

    if (!product.id) {
      console.error('Product ID is missing:', product);
      return;
    }

    console.log('Product object:', product);
    console.log('Business ID:', businessId);
    console.log('Product ID:', product.id);

    setIsGenerating(true);
    try {
      const requestBody = {
        business_id: businessId,
        product_id: product.id,
        amount: amount // Send custom amount
      };
      
      console.log('Request body:', requestBody);

      const response = await fetch('/api/qr-codes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrUrl(data.qr_code);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmount(newAmount);
  };

  const handleGenerateQR = () => {
    if (amount > 0) {
      generateQR();
    }
  };

  const handleDownload = () => {
    if (qrUrl) {
      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = `qr-${product.name.replace(/\s+/g, "-").toLowerCase()}-₹${amount}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white rounded-lg text-gray-600 hover:bg-gray-50">
          <QrCode className="w-3 h-3 mr-1" />
          Generate QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>UPI Payment QR Code</DialogTitle>
          <DialogDescription>
            Generate UPI QR code for {product.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">Payment Amount</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="pl-10"
                min="1"
                step="0.01"
              />
            </div>
            <p className="text-xs text-gray-500">
              Base price: ₹{product.base_price}
            </p>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerateQR} 
            disabled={!amount || amount <= 0 || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating QR...
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 mr-2" />
                Generate UPI QR Code
              </>
            )}
          </Button>

          {/* QR Code Display */}
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            {qrUrl ? (
              <>
                <img 
                  src={qrUrl} 
                  alt={`UPI QR Code for ${product.name}`} 
                  className="w-48 h-48 border rounded-lg shadow-sm" 
                />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    ₹{amount.toFixed(2)} - {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Scan with any UPI app to pay
                  </p>
                  <p className="text-xs text-gray-400">
                    QR Code ID: {product.id}
                  </p>
                </div>
              </>
            ) : amount > 0 ? (
              <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="text-center">
                  <QrCode className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click Generate to create QR</p>
                </div>
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="text-center">
                  <IndianRupee className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Enter amount to generate QR</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={handleDownload} 
            variant="outline" 
            className="w-full"
            disabled={!qrUrl}
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
