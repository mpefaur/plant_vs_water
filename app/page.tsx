import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Leaf, Scan, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
        <div className="mb-8 p-4">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Leaf className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Plants vs Water
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Keep track of your plants' watering schedule with QR codes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/scan">
              <Button size="lg" className="gap-2">
                <Scan className="h-5 w-5" />
                Scan QR Code
              </Button>
            </Link>
            <Link href="/plants/new">
              <Button size="lg" variant="outline" className="gap-2">
                <Plus className="h-5 w-5" />
                Add New Plant
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR</CardTitle>
              <CardDescription>
                Scan your plant's QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center bg-muted rounded-md">
                <Scan className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                View watering information for your plants
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Watering</CardTitle>
              <CardDescription>
                Record when you water your plants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center bg-muted rounded-md">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-blue-500">5</div>
                  <div className="text-xs text-muted-foreground">days ago</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Keep track of your watering schedule
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create QR</CardTitle>
              <CardDescription>
                Generate QR codes for your plants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex items-center justify-center bg-muted rounded-md">
                <div className="h-20 w-20 border-2 border-dashed border-muted-foreground rounded-md flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Link QR codes to your plants
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}