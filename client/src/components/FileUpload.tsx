import {
  Box,
  FileUpload,
  Float,
  Icon,
  useFileUploadContext,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LuUpload, LuX } from "react-icons/lu";

const UploadFile = ({ setImages }: { setImages: (files: File[]) => void }) => {
  const FileUploadList = () => {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;

    useEffect(() => {
      setImages(files);
    }, [files]);

    if (files.length === 0) return null;
    return (
      <FileUpload.ItemGroup flexDirection={"row"}>
        {files.map((file) => (
          <FileUpload.Item
            w="auto"
            height={"auto"}
            boxSize="20"
            p="2"
            file={file}
            key={file.name}
          >
            <FileUpload.ItemPreviewImage height={"100%"} />
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
  return (
    <FileUpload.Root
      accept={["image/png"]}
      width={"100%"}
      alignItems="stretch"
      maxFiles={10}
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
      <FileUploadList />
    </FileUpload.Root>
  );
};
export default UploadFile;
