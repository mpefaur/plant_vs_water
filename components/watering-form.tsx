"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { waterPlant } from "@/lib/plant-service";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  water_amount: z.number().min(1, {
    message: "Water amount must be at least 1 cup.",
  }),
});

interface WateringFormProps {
  plantId: string;
  userId: string;
}

export default function WateringForm({ plantId, userId }: WateringFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasWatered, setHasWatered] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      water_amount: 1,
    },
  });

  useEffect(() => {
    if (hasWatered) {
      // Aquí puedes manejar cualquier lógica adicional después de regar la planta
      console.log("Watering event recorded successfully.");
    }
  }, [hasWatered]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await waterPlant(plantId, userId, values.water_amount);
      
      toast({
        title: "Success",
        description: "Watering recorded successfully!",
      });
      
      setHasWatered(true); // Actualiza el estado en lugar de recargar la página
    } catch (error) {
      console.error("Error recording watering:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record watering. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="water_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Water Amount (cups)</FormLabel>
              <div className="flex items-center gap-4">
                <FormControl className="flex-1">
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <span className="w-10 text-center font-medium">
                  {field.value}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full gap-2" 
          disabled={isLoading}
        >
          <Droplet className="h-4 w-4" />
          {isLoading ? "Recording..." : "I've Watered This Plant"}
        </Button>
      </form>
    </Form>
  );
}