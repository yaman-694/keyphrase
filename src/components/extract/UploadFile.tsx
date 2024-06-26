import React from "react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import CONST from "@/lib/constants";
import { UploadCloud } from "lucide-react";

async function myCustomFileGetter(event: any) {
  const files = [];
  const fileList = event.dataTransfer
    ? event.dataTransfer.files
    : event.target.files;

  const maxSizeInBytes = CONST.FILE_MAX_SIZE;
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const file = fileList[0];

  if (file) {
    // Check file size
    if (file.size > maxSizeInBytes) {
      toast({
        title: "File too large",
        description: "Please choose a file smaller than 16MB.",
      });
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please choose a PDF, DOC or DOCX file.",
      });
    }
  }
  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }
  return files;
}

const UploadFile = ({
  onDrop,
  loading,
  className,
}: {
  onDrop: (acceptedFiles: File[]) => void;
  loading: boolean;
  className?: {
    parentDivStyle: string;
    childDivStyle: string;
  };
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/pdf": [".pdf"],
    },
    useFsAccessApi: false,
    maxSize: CONST.FILE_MAX_SIZE,
    getFilesFromEvent: (event) => myCustomFileGetter(event),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        `cursor-pointer items-center justify-center rounded-lg border border-dashed border-zinc-400 bg-zinc-50 p-36 text-center text-lg font-medium text-zinc-400 max-md:px-5 ${
          isDragActive ? "bg-slate-200" : ""
        }`,
        className?.parentDivStyle
      )}
    >
      <div
        className={cn(
          "text-neutral-900 flex flex-col gap-2",
          className?.childDivStyle
        )}
      >
        <div className="flex flex-col gap-2 items-center">
          <UploadCloud />
          <div>
            {isDragActive ? "Drop your document here" : "Upload document"}
          </div>
        </div>

        <span className="text-neutral-500"> or drag and drop it here</span>
      </div>
      <div>Only .docx, .pdf (max size 16MB)</div>
      <input {...getInputProps()} disabled={loading} />
    </div>
  );
};

export default UploadFile;
