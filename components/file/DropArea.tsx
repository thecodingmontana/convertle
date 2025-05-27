import { FileIcon, UploadIcon } from "lucide-react";
import React, { DragEvent, InputHTMLAttributes, useEffect } from "react";
import { Button } from "../ui/button";
import { FileWithPreview, formatBytes } from "@/hooks/use-file-upload";
import loadFfmpeg from "@/lib/utils";

interface DropAreaProps {
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  isDragging: boolean;
  files: FileWithPreview[];
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
  maxSize: number;
  maxFiles: number;
  openFileDialog: () => void;
}

export default function DropArea({
  files,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  isDragging,
  getInputProps,
  maxSize,
  maxFiles,
  openFileDialog,
}: DropAreaProps) {

  useEffect(() => {
    loadFfmpeg().then((ffmpeg) => {
      // ffmpegRef.current = ffmpeg
      // setIsLoaded(true)
    })
  }, [])

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-dragging={isDragging || undefined}
      data-files={files.length > 0 || undefined}
      className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden"
    >
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload files"
      />
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <FileIcon className="size-4 opacity-60" />
        </div>
        <p className="mb-1.5 text-sm font-medium">Upload files</p>
        <p className="text-muted-foreground text-xs">
          Max {maxFiles} files ∙ Up to {formatBytes(maxSize)}
        </p>
        <Button variant="outline" className="mt-4" onClick={openFileDialog}>
          <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
          Select files
        </Button>
      </div>
    </div>
  );
}
