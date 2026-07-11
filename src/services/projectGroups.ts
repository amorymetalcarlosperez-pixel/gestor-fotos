import { supabase } from "./supabase";

export async function getLocationsByGroup(
  projectId: string,
  group: string
) {

  const { data, error } =
    await supabase

      .from("project_devices")

      .select("ubicacion_zip")

      .eq("project_id", projectId)

      .eq("device_group", group);

  if (error)
    throw error;

  const values = Array.from(

    new Set(

      (data ?? []).map(

        d => d.ubicacion_zip

      )

    )

  );

  values.sort((a, b) =>

    a.localeCompare(

      b,

      undefined,

      {

        numeric: true,

        sensitivity: "base",

      }

    )

  );

  return values;

}