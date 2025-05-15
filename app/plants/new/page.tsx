"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Leaf, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Plant name must be at least 2 characters.",
  }),
  watering_interval: z.number().min(1, {
    message: "Watering interval must be at least 1 day.",
  }),
});

export default function NewPlantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      watering_interval: 7,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be signed in to create a plant.",
      });
      return;
    }
    
    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image of your plant.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload image to Supabase Storage
      console.log("Uploading image to Supabase Storage...");
      const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw uploadError;
      }

      console.log("Image uploaded successfully:", uploadData);

      // 2. Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from("plant-images")
        .getPublicUrl(fileName);

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Error obteniendo la URL pública de la imagen.");
      }

      console.log("Public URL obtained:", urlData.publicUrl);

      // 3. Create plant in the database using the API route
const { data, error } = await supabase.auth.getSession();
let accessToken = data.session?.access_token;

if (!accessToken) {
  console.error("No access token available");
  toast({
    variant: "destructive",
    title: "Error",
    description: "No access token available",
  });
  return;
}
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: values.name,
          image_url: urlData.publicUrl,
          watering_interval: values.watering_interval,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create plant");
      }

      const plant = await response.json();
      console.log("Plant created successfully:", plant);

      toast({
        title: "Success",
        description: "Plant created successfully",
      });

      router.push(`/plants/${plant.id}`);
    } catch (error) {
      console.error("Error creating plant:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      } else {
        console.error("Unexpected error format:", JSON.stringify(error));
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create plant. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Leaf className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold">Add New Plant</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div 
                      className="h-48 w-48 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted relative"
                    >
                      {uploadedImage ? (
                        <div className="relative w-full h-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={uploadedImage} 
                            alt="Plant preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setUploadedImage(null);
                              setImageFile(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center p-4 text-center">
                            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">Upload a photo of your plant</p>
                            <label htmlFor="plant-image" className="cursor-pointer">
                              <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                                Select Image
                              </div>
                              <input
                                id="plant-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Snake Plant" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your plant a name to easily identify it.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="watering_interval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Watering Interval (Days)</FormLabel>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={1}
                                max={30}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <span className="w-12 text-center font-medium">
                              {field.value}
                            </span>
                          </div>
                        </div>
                        <FormDescription>
                          How often should you water this plant (in days)?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Plant"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}