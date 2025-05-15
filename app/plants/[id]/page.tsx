"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Droplet,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { getPlantWithWateringInfo, deletePlant, waterPlant } from "@/lib/plant-service";
import { useAuth } from "@/components/auth-provider";
import WateringForm from "@/components/watering-form";
import QRCodeDisplay from "@/components/qr-code-display";
import WateringHistory from "@/components/watering-history";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Plant } from "@/types/supabase";

export default function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const userId = user?.id;

  const router = useRouter();
  const [plant, setPlant] = React.useState<Plant | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const [id, setId] = React.useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedInterval, setEditedInterval] = useState(0);

  React.useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  React.useEffect(() => {
    if (!id) return;

    async function fetchPlant() {
      try {
        const fetchedPlant = await getPlantWithWateringInfo(id);
        setPlant(fetchedPlant);
      } catch (err) {
        console.error("Error fetching plant:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
    }

    fetchPlant();
  }, [id]);

  React.useEffect(() => {
    if (plant) {
      setEditedName(plant.name);
      setEditedInterval(plant.watering_interval);
    }
  }, [plant]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/plants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          watering_interval: editedInterval,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update plant.");
      }

      const updatedPlant = await response.json();
      setPlant(updatedPlant);
      setIsEditing(false);
      alert("Plant updated successfully.");
    } catch (err) {
      console.error("Error updating plant:", err);
      alert("Failed to update the plant. Please try again.");
    }
  };

  const handleDeletePlant = async () => {
    if (confirm("Are you sure you want to delete this plant? This action cannot be undone.")) {
      try {
        await deletePlant(id!);
        alert("Plant deleted successfully.");
        router.push("/plants");
      } catch (err) {
        console.error("Error deleting plant:", err);
        alert("Failed to delete the plant. Please try again.");
      }
    }
  };

  const calculateTimeRemaining = (wateringEvents: { watered_at: string }[], interval: number) => {
    if (!wateringEvents || wateringEvents.length === 0) {
      return { text: "No watering recorded yet.", isNegative: false };
    }

    const sortedEvents = [...wateringEvents].sort((a, b) => new Date(b.watered_at).getTime() - new Date(a.watered_at).getTime());
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

  const handleWateringSuccess = async () => {
    try {
      console.log("Intentando registrar riego con:", { plant_id: id, user_id: userId });

      const response = await waterPlant(id!, userId!); // Registrar el riego en la base de datos
      if (response) {
        const updatedPlant = await getPlantWithWateringInfo(id!);
        setPlant(updatedPlant);
        alert("Riego registrado exitosamente.");
      } else {
        throw new Error("No se pudo registrar el riego.");
      }
    } catch (err) {
      console.error("Error al registrar el riego:", err);
      alert("No se pudo registrar el riego. Por favor, inténtalo de nuevo.");
    }
  };

  const refreshHistory = async () => {
    try {
      const events = await getWateringHistory(plant!.id);
      setPlant((prev) => ({ ...prev!, watering_events: events }));
    } catch (err) {
      console.error("Error al recargar el historial de riego:", err);
    }
  };

  if (!plant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/plants" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to plants
          </Link>
          <h1 className="text-2xl font-bold">{plant.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <div className="relative rounded-lg overflow-hidden aspect-square mb-4">
              <Image
                src={plant.image_url}
                alt={plant.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            <div className="flex gap-2 justify-center">
              <QRCodeDisplay plantId={plant.id} plantName={plant.name} />
            </div>
          </div>

          <div className="md:col-span-7">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Water every {plant.watering_interval} day{plant.watering_interval !== 1 ? 's' : ''}
                    </div>
                    {plant.needsWater ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Needs water
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Recently watered
                      </Badge>
                    )}
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="text-sm font-medium mb-3">Next Watering</h3>
                    <div
                      className={`text-sm font-semibold ${calculateTimeRemaining(plant.watering_events, plant.watering_interval).isNegative ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {calculateTimeRemaining(plant.watering_events, plant.watering_interval).text}
                    </div>
                  </div>

                  <WateringHistory plantId={plant.id} refreshHistory={refreshHistory} />

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      onClick={async () => {
                        try {
                          await handleWateringSuccess();
                        } catch (err) {
                          console.error("Error al registrar el riego:", err);
                        }
                      }}
                      className="w-full mt-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Watered
                    </Button>
                  </div>

                  <div className="pt-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Plant Name"
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={editedInterval}
                          onChange={(e) => setEditedInterval(Number(e.target.value))}
                          placeholder="Watering Interval (days)"
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button variant="default" onClick={handleSaveChanges} className="w-full">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={handleEditToggle} className="w-full">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="secondary" onClick={handleEditToggle} className="w-full">
                        Edit Plant
                      </Button>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button variant="destructive" onClick={handleDeletePlant} className="w-full">
                      Delete Plant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}