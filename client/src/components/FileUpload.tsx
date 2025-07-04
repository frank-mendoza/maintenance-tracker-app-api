import {
  Box,
  FileUpload,
  Float,
  Icon,
  useFileUploadContext,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuUpload, LuX } from "react-icons/lu";

const FileUploadList = ({
  type,
  images,
  setImages,
  fileTrigger,
}: {
  type: any;
  images: File[];
  setImages: any;
  fileTrigger: boolean;
}) => {
  const fileUpload = useFileUploadContext();
  // // always keep fileUpload.acceptedFiles in sync with images
  useEffect(() => {
    if (type === "update" && !fileTrigger) {
      // dedupe by name to avoid duplicates
      const uniqueFiles = Array.from(
        new Map(images.map((f) => [f.name, f])).values()
      );
      fileUpload.setFiles(uniqueFiles);
    }
  }, [images]);

  useEffect(() => {
    if (fileTrigger) {
      const uniqueFiles: File[] = Array.from(
        new Map(
          [...images, ...fileUpload.acceptedFiles].map((file) => [
            file.name,
            file,
          ])
        ).values()
      );
      setImages(uniqueFiles);
    }
  }, [fileTrigger, fileUpload.acceptedFiles]);

  if (fileUpload.acceptedFiles.length === 0) return null;
  return (
    <FileUpload.ItemGroup flexDirection={"row"}>
      {fileUpload.acceptedFiles.map((file, idx) => (
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
  type,
}: {
  setImages: (files: File[]) => void;
  images: File[];
  type?: "create" | "update";
}) => {
  const [fileTrigger, setFileTrigger] = useState(false);
  return (
    <FileUpload.Root
      width={"100%"}
      accept={["image/png", "image/jpeg", "image/jpg"]}
      alignItems="stretch"
      maxFiles={10}
      onFileChange={() => setFileTrigger(true)}
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
      <FileUploadList
        setImages={setImages}
        fileTrigger={fileTrigger}
        type={type}
        images={images}
      />
    </FileUpload.Root>
  );
};
export default UploadFile;
