import { toaster } from "@/components/ui/toaster";
import { removeUser } from "@/lib/api/user";
import {
  Text,
  Dialog,
  Portal,
  CloseButton,
  Button,
  Spinner,
} from "@chakra-ui/react";

type CustomDialogProps = {
  setIsRemove: any;
  isRemove: { show: boolean; user: any };
  loading: boolean;
  setLoading: any;
};

const RemovePopup = ({
  isRemove,
  setIsRemove,
  loading,
  setLoading,
}: CustomDialogProps) => {
  const onSubmit = async () => {
    setLoading(true);
    const res = await removeUser(isRemove?.user?._id as string);

    if (res.success) {
      toaster.create({
        description: res?.msg || "Successfully removed user",
        type: "success",
      });
      setIsRemove({
        show: false,
        user: null,
      });
    } else {
      toaster.create({
        description: res?.msg || `Failed to remove user`,
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
      open={isRemove.show}
      onOpenChange={(e) =>
        setIsRemove({
          ...isRemove,
          show: e.open,
        })
      }
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Remove User</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Are you sure you want to remove{" "}
                <strong>
                  {" "}
                  {isRemove?.user?.name} {isRemove?.user?.lastName}
                </strong>
                ?
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  onClick={() =>
                    setIsRemove({
                      show: false,
                      user: null,
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
                {loading ? <Spinner /> : "Remove"}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={() =>
                  setIsRemove({
                    show: false,
                    user: null,
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
export default RemovePopup;
