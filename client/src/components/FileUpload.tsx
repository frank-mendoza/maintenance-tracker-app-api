import { Box, Button, FileUpload, Float, Icon } from "@chakra-ui/react";
import { LuFileImage, LuUpload, LuX } from "react-icons/lu";

const FileUploadList = ({
  images,
  setImages,
}: {
  images: File[];
  setImages: any;
}) => {
  if (images.length === 0) return null;
  return (
    <FileUpload.ItemGroup flexDirection={"row"} flexWrap="wrap">
      {images.map((file, idx) => (
        <FileUpload.Item
          w="auto"
          height={"auto"}
          boxSize="20"
          p={0}
          file={file}
          key={idx}
        >
          <FileUpload.ItemPreviewImage height={"100%"} objectFit={"cover"} />
          <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger
              onClick={() => {
                const filtered = images.filter((img) => img.name !== file.name);
                setImages(filtered);
              }}
              boxSize="4"
              layerStyle="fill.solid"
            >
              <LuX />
            </FileUpload.ItemDeleteTrigger>
          </Float>
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  );
};

const UploadFile = ({
  setImages,
  images,
  dropzone,
  size,
  disabled,
}: {
  setImages: (files: File[]) => void;
  images: File[];
  type?: "create" | "update";
  dropzone?: boolean;
  size?: number;
  disabled?: boolean;
}) => {
  return (
    <FileUpload.Root
      cursor={"pointer"}
      disabled={disabled || false}
      width={"100%"}
      accept={["image/png", "image/jpeg", "image/jpg"]}
      alignItems="stretch"
      maxFiles={10}
      onFileChange={(e) => {
        const uniqueFiles: any[] = Array.from(
          new Map(
            [...images, ...e.acceptedFiles].map((file: any) => [
              file?.name,
              file,
            ])
          ).values()
        );
        setImages(uniqueFiles);
      }}
    >
      <FileUpload.HiddenInput />
      {dropzone ? (
        <FileUpload.Dropzone minH={size || "16rem"}>
          <Icon size="md" color="fg.muted">
            <LuUpload />
          </Icon>
          <FileUpload.DropzoneContent>
            <Box>Drag and drop files here</Box>
            <Box color="fg.muted">.png, .jpg up to 5MB</Box>
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
      ) : (
        <FileUpload.Trigger asChild>
          <Button variant="outline" size="sm">
            <LuFileImage /> Upload Images
          </Button>
        </FileUpload.Trigger>
      )}
      <FileUploadList setImages={setImages} images={images} />
    </FileUpload.Root>
  );
};
export default UploadFile;
