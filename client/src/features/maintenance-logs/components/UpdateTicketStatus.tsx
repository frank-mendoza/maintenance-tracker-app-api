import { toaster } from "@/components/ui/toaster";
import { PROPERTY_STATUS } from "@/constants/constants";
import { updateTicketStatus } from "@/lib/api/maintenance";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { MaintenanceLog } from "@/types/maintenance.types";
import {
  Text,
  Dialog,
  Portal,
  CloseButton,
  Button,
  Spinner,
} from "@chakra-ui/react";

type CustomDialogProps = {
  setUpdateTicket: any;
  updateTicket: { show: boolean; ticket: MaintenanceLog };
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

  const renderNextUpdateStatus = () => {
    let textProps = {
      color: "",
      text: "",
      value: "",
    };

    if (updateTicket.ticket.status === PROPERTY_STATUS.pending.value) {
      textProps = {
        color: PROPERTY_STATUS.in_progress.color,
        text: PROPERTY_STATUS.in_progress.label,
        value: PROPERTY_STATUS.in_progress.value,
      };
    }
    if (updateTicket.ticket.status === PROPERTY_STATUS.in_progress.value) {
      textProps = {
        color: PROPERTY_STATUS.completed.color,
        text: PROPERTY_STATUS.completed.label,
        value: PROPERTY_STATUS.completed.value,
      };
    }

    return textProps;
  };

  const onSubmit = async () => {
    setLoading(true);
    const res = await updateTicketStatus({
      id: updateTicket.ticket._id,
      status: renderNextUpdateStatus().value,
      userId: user?._id as string,
    });

    if (res.success) {
      toaster.create({
        description: res?.msg || "Successfully updated ticket status",
        type: "success",
      });
      setUpdateTicket({
        show: false,
        user: null,
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
        })
      }
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Update status</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              (
              <Text>
                Update ticket status to{" "}
                <Text as="span" color={renderNextUpdateStatus().color}>
                  {renderNextUpdateStatus().text}
                </Text>
              </Text>
              );
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  onClick={() =>
                    setUpdateTicket({
                      show: false,
                      ticket: null,
                    })
                  }
                  variant="outline"
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                minWidth={100}
                onClick={onSubmit}
                colorPalette={"red"}
                disabled={loading}
              >
                {loading ? <Spinner /> : renderNextUpdateStatus().text}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={() =>
                  setUpdateTicket({
                    show: false,
                    ticket: null,
                  })
                }
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default UpdateTicketStatus;
