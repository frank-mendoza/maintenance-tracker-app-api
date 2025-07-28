import { apiRequest } from "./apiRequest";

export const fetchTicketLogs = (queryObject: any) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryObject)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => [key, String(value)])
  );

  const searchParams = new URLSearchParams(filteredParams);

  return apiRequest("get", `/maintenance/logs?${searchParams.toString()}`);
};

export const maintenanceMutation = (body: {
  propertyId: string;
  title: string;
  description: string;
  assignedTo: string;
  reportedBy: string;
  isUpdate?: boolean; // Optional for create, required for update
  id?: string; // Optional for create, required for update
}) => {
  const formData = {
    propertyId: body.propertyId,
    title: body.title,
    description: body.description,
    assignedTo: body.assignedTo,
    reportedBy: body.reportedBy,
  };
  return apiRequest(
    body.isUpdate ? "patch" : "post",
    `/maintenance/${body.isUpdate ? body.id : "create"}`,
    formData
  );
};

export const updateTicketStatus = (body: {
  id: string;
  status: string;
  userId: string;
}) => {
  return apiRequest("patch", `/maintenance/${body.id}/update-status`, {
    status: body.status,
    userId: body.userId,
  });
};
