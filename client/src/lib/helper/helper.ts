import { PROPERTY_STATUS } from "@/constants/constants";
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

const { discarded, pending, in_progress, completed } = PROPERTY_STATUS;
export const renderNextUpdateStatus = (updateTicket: {
  show: boolean;
  isDiscarded?: boolean;
  ticket?: MaintenanceLog | null;
}) => {
  let textProps = {
    color: "",
    text: "",
    value: "",
    btnLabel: "",
  };

  if (updateTicket?.isDiscarded) {
    return {
      color: discarded.color,
      text: discarded.label,
      value: discarded.value,
      btnLabel: discarded.buttonLabel,
    };
  }
  if (updateTicket?.ticket?.status === pending.value) {
    textProps = {
      color: in_progress.color,
      text: in_progress.label,
      value: in_progress.value,
      btnLabel: in_progress.buttonLabel,
    };
  }
  if (updateTicket?.ticket?.status === in_progress.value) {
    textProps = {
      color: completed.color,
      text: completed.buttonLabel,
      value: completed.value,
      btnLabel: completed.buttonLabel,
    };
  }

  return textProps;
};
