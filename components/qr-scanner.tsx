"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QrScanner() {
  const [scanning, setScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize scanner only on client side
    const qrCodeScanner = new Html5Qrcode("reader");
    setHtml5QrCode(qrCodeScanner);

    return () => {
      if (qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    };
  }, []);

  const startScanner = async () => {
    if (!html5QrCode) return;

    setScanning(true);
    const qrCodeSuccessCallback = (decodedText: string) => {
      // Stop scanner after successful scan
      stopScanner();
      
      try {
        // Check if the QR code is a valid URL for our app
        const url = new URL(decodedText);
        const plantId = url.searchParams.get("id");
        
        if (plantId) {
          router.push(`/plants/${plantId}`);
        } else {
          toast({
            variant: "destructive",
            title: "Invalid QR Code",
            description: "This QR code is not linked to a plant."
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid QR Code",
          description: "The scanned code is not a valid  code."
        });
      }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        undefined
      );
    } catch (error) {
      console.error("Error starting scanner:", error);
      setScanning(false);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access camera. Please check permissions."
      });
    }
  };

  const stopScanner = () => {
    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode.stop().catch(error => {
        console.error("Error stopping scanner:", error);
      });
      setScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!html5QrCode || !event.target.files || !event.target.files[0]) {
      return;
    }

    try {
      const file = event.target.files[0];
      const decodedText = await html5QrCode.scanFile(file, true);
      
      try {
        const url = new URL(decodedText);
        const plantId = url.searchParams.get("id");
        
        if (plantId) {
          router.push(`/plants/${plantId}`);
        } else {
          toast({
            variant: "destructive",
            title: "Invalid QR Code",
            description: "This QR code is not linked to a plant."
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Invalid QR Code",
          description: "The scanned code is not a valid Plants vs Water QR code."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning Failed",
        description: "Could not read QR code from image."
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera">
          <CardContent className="p-4">
            <div id="reader" className="w-full h-64 bg-muted rounded-md overflow-hidden"></div>
            <div className="flex justify-center mt-4">
              {!scanning ? (
                <Button onClick={startScanner} className="gap-2">
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopScanner} variant="destructive" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Stop Camera
                </Button>
              )}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="upload">
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-md border-2 border-dashed border-primary/20">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">Upload a QR code image</p>
              <div>
                <label htmlFor="qr-upload" className="cursor-pointer">
                  <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Select Image
                  </div>
                  <input
                    id="qr-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}