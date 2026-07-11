import { supabase } from "./supabase";

export async function deleteProject(
  projectId: string
) {

  //----------------------------------
  // Leer proyecto
  //----------------------------------

  const {
    data: project,
    error,
  } = await supabase

    .from("projects")

    .select("inventory_excel_path")

    .eq("id", projectId)

    .single();

  if (error)
    throw error;

  //----------------------------------
  // Leer fotos
  //----------------------------------

  const {
    data: photos,
    error: photosError,
  } = await supabase

    .from("photos")

    .select("storage_path")

    .eq("project_id", projectId);

  if (photosError)
    throw photosError;

  //----------------------------------
  // Eliminar fotos del Storage
  //----------------------------------

  if ((photos ?? []).length) {

    await supabase.storage

      .from("photos")

      .remove(

        photos!.map(

          p => p.storage_path

        )

      );

  }

  //----------------------------------
  // Eliminar Excel
  //----------------------------------

  if (
    project.inventory_excel_path
  ) {

    await supabase.storage

      .from("inventory")

      .remove([
        project.inventory_excel_path,
      ]);

  }

  //----------------------------------
  // Eliminar tablas
  //----------------------------------

  await supabase

    .from("photos")

    .delete()

    .eq("project_id", projectId);

  await supabase

    .from("device_status")

    .delete()

    .eq("project_id", projectId);

  await supabase

    .from("project_devices")

    .delete()

    .eq("project_id", projectId);

  await supabase

    .from("project_users")

    .delete()

    .eq("project_id", projectId);

  const result =
    await supabase

      .from("projects")

      .delete()

      .eq("id", projectId);

  if (result.error)
    throw result.error;

}