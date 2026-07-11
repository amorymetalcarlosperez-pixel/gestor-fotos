import { supabase } from "./supabase";

import { parseInventory } from "./importer/parser";
import { saveProjectDevices } from "./projectDevices";

import { uploadInventoryFile } from "./inventoryFile";

export interface CreateProjectData {
  nombre: string;
  descripcion?: string;
  inventarioExcel: File;
}

export async function getProjects() {

  return await supabase

    .from("projects")

    .select("*")

    .order("created_at", {
      ascending: false,
    });

}

export async function createProject(
  data: CreateProjectData
) {

  //-----------------------------------
  // Usuario
  //-----------------------------------

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    throw new Error(
      "Usuario no autenticado"
    );

  }

  //-----------------------------------
  // Crear proyecto
  //-----------------------------------

  const {
    data: project,
    error,
  } =
    await supabase

      .from("projects")

      .insert({

        nombre:
          data.nombre,

        descripcion:
          data.descripcion ?? "",

        created_by:
          user.id,

        estado:
          "En preparación",

      })

      .select()

      .single();

  if (error || !project) {

    throw error;

  }

  //-----------------------------------
  // Subir Excel original
  //-----------------------------------

  const inventoryPath =
    await uploadInventoryFile(

      project.id,

      data.inventarioExcel

    );

  //-----------------------------------
  // Guardar ruta del Excel
  //-----------------------------------

  const {
    error: updateError,
  } =
    await supabase

      .from("projects")

      .update({

        inventory_excel_path:
          inventoryPath,

      })

      .eq(
        "id",
        project.id
      );

  if (updateError) {

    throw updateError;

  }

  //-----------------------------------
  // Añadir usuario al proyecto
  //-----------------------------------

  const {
    error: userError,
  } =
    await supabase

      .from("project_users")

      .insert({

        project_id:
          project.id,

        user_id:
          user.id,

      });

  if (userError) {

    throw userError;

  }

  //-----------------------------------
  // Leer Excel
  //-----------------------------------

  const devices =
    await parseInventory(

      data.inventarioExcel

    );

  //-----------------------------------
  // Guardar dispositivos
  //-----------------------------------

  await saveProjectDevices(

    project.id,

    devices

  );

  return project;

}
export async function getProject(
  projectId: string
) {

  return await supabase

    .from("projects")

    .select("*")

    .eq("id", projectId)

    .single();

}
