"use client";
import React, { useState } from "react";
import UploadFile from "./UploadFile";
import { Button } from "../ui/button";
import { axiosClient } from "@/lib/axios";
import { toast } from "../ui/use-toast";
import { Text } from "./Text";

export default function ExtractKey() {
  const [loadingState, setLoading] = useState({
    fileLoading: false,
  });
  const [text, setText] = useState<string | null>(null);
  const [FileUploaded, setFileUploaded] = useState<{
    name: string | null;
    file: File | null;
  }>();

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFileUploaded({
        name: acceptedFiles[0]?.name,
        file: acceptedFiles[0],
      });
    }
  };

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("file", FileUploaded?.file as File);
    console.log(FileUploaded?.file);
    try {
      setLoading((prev) => ({
        ...prev,
        fileLoading: true,
      }));
      const response = await axiosClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setText(response.data.text);
      setFileUploaded({
        name: null,
        file: null,
      });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occured while uploading the file",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({
        ...prev,
        fileLoading: false,
      }));

    }
  };

  return (
    <div className="container">
      <div className="flex justify-center items-center h-screen flex-col gap-4">
        <UploadFile
          onDrop={onDrop as (acceptedFiles: File[]) => void | Promise<void>}
          loading={false}
        />
        <div>
          {FileUploaded && (
            <div>
              <p>File Uploaded: {FileUploaded.name}</p>
            </div>
          )}
        </div>
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={loadingState.fileLoading}
        >
          {loadingState.fileLoading ? "Uploading..." : "Upload File"}
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Your document text</h2>
        <div className="bg-zinc-50 p-10 rounded-md shadow-sm">
          {text && <Text text={text} />}
        </div>
      </div>
    </div>
  );
}
