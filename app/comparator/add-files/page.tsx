"use client";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";

import { AddFolderAPI } from "@/lib/fetch";
import LinearProgressWithDetail from "@/components/FeedBack/loadProgress";
interface FileInfo {
  name: string;
  size: number;
  progress: string;
}

function Predict() {
  const [load, setLoad] = useState<null | FileInfo[]>(null);

  const handleChange = async (files: File[]) => {
    if (!files || files.length === 0) {
      console.log("No files selected.");
      return;
    }
    const filesInfo = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      progress: "progress",
    }));
    setLoad(filesInfo);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const data = await AddFolderAPI(file);
        if (!data.success) {
          setLoad((prevState) => {
            const updatedFiles = [...prevState];
            updatedFiles[i].progress = "error";
            return updatedFiles;
          });
          return;
        }
        setLoad((prevState) => {
          const updatedFiles = [...prevState];
          updatedFiles[i].progress = "success";
          return updatedFiles;
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="mt-8 w-full max-w-screen-lg">
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={["pdf"]}
            multiple={true}
            maxSize={5}
          >
            {load && load.map((item) => (
              <LinearProgressWithDetail
                key={item.name}
                fileName={item.name}
                size={item.size}
                progress={item.progress}
              />
            ))}
          </FileUploader>
        </div>
      </div>
    </>
  );
}

export default Predict;
