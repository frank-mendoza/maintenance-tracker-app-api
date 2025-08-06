import HoverImage from "@/components/Hover";
import { toaster } from "@/components/ui/toaster";
import { PROPERTY_STATUS } from "@/lib/constants/constants";
import PropertyStatusBadge from "@/features/property/components/PropertyStatusbadge";
import { updateTicketStatus } from "@/lib/api/maintenance";
import {
  getAllowedNextStatuses,
  TICKET_STATUS_PROPS,
} from "@/lib/helper/validationStatusChange";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { MaintenanceLog } from "@/types/maintenance.types";
import {
  Text,
  Dialog,
  Portal,
  CloseButton,
  Button,
  Spinner,
  Box,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import TicketStatus from "./TicketStatus";

type CustomDialogProps = {
  setUpdateTicket: any;
  updateTicket: {
    show: boolean;
    ticket: MaintenanceLog | null;
    isDiscarded?: boolean;
  };
  loading: boolean;
  setLoading: any;
};

const UpdateTicketStatus = ({
  updateTicket,
  setUpdateTicket,
  loading,
  setLoading,
}: CustomDialogProps) => {
  const { user } = useGlobalStore();
  const { discarded, completed } = PROPERTY_STATUS;

  const ticket = updateTicket?.ticket;
  const isCompleted = ticket?.status === completed.value;
  const isDiscarded = ticket?.status === discarded.value;

  const [comments, setComments] = useState(
    ticket?.status === discarded.value ? ticket?.comments : ""
  );
  const allowedNext = getAllowedNextStatuses(
    updateTicket?.isDiscarded ? discarded.value : (ticket?.status as string),
    user?.role as any
  );

  console.log(allowedNext);

  const nxtStatus = () => {
    if (updateTicket.isDiscarded) return discarded.value;
    if (ticket?.nextStatus === completed.value) return ticket?.nextStatus;

    return ticket?.status;
  };
  const nxtStatusProps =
    TICKET_STATUS_PROPS[
      nxtStatus()?.toUpperCase() as keyof typeof TICKET_STATUS_PROPS
    ];

  const { color, buttonLabel } = nxtStatusProps || {
    label: "",
    color: "",
    buttonLabel: "",
  };

  const renderComments = () => {
    if (updateTicket?.isDiscarded || isDiscarded) {
      return (
        <Box mb={4}>
          <Text mb={2}>Comments: </Text>
          {isDiscarded ? (
            <Text fontWeight={600}>
              {ticket?.comments || "No comments provided"}
            </Text>
          ) : (
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter comments"
            />
          )}
        </Box>
      );
    }

    return null;
  };

  const onSubmit = async () => {
    setLoading(true);
    const res = await updateTicketStatus({
      id: updateTicket?.ticket?._id as string,
      status: allowedNext[0],
      userId: user?._id as string,
      comments: updateTicket?.isDiscarded ? comments : "",
    });

    if (res.success) {
      toaster.create({
        description: res?.msg || "Successfully updated ticket status",
        type: "success",
      });
      setUpdateTicket({
        show: false,
        ticket: null,
        isDiscarded: false,
      });
    } else {
      toaster.create({
        description: res?.msg || `Failed to update ticket status`,
        type: "error",
      });
    }
    setLoading(false);
  };

  const renderTitle = () => {
    let title = "";
    if (updateTicket?.isDiscarded) return `Discard Ticket`;
    if (isDiscarded || isCompleted)
      title = updateTicket?.ticket?.title as string;
    else title = `Update Ticket Status`;
    return title;
  };

  return (
    <Dialog.Root
      closeOnInteractOutside={false}
      size={{ base: "md", xl: "md", sm: "xs" }}
      lazyMount
      open={updateTicket?.show}
      onOpenChange={(e) =>
        setUpdateTicket({
          ...updateTicket,
          show: e.open,
          isDiscarded: false,
        })
      }
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header alignItems={"center"}>
              <Dialog.Title>{renderTitle()}</Dialog.Title>
              {(isCompleted || isDiscarded) && !updateTicket?.isDiscarded && (
                <PropertyStatusBadge item={ticket as any} />
              )}
            </Dialog.Header>
            <Dialog.Body>
              {!isCompleted && !isDiscarded && !updateTicket?.isDiscarded && (
                <TicketStatus ticket={ticket as any} />
              )}
              <div>
                <Box mb={4}>
                  <Text>Ticket ID: </Text>
                  <Text fontWeight={600}>{ticket?._id}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Ticket Name: </Text>
                  <Text fontWeight={600}>{ticket?.title}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Description: </Text>
                  <Text fontWeight={600}>{ticket?.description}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Property name: </Text>
                  <Text fontWeight={600}>{ticket?.property.name || "-"}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Reported by: </Text>
                  <Text fontWeight={600}>
                    {ticket?.reportedBy.email || "-"}
                  </Text>
                </Box>
                <Box mb={4}>
                  <Text>Assigned Technician: </Text>
                  <Text fontWeight={600}>
                    {ticket?.assignedTo.email || "-"}
                  </Text>
                </Box>
                {isCompleted && !updateTicket?.isDiscarded && (
                  <Box mb={4}>
                    <Text>Completed by: </Text>
                    <Text fontWeight={600}>
                      {ticket?.completedBy?.email || "-"}
                    </Text>
                  </Box>
                )}
                <Box mb={4}>
                  <Text>Date created: </Text>
                  <Text fontWeight={600}>
                    {moment(ticket?.createdAt).format("MMM D YYYY,  h:mm:ss a")}
                  </Text>
                </Box>
                {renderComments()}
                {ticket?.images &&
                  Array.isArray(ticket?.images) &&
                  ticket.images.length > 0 && (
                    <Box mb={4}>
                      <Text mb={2}>Proof / Actual Photo(s) </Text>
                      <Flex gap={4}>
                        {ticket?.images?.map((img) => (
                          <HoverImage key={img.path} link={img.path} />
                        ))}
                      </Flex>
                    </Box>
                  )}
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  onClick={() => {
                    setComments("");
                    setUpdateTicket({
                      show: false,
                      ticket: null,
                      isDiscarded: false,
                    });
                  }}
                  variant="outline"
                >
                  {allowedNext.length < 1 ? "Close" : "Cancel"}
                </Button>
              </Dialog.ActionTrigger>
              {allowedNext.length > 0 && (
                <Button
                  minWidth={100}
                  onClick={onSubmit}
                  colorPalette={color}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : buttonLabel}
                </Button>
              )}
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={() => {
                  setComments("");
                  setUpdateTicket({
                    show: false,
                    ticket: null,
                    isDiscarded: false,
                  });
                }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default UpdateTicketStatus;
