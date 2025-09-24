// maintenanceSocket.ts

import { Server } from "socket.io";
import { IMaintenanceLog } from "../../models/MaintenanceLog";

export const emitNewMaintenance = (
  io: Server,
  maintenance: IMaintenanceLog
) => {
  io.to("maintenance").emit("maintenance:new", maintenance);
};

export const emitUpdatedMaintenance = (
  io: Server,
  maintenance: IMaintenanceLog
) => {
  io.to("maintenance").emit("maintenance:update", maintenance);
};
