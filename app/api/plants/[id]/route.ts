import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, watering_interval } = body;

    if (!id || !name || !watering_interval) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: updatedPlant, error } = await supabase
      .from("plants")
      .update({ name, watering_interval })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating plant:", error);
      return NextResponse.json({ error: "Failed to update plant" }, { status: 500 });
    }

    return NextResponse.json(updatedPlant, { status: 200 });
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
};