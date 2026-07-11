import { findDeviceByAssetTag } from "./projectDevices";

export type ScanResult =
  | {
      found: true;
      device: any;
    }
  | {
      found: false;
      assetTag: string;
    };

export async function scanProject(
  projectId: string,
  assetTag: string
): Promise<ScanResult> {

  const codigo = assetTag.trim();

  if (!codigo) {

    return {
      found: false,
      assetTag: "",
    };

  }

  const {
    data,
    error,
  } = await findDeviceByAssetTag(
    projectId,
    codigo
  );

  if (error) {

    throw error;

  }

  if (!data) {

    return {

      found: false,

      assetTag: codigo,

    };

  }

  return {

    found: true,

    device: data,

  };

}