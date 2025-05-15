"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, Printer, Download } from "lucide-react";

interface QRCodeDisplayProps {
  plantId: string;
  plantName: string;
}

export default function QRCodeDisplay({ plantId, plantName }: QRCodeDisplayProps) {
  const [open, setOpen] = useState(false);
  const qrValue = `${window.location.origin}/plants/${plantId}`;

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `${plantName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
    link.href = url;
    link.click();
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code for ${plantName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            img {
              max-width: 300px;
              height: auto;
            }
            h2 {
              margin: 20px 0;
            }
            p {
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${url}" alt="QR Code" />
            <h2>${plantName}</h2>
            <p>Scan this QR code to see watering information</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.setTimeout(function() {
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="h-4 w-4" />
          View QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plant QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to quickly access your plant's information.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="border border-border p-4 rounded-md bg-white">
            <QRCodeSVG
              id="qr-code-canvas"
              value={qrValue}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Place this QR code near your plant for easy scanning
          </p>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          <Button onClick={downloadQRCode} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button onClick={printQRCode} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}