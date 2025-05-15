"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getWateringHistory } from "@/lib/plant-service";
import { Droplet } from "lucide-react";

interface WateringHistoryProps {
  plantId: string;
  refreshHistory: () => Promise<void>;
}

export default function WateringHistory({ plantId, refreshHistory }: WateringHistoryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [wateringEvents, setWateringEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchWateringHistory() {
      try {
        const events = await getWateringHistory(plantId);
        setWateringEvents(events);
      } catch (error) {
        console.error("Error fetching watering history:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWateringHistory();
  }, [plantId]);

  if (isLoading) {
    return <div className="text-center py-4">Loading history...</div>;
  }

  if (wateringEvents.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No watering history yet.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="history">
        <AccordionTrigger className="text-sm font-medium">
          Watering History
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {wateringEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-2 py-2 border-b last:border-b-0">
                <Droplet className="h-4 w-4 text-blue-500 shrink-0" />
                <div className="flex-1 text-sm">
                  <div className="font-medium">
                    {format(parseISO(event.watered_at), "MMMM d, yyyy")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(event.watered_at), "h:mm a")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}