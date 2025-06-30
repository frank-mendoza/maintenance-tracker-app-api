import { Button, CloseButton, Dialog, Portal, Spinner } from "@chakra-ui/react";

type CustomDialogProps = {
  onOpenChange: (e: any) => void;
  open: boolean;
  loading: boolean;
  content: React.ReactNode;
  title: React.ReactNode;
  onSubmit: () => void;
  onClose: () => void;
};

const DialogPopup = ({
  onOpenChange,
  open,
  content,
  title,
  onSubmit,
  onClose,
  loading,
}: CustomDialogProps) => {
  return (
    <Dialog.Root
      closeOnInteractOutside={false}
      size={"lg"}
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
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button minWidth={100} type="submit" disabled={loading}>
                    {loading ? <Spinner /> : "Save"}
                  </Button>
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
