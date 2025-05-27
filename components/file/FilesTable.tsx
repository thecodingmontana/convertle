import {
  DownloadIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadCloudIcon,
  VideoIcon,
} from "lucide-react";

import { FileWithPreview, formatBytes } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FilesTableProps {
  files: FileWithPreview[];
  clearFiles: () => void;
  openFileDialog: () => void;
  removeFile: (id: string) => void;
}

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />;
  } else if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />;
  } else if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />;
  } else if (fileType.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />;
  } else if (fileType.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />;
  } else if (fileType.startsWith("image/")) {
    return <ImageIcon className="size-4 opacity-60" />;
  }
  return <FileIcon className="size-4 opacity-60" />;
};

export default function FilesTable({
  files,
  openFileDialog,
  clearFiles,
  removeFile,
}: FilesTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium">Files ({files.length})</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openFileDialog}>
            <UploadCloudIcon
              className="-ms-0.5 size-3.5 opacity-60"
              aria-hidden="true"
            />
            Add files
          </Button>
          <Button variant="outline" size="sm" onClick={clearFiles}>
            <Trash2Icon
              className="-ms-0.5 size-3.5 opacity-60"
              aria-hidden="true"
            />
            Remove all
          </Button>
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="text-xs">
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Name</TableHead>
              <TableHead className="h-9 py-2">Type</TableHead>
              <TableHead className="h-9 py-2">Size</TableHead>
              <TableHead className="h-9 w-0 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[13px]">
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="max-w-48 py-2 font-medium">
                  <span className="flex items-center gap-2">
                    <span className="shrink-0">{getFileIcon(file)}</span>{" "}
                    <span className="truncate">{file.file.name}</span>
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground py-2">
                  {file.file.type.split("/")[1]?.toUpperCase() || "UNKNOWN"}
                </TableCell>
                <TableCell className="text-muted-foreground py-2">
                  {formatBytes(file.file.size)}
                </TableCell>
                <TableCell className="py-2 text-right whitespace-nowrap">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                    aria-label={`Download ${file.file.name}`}
                    onClick={() => window.open(file.preview, "_blank")}
                  >
                    <DownloadIcon className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                    aria-label={`Remove ${file.file.name}`}
                    onClick={() => removeFile(file.id)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
