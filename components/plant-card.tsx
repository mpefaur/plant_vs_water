"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet, Calendar } from "lucide-react";
import { PlantWithWateringInfo } from "@/lib/plant-service";

interface PlantCardProps {
  plant: PlantWithWateringInfo;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const getStatusColor = () => {
    if (!plant.lastWatered) return "bg-yellow-500";
    if (plant.needsWater) return "bg-red-500";
    return "bg-green-500";
  };

  const calculateTimeRemaining = (wateringEvents: { watered_at: string }[], interval: number) => {
    if (!wateringEvents || wateringEvents.length === 0) {
      return { text: "No watering recorded yet.", isNegative: false };
    }

    const sortedEvents = [...wateringEvents].sort((a, b) => 
      new Date(b.watered_at).getTime() - new Date(a.watered_at).getTime()
    );
    const lastWateredDate = new Date(sortedEvents[0].watered_at);
    const nextWateringDate = new Date(lastWateredDate.getTime() + interval * 24 * 60 * 60 * 1000);
    const now = new Date();
    const timeDiff = nextWateringDate.getTime() - now.getTime();

    const isNegative = timeDiff <= 0;
    const absTimeDiff = Math.abs(timeDiff);

    const days = Math.floor(absTimeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absTimeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return {
      text: `${days} días, ${hours} horas, ${minutes} minutos`,
      isNegative,
    };
  };

  const timeRemaining = calculateTimeRemaining(plant.watering_events ?? [], plant.watering_interval);

  return (
    <Link href={`/plants/${plant.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div className="relative h-[266px] w-[266px] mx-auto">
          <div 
            className={`absolute top-2 right-2 h-3 w-3 rounded-full ${getStatusColor()} z-10`}
            title={plant.needsWater ? "Needs water" : "Recently watered"}
          ></div>
          <Image
            src={plant.image_url}
            alt={plant.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="pt-4">
          <h3 className="text-lg font-semibold line-clamp-1">{plant.name}</h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground gap-1">
            <Calendar className="h-4 w-4 mr-1" />
            Water every {plant.watering_interval} day{plant.watering_interval !== 1 ? 's' : ''}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          {plant.lastWatered ? (
            <div className="flex items-center gap-2">
              <Droplet className={`h-4 w-4 ${plant.needsWater ? 'text-red-500' : 'text-blue-500'}`} />
              <span className="text-xs text-muted-foreground">
                Watered {plant.lastWatered.timeAgo}
              </span>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs">
              Not watered
            </Badge>
          )}
          <div className={`text-xs font-semibold ${timeRemaining.isNegative ? 'text-red-500' : 'text-green-500'}`}>
            {timeRemaining.text}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}