import { NextResponse } from "next/server";
import { createPlant } from "@/lib/plant-service";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, image_url, watering_interval, user_id } = body;

    if (!name || !image_url || !watering_interval || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("User ID from request:", user_id);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Authorization header is missing");
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header is missing or invalid:", authHeader);
      return NextResponse.json({ error: "Invalid Authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "undefined") {
      console.error("Token is missing or undefined in Authorization header");
      return NextResponse.json({ error: "Token is missing or undefined" }, { status: 401 });
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser) {
      console.error("Error validating token:", authError);
      return NextResponse.json({ error: "User is not authenticated", details: authError?.message }, { status: 401 });
    }

    console.log("Authenticated user object:", authUser);
    const authenticatedUserId = authUser?.user?.id || authUser?.id;
    console.log("Authenticated user ID:", authenticatedUserId);

    if (authenticatedUserId !== user_id) {
      console.error("User ID mismatch:", { authUser: authenticatedUserId, user_id });
      return NextResponse.json({ error: "User ID does not match authenticated user" }, { status: 403 });
    }

    // Decodificar el token para inspeccionar su contenido
    try {
      const decodedToken = jwt.decode(token);
      console.log("Decoded token:", decodedToken);
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
    }

    const plant = await createPlant({ name, image_url, watering_interval, user_id });
    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    console.error("Error creating plant:", error);
    return NextResponse.json({ error: "Failed to create plant" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();
    const { id, name, watering_interval } = body;

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