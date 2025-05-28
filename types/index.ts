export const FILE_TYPES: Record<string, string[]> = {
  image: ["jpg", "jpeg", "png", "gif", "webp", "ico", "tif", "svg", "raw"],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
};

export type Action = {
  file: any
  file_name: string
  file_size: number
  from: string
  to: string | null
  file_type: string
  is_converting?: boolean
  is_converted?: boolean
  is_error?: boolean
  url?: any
  output?: any
}