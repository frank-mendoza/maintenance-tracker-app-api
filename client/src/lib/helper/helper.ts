import { MaintenanceLog } from "@/types/maintenance.types";

interface UrlToFileParams {
  url: string;
  filename: string;
  mimeType: string;
}

function extractFileInfoFromUrl(url: any) {
  if (!url) return { fileName: null, extension: null };

  // get file name (last part after '/')
  const parts = url.split("/");
  const fileName = parts[parts.length - 1];

  // get extension without dot
  const extMatch = fileName.match(/\.([^.]+)$/);
  const extension = extMatch ? extMatch[1] : null;

  return { fileName, extension };
}

export const urlToFile = async (url: UrlToFileParams["url"]): Promise<File> => {
  const res: Response = await fetch(url);
  const { fileName, extension } = extractFileInfoFromUrl(res.url);
  const mimeType = extension ? `image/${extension}` : "";
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: mimeType });
};

export function getValueByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? null;
}

export const loadImageFiles = async (
  images: MaintenanceLog["images"],
  prevImages: File[]
) => {
  const files = await Promise.all(
    (images ?? []).map(async (img) => urlToFile(img.path))
  );
  const combined = [...prevImages, ...files];

  // Remove duplicates by file name
  const uniqueFiles = Array.from(
    new Map(combined.map((file) => [file.name, file])).values()
  );

  return uniqueFiles;
};
