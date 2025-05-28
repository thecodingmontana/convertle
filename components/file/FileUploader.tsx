"use client";

import { motion } from "motion/react";
import { formatBytes } from "@/hooks/use-file-upload";
import { useCallback, useEffect, useRef, useState } from "react";
import loadFfmpeg, { cn } from "@/lib/utils";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { FILE_TYPES } from "@/types";
import { Button } from "../ui/button";
import { Download, RotateCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import convert, { isConversionSupported } from "@/lib/convert";
import { type Action } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import { Progress } from "../ui/progress";

export default function FileUploader() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<Action | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<{
    url: string;
    output: string;
    size: number;
    type: string;
  } | null>(null);

  useEffect(() => {
    loadFfmpeg().then((ffmpeg) => {
      ffmpegRef.current = ffmpeg;
      setIsFFmpegLoaded(true);
    });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileDetails({
        file: selectedFile,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        from: selectedFile.name.split(".").pop() || "",
        to: "",
        is_converted: false,
        is_converting: false,
        is_error: false,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.entries(FILE_TYPES).reduce((acc, [type, exts]) => {
      acc[`${type}/*`] = exts.map((ext) => `.${ext}`);
      return acc;
    }, {} as Record<string, string[]>),
    multiple: false,
  });

  const updateConversionFormat = useCallback((to: string) => {
    setFileDetails((prev) => (prev ? { ...prev, to } : null));
  }, []);

  const deleteFile = useCallback(() => {
    setFile(null);
    setFileDetails(null);
    setConvertedFile(null);
  }, []);

  const convertFile = async () => {
    if (!file || !fileDetails || !fileDetails.to || !ffmpegRef.current) return;

    setIsConverting(true);
    setConversionProgress(0);

    const startTime = Date.now();

    try {
      const result = await convert(ffmpegRef.current, fileDetails);

      // Ensure the conversion takes at least 2 seconds
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 2000) {
        await new Promise((resolve) => setTimeout(resolve, 2000 - elapsedTime));
      }

      setConvertedFile(result);
      toast.success("Your file has been converted successfully.", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      let errorMessage = "An unexpected error occurred during conversion.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: "top-center",
      });
      setFileDetails((prev) => (prev ? { ...prev, is_error: true } : null));
    }

    setIsConverting(false);
    setConversionProgress(100);
  };

  const reset = useCallback(() => {
    setFile(null);
    setFileDetails(null);
    setConvertedFile(null);
    setIsConverting(false);
    setConversionProgress(0);
  }, []);

  const download = useCallback(() => {
    if (convertedFile) {
      const a = document.createElement("a");
      a.href = convertedFile.url;
      a.download = convertedFile.output;
      a.click();
      toast.success("Your converted file is being downloaded.", {
        position: "top-center",
      });
    }
  }, [convertedFile]);

  const getFileIcon = (file: {
    file: File | { type: string; name: string };
  }) => {
    const fileType =
      file.file instanceof File ? file.file.type : file.file.type;
    const fileName =
      file.file instanceof File ? file.file.name : file.file.name;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="flex flex-col gap-2"
    >
      <div className="grid place-content-center">
        <div
          className={`flex w-fit items-center gap-2 text-xs px-2 py-1 rounded-full ${
            isFFmpegLoaded
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isFFmpegLoaded ? "bg-green-500" : "bg-yellow-500 animate-pulse"
            }`}
          ></div>
          {isFFmpegLoaded ? "Engine Ready" : "Loading Engine"}
        </div>
      </div>
      {/* Drop area */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-10 transition-colors duration-200 ease-in-out hover:bg-muted/65 ${
            isDragActive ? "border-primary/90" : "border-muted-foreground/25"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Upload size={48} className="text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">
                Drag & drop a file here, or click to select a file
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Supported formats: Images, Audio, and Video
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                {getFileIcon({
                  file: {
                    name: file.name,
                    type: convertedFile ? convertedFile.type : file.type,
                  },
                })}
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-[13px] font-medium">
                  {file.name}
                  {convertedFile && (
                    <span className="text-emerald-600">
                      <span className="mx-2">-&gt;</span>
                      {convertedFile.type.split("/")[1]}
                    </span>
                  )}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatBytes(file.size)}
                  {convertedFile && (
                    <span className="text-emerald-600">
                      <span className="mx-2">-&gt;</span>
                      {formatBytes(convertedFile.size)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {isConverting || convertedFile ? (
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                aria-label="Remove file"
                onClick={() => deleteFile()}
                disabled={isConverting}
              >
                <Trash2 className="size-5" aria-hidden="true" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {!convertedFile && !isConverting && (
                  <Select
                    onValueChange={updateConversionFormat}
                    value={fileDetails?.to || undefined}
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        FILE_TYPES[
                          fileDetails?.file_type.split("/")[0] || ""
                        ] || []
                      )
                        .filter((ext) =>
                          isConversionSupported(fileDetails?.from || "", ext)
                        )
                        .map((ext) => (
                          <SelectItem key={ext} value={ext}>
                            {ext.toUpperCase()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                  aria-label="Remove file"
                  onClick={() => reset()}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
          {(isConverting || convertedFile) && (
            <Progress
              value={convertedFile ? 100 : conversionProgress}
              className="w-full"
            />
          )}
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer gap-1.5"
            onClick={convertedFile ? download : convertFile}
          >
            {convertedFile ? (
              <>
                <Download size={18} />
                Download File
              </>
            ) : (
              <>
                <RotateCw
                  size={18}
                  className={cn(isConverting && "animate-spin")}
                />
                {isConverting ? "Converting...!" : "Convert Now"}
              </>
            )}
          </Button>
        </>
      )}
    </motion.div>
  );
}
