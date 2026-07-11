import { supabase } from "./supabase";

export async function uploadPhoto(
  projectId: string,
  file: File
) {
  const extension =
    file.name.split(".").pop() ?? "jpg";

  const storagePath =
    `${projectId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(storagePath, file);

  if (error) throw error;

  return storagePath;
}

export async function deleteStoragePhoto(
  storagePath: string
) {
  const { error } = await supabase.storage
    .from("photos")
    .remove([storagePath]);

  if (error) throw error;
}

export async function getPhotoSignedUrl(
  storagePath: string
) {
  const { data } = await supabase.storage
    .from("photos")
    .createSignedUrl(
      storagePath,
      3600
    );

  return data?.signedUrl;
}