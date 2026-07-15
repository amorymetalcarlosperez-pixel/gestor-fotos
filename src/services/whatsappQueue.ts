import { supabase } from "./supabase";

export async function enqueueWhatsapp(
  projectDeviceId: string
) {

  const { error } =
    await supabase

      .from("whatsapp_queue")

      .insert({

        project_device_id:
          projectDeviceId,

      });

  if (error)
    throw error;

}