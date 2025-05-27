"use client";

import { motion } from "motion/react";
import { useFileUpload } from "@/hooks/use-file-upload";
import DropArea from "./DropArea";
import FilesTable from "./FilesTable";
import { useEffect, useRef, useState } from "react";
import loadFfmpeg from "@/lib/utils";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { AlertCircleIcon } from "lucide-react";

export default function FileUploader() {
  const maxSize = 10 * 1024 * 1024; // 10MB default
  const maxFiles = 10;
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
  });

  useEffect(() => {
    loadFfmpeg().then((ffmpeg) => {
      console.log("FFmpeg loaded:", ffmpeg);
      ffmpegRef.current = ffmpeg;
      setIsFFmpegLoaded(true);
    });
  }, []);

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
      <DropArea
        files={files}
        handleDragEnter={handleDragEnter}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        isDragging={isDragging}
        getInputProps={getInputProps}
        maxSize={maxSize}
        maxFiles={maxFiles}
        openFileDialog={openFileDialog}
      />
      {files.length > 0 && (
        <FilesTable
          files={files}
          removeFile={removeFile}
          clearFiles={clearFiles}
          openFileDialog={openFileDialog}
        />
      )}
    </motion.div>
  );
}
