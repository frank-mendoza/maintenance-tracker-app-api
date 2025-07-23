import { Box, FileUpload, Float, Icon } from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";

const FileUploadList = ({ images }: { images: File[] }) => {
  if (images.length === 0) return null;
  return (
    <FileUpload.ItemGroup flexDirection={"row"}>
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
            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
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
}: {
  setImages: (files: File[]) => void;
  images: File[];
  type?: "create" | "update";
}) => {
  return (
    <FileUpload.Root
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
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color="fg.muted">.png, .jpg up to 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUploadList images={images} />
    </FileUpload.Root>
  );
};
export default UploadFile;
