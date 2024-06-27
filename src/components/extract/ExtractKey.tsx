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
  const [keyPhrases, setKeyPhrases] = useState<string[] | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState<{
    name: string | null;
    file: File | null;
  }>({
    name: null,
    file: null,
  });

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
    formData.append("file", fileUploaded?.file as File);
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
          {fileUploaded.name && (
            <div>
              <p>File Uploaded: {fileUploaded.name}</p>
            </div>
          )}
        </div>
        <Button
          type="submit"
          onClick={onSubmit}
          className="active:scale-95 transition-all duration-300"
          disabled={loadingState.fileLoading || fileUploaded?.file === null}
        >
          {loadingState.fileLoading ? "Uploading..." : "Upload File"}
        </Button>
      </div>

      {text && (
        <div className="flex flex-col gap-2 my-10">
          <h2 className="text-2xl font-bold">Your document text</h2>
          <div className="border-sky-200 border bg-gradient-to-bl from-sky-50 p-10 rounded-md shadow-sm">
            <Text text={text} setKeyPhrases={setKeyPhrases} />
          </div>
        </div>
      )}

      {keyPhrases && (
        <div className="flex flex-col gap-2 my-10">
          <h2 className="text-2xl font-bold">Key Phrases</h2>
          <div className="border-sky-200 w-1/2 border bg-gradient-to-bl grid grid-cols-1 gap-1 from-sky-50 p-10 rounded-md shadow-sm">
            {keyPhrases.map((phrase, index) => (
              <span key={index} className="text-base self-start bg-white rounded-md shadow-sm hover:shadow-lg transition-all flex items-center gap-1 p-1">
                <span>{index + 1}.</span>
                <span>{phrase.trim()}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
