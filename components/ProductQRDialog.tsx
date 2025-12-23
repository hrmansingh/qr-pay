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
import { QrCode, Download, Loader2 } from "lucide-react";
import QRCode from "qrcode";

interface ProductQRDialogProps {
  product: any;
}

export function ProductQRDialog({ product }: ProductQRDialogProps) {
  const [open, setOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  
  // URL to pay for the product. Format: /pay?productId=...
  // Or deep link if mobile. For web: window.location.origin + ...
  const paymentUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${product.id}`;

  useEffect(() => {
    if (open && product) {
      generateQR();
    }
  }, [open, product]);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(paymentUrl);
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (qrUrl) {
      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = `qr-${product.name.replace(/\s+/g, "-").toLowerCase()}.png`;
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
      <DialogContent className="sm:max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle>Product QR Code</DialogTitle>
          <DialogDescription>
            Scan to pay for {product.name}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          {qrUrl ? (
            <img src={qrUrl} alt={`QR Code for ${product.name}`} className="w-48 h-48 border rounded-lg" />
          ) : (
             <div className="w-48 h-48 flex items-center justify-center border rounded-lg bg-gray-50">
               <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
             </div>
          )}
          <p className="text-xs text-gray-500 break-all text-center px-4">
            {paymentUrl}
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
