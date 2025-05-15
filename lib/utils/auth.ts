import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Corregí la importación para usar la exportación nombrada.

export async function getSession() {
  const cookieStore = await cookies(); // Asegurarse de que las cookies se manejen de manera asíncrona
  const supabaseClient = supabase;

  try {
    console.log("Cookies content:", cookieStore.getAll()); // Registrar el contenido de las cookies
    console.log("Attempting to fetch session...");

    const accessToken = cookieStore.get('sb-access-token'); // Intentar recuperar el token de sesión manualmente
    if (accessToken) {
      console.log("Access token found in cookies:", accessToken.value);
      console.warn("setAuth no es compatible. Asegúrate de manejar el token manualmente si es necesario.");
    } else {
      console.warn("No access token found in cookies.");
    }

    const { data: { session }, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error);
      return null;
    }

    if (!session) {
      console.warn("No session found.");
    }

    return session;
  } catch (err) {
    console.error("Unexpected error fetching session:", err);
    return null;
  }
}

export async function requireAuth(req: Request) {
  if (!req || typeof req.headers === "undefined") {
    console.error("Request object or headers are undefined", { req });
    throw new Error("Invalid request object");
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or invalid Authorization header");
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Token is missing in Authorization header");
    throw new Error("Unauthorized");
  }

  const { data: authUser, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authUser) {
    console.error("Error validating token:", authError);
    throw new Error("Unauthorized");
  }

  console.log("Authenticated user:", authUser);
  return authUser;
}