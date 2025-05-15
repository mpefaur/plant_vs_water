import { supabase } from "@/lib/supabase";

export type PlantWithWateringInfo = Awaited<ReturnType<typeof getPlantWithWateringInfo>>;

export async function createPlant({ name, image_url, watering_interval, user_id }: { name: string; image_url: string; watering_interval: number; user_id: string }) {
  console.log("Inserting plant with data:", { name, image_url, watering_interval, user_id });

  const { data, error } = await supabase
    .from("plants")
    .insert({
      name,
      image_url,
      watering_interval,
      user_id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating plant:", error);
    throw error;
  }

  return data;
}

export async function getPlants(user_id: string) {
  const { data, error } = await supabase
    .from("plants")
    .select("*, watering_events(*)")
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching plants with watering events:", error);
    throw error;
  }

  return data;
}

// Agregar más detalles del error en los logs de depuración para identificar el problema exacto.
export async function waterPlant(plant_id: string, user_id: string) {
  console.log("Registrando riego para la planta:", { plant_id, user_id });

  const { data, error } = await supabase
    .from("watering_events")
    .insert({
      plant_id,
      user_id,
      watered_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error al registrar el evento de riego:", error.message, error.details, error.hint);
    throw error;
  }

  console.log("Evento de riego registrado exitosamente:", data);
  return data;
}

export async function getWateringHistory(plant_id: string) {
  const { data, error } = await supabase
    .from("watering_events")
    .select("*")
    .eq("plant_id", plant_id)
    .order("watered_at", { ascending: false });

  if (error) {
    console.error("Error fetching watering history:", error);
    throw error;
  }

  return data;
}

export async function getPlantWithWateringInfo(plant_id: string) {
  const { data, error } = await supabase
    .from("plants")
    .select("*, watering_events(*)")
    .eq("id", plant_id)
    .single();

  if (error) {
    console.error("Error fetching plant with watering info:", error);
    console.error("Error details:", { plant_id, error });
    throw error;
  }

  return data;
}

export async function deletePlant(plant_id: string) {
  const { error } = await supabase
    .from("plants")
    .delete()
    .eq("id", plant_id);

  if (error) {
    console.error("Error deleting plant:", error);
    throw error;
  }
}