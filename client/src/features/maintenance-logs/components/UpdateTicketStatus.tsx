import { toaster } from "@/components/ui/toaster";
import { PROPERTY_STATUS } from "@/constants/constants";
import PropertyStatusBadge from "@/features/property/components/PropertyStatusbadge";
import { updateTicketStatus } from "@/lib/api/maintenance";
import { renderNextUpdateStatus } from "@/lib/helper/helper";
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
  Badge,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

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
  const [comments, setComments] = useState(
    updateTicket.ticket?.status === discarded.value
      ? updateTicket.ticket?.comments
      : ""
  );

  const isCompleted = updateTicket?.ticket?.status === completed.value;
  const isDiscarded = updateTicket?.ticket?.status === discarded.value;

  const renderComments = () => {
    if (updateTicket.isDiscarded || isDiscarded) {
      return (
        <Box mb={4}>
          <Text mb={2}>Comments: </Text>
          {isDiscarded ? (
            <Text fontWeight={600}>
              {updateTicket.ticket?.comments || "No comments provided"}
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
      status: renderNextUpdateStatus(updateTicket).value,
      userId: user?._id as string,
      comments: updateTicket.isDiscarded ? comments : "",
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

  return (
    <Dialog.Root
      closeOnInteractOutside={false}
      size={"sm"}
      lazyMount
      open={updateTicket.show}
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
            <Dialog.Header>
              <Dialog.Title>
                {updateTicket?.isDiscarded
                  ? `Discard Ticket`
                  : "Update Ticket Status"}
                {(isCompleted || isDiscarded) && !updateTicket.isDiscarded && (
                  <PropertyStatusBadge item={updateTicket?.ticket as any} />
                )}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {!isCompleted && !isDiscarded && !updateTicket.isDiscarded && (
                <Flex
                  my={4}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={10}
                >
                  <Box mb={4}>
                    <Text mb={2}>Current Status </Text>
                    <PropertyStatusBadge item={updateTicket?.ticket as any} />
                  </Box>
                  <FaArrowRight />
                  <Box mb={4}>
                    <Text mb={2}>Next Status </Text>
                    <Badge
                      minW={"80px"}
                      justifyContent={"center"}
                      colorPalette={renderNextUpdateStatus(updateTicket).color}
                    >
                      {renderNextUpdateStatus(updateTicket).text}
                    </Badge>
                  </Box>
                </Flex>
              )}
              <div>
                <Box mb={4}>
                  <Text>Ticket ID: </Text>
                  <Text fontWeight={600}>{updateTicket?.ticket?._id}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Ticket Name: </Text>
                  <Text fontWeight={600}>{updateTicket?.ticket?.title}</Text>
                </Box>
                <Box mb={4}>
                  <Text>Description: </Text>
                  <Text fontWeight={600}>
                    {updateTicket?.ticket?.description}
                  </Text>
                </Box>
                <Box mb={4}>
                  <Text>Property name: </Text>
                  <Text fontWeight={600}>
                    {updateTicket?.ticket?.property.name}
                  </Text>
                </Box>
                <Box mb={4}>
                  <Text>Reported by: </Text>
                  <Text fontWeight={600}>
                    {updateTicket?.ticket?.reportedBy.email}
                  </Text>
                </Box>
                {isCompleted && !updateTicket.isDiscarded && (
                  <Box mb={4}>
                    <Text>Completed by: </Text>
                    <Text fontWeight={600}>
                      {updateTicket?.ticket?.completedBy?.email}
                    </Text>
                  </Box>
                )}
                {renderComments()}
              </div>
            </Dialog.Body>
            {((!isCompleted && !isDiscarded) || updateTicket.isDiscarded) && (
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
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  minWidth={100}
                  onClick={onSubmit}
                  colorPalette={renderNextUpdateStatus(updateTicket).color}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    renderNextUpdateStatus(updateTicket).btnLabel
                  )}
                </Button>
              </Dialog.Footer>
            )}
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
