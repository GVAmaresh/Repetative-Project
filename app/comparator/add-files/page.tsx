
"use client";
import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import LinearProgressWithDetail from "@/components/FeedBack/loadProgress";
import { AddFolderAPI } from "@/lib/fetch";

interface FileInfo {
  name: string;
  size: number;
  progress: string;
}

interface ApiResult {
  success: boolean;
  data: {
    category: string[];
    drive: string;
    id: string;
    summary: string;
    year: string;
    title: string;
    compare: string;
  };
}

function AddFiles() {
  const [load, setLoad] = useState<FileInfo[] | null>(null);
  const [data, setData] = useState<ApiResult[]>([]);

  const handleChange = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log("No files selected.");
      return;
    }
  
    const filesArray = Array.from(files);
    const filesInfo = filesArray.map((file) => ({
      name: file.name,
      size: file.size,
      progress: "progress",
    }));
  
    setLoad(filesInfo);
  
    try {
      const response = await AddFolderAPI(filesArray);
      console.log(response);
      if (Array.isArray(response)) {
        setLoad((prevState: FileInfo[] | null) => {
          if (prevState instanceof Array) {
            const updatedFiles: FileInfo[] = [...prevState];
            for (let i = 0; i < updatedFiles.length; i++) {
              updatedFiles[i].progress = response[i].success ? "success" : "error";
            }
            return updatedFiles;
          }
          return null;
        });
        setData(response);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle error here
    }
  };
  
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <div className="flex justify-center">
        <div className="mt-8 w-fit">
        {!load ?<FileUploader
            handleChange={handleChange}
            name=""
            types={["pdf"]}
            multiple={true}
            maxSize={5}
            >
            </FileUploader>
            :
              load.map((item, index) => (
                <LinearProgressWithDetail
                  key={item.name}
                  fileName={item.name}
                  size={item.size}
                  progress={item.progress}
                  data={data[index].data}
                />
              ))}
        </div>
      </div>
    </>
  );
}

export default AddFiles;
