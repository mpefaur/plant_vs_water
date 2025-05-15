"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import PlantCard from "@/components/plant-card";
import { getPlants } from "@/lib/plant-service";

type WateringEvent = {
  watered_at: string;
};

type Plant = {
  id: string;
  name: string;
  watering_events: WateringEvent[];
  lastWatered?: string | null;
};

export default function PlantsPage() {
  const { user, isLoading } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    if (!isLoading && user) {
      getPlants(user.id)
        .then((fetchedPlants) => {
          setPlants(
            fetchedPlants.map((plant: Plant) => {
              const sortedEvents = plant.watering_events.sort(
                (a, b) => new Date(b.watered_at).getTime() - new Date(a.watered_at).getTime()
              );
              const lastWatered = sortedEvents[0]?.watered_at || null;
              return {
                ...plant,
                lastWatered,
              };
            })
          );
          console.log("Plants fetched in My Plants page:", fetchedPlants);
        })
        .catch((error) => {
          console.error("Error fetching plants:", error);
        });
    }
  }, [isLoading, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    redirect("/auth/signin");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Plants</h1>
        <Link href="/plants/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Plant
          </Button>
        </Link>
      </div>

      {plants.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">No plants yet</h2>
          <p className="text-muted-foreground mb-6">
            Add your first plant to get started tracking your watering schedule
          </p>
          <Link href="/plants/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Plant
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}