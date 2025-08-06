import { toaster } from "@/components/ui/toaster";
import { Dialog, Portal, CloseButton, Button, Spinner } from "@chakra-ui/react";
import { useState } from "react";

type CustomDialogProps = {
  setIsRemove: any;
  isRemove: { show: boolean; data: any };
  loading: boolean;
  setLoading: any;
  endpoint: (id: string) => Promise<any>;
  children: any;
};

const RemoveModal = ({
  isRemove,
  setIsRemove,
  loading,
  setLoading,
  endpoint,
  children,
}: CustomDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async () => {
    setIsLoading(true);
    const res = await endpoint(isRemove?.data?._id as string);

    if (res.success) {
      setLoading(true);
      toaster.create({
        description: res?.msg || "Successfully removed",
        type: "success",
      });
      setIsRemove({
        show: false,
        user: null,
      });
      setLoading(false);
    } else {
      toaster.create({
        description: res?.msg || `Failed to remove`,
        type: "error",
      });
    }
    setIsLoading(false);
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
            {children}
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
                disabled={loading || isLoading}
              >
                {loading || isLoading ? <Spinner /> : "Remove"}
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
export default RemoveModal;
