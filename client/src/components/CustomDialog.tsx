import {
  Button,
  CloseButton,
  ConditionalValue,
  Dialog,
  Portal,
  Spinner,
} from "@chakra-ui/react";

type CustomDialogProps = {
  onOpenChange: (e: any) => void;
  open: boolean;
  loading: boolean;
  content: React.ReactNode;
  title: React.ReactNode;
  onSubmit: () => void;
  onClose: () => void;
  hideSaveBtn?: boolean;
  size?: ConditionalValue<
    "sm" | "md" | "lg" | "xl" | "xs" | "cover" | "full" | undefined
  >;
};

const DialogPopup = ({
  onOpenChange,
  open,
  content,
  title,
  onSubmit,
  onClose,
  loading,
  size,
  hideSaveBtn,
}: CustomDialogProps) => {
  return (
    <Dialog.Root
      closeOnInteractOutside={false}
      size={{ base: "xs", xl: size || "lg" }}
      lazyMount
      open={open}
      onOpenChange={onOpenChange}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={onSubmit}>
                {content}

                <Dialog.Footer p={0} mt={5}>
                  <Dialog.ActionTrigger asChild>
                    <Button onClick={onClose} variant="outline">
                      {hideSaveBtn ? "Close" : "Cancel"}
                    </Button>
                  </Dialog.ActionTrigger>
                  {!hideSaveBtn && (
                    <Button
                      minWidth={100}
                      colorPalette={"green"}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : "Save"}
                    </Button>
                  )}
                </Dialog.Footer>
              </form>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default DialogPopup;
