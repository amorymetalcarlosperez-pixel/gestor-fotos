import { supabase } from "./supabase";

export async function uploadInventoryFile(
  projectId: string,
  file: File
) {

  const extension =
    file.name.split(".").pop() ?? "xlsx";

  const path =
    `${projectId}/Inventario.${extension}`;

  const { error } =
    await supabase.storage

      .from("inventory")

      .upload(
        path,
        file,
        {
          upsert: true,
        }
      );

  if (error)
    throw error;

  return path;

}

export async function getInventoryDownloadUrl(
  path: string
) {

  const { data } =
    await supabase.storage

      .from("inventory")

      .createSignedUrl(
        path,
        60
      );

  return data?.signedUrl ?? null;

}

export async function downloadInventoryFile(
  path: string
) {

  const { data, error } =
    await supabase.storage

      .from("inventory")

      .download(path);

  if (error)
    throw error;

  return data;

}