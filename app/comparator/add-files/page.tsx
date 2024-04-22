"use client";
import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import LinearProgressWithDetail from "@/components/FeedBack/loadProgress";
import { AddFolderAPI } from "@/lib/fetch2";

interface FileInfo {
  name: string;
  size: number;
  progress: string;
}
interface Naming {
  category: string[];
  drive: string;
  id: string;
  summary: string;
  compare: string;
  year: string;
  title: string;
}

interface ApiResult {
  success: boolean;
  data: Naming[];
}

function AddFiles() {
  const [load, setLoad] = useState<FileInfo[] | null>(null);
  const [data, setData] = useState<ApiResult | null>();

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
    console.log(filesInfo.length);

    try {
      console.log("Check here 1");
      const response = await AddFolderAPI(filesArray);
      console.log("Check here 33");
      console.log("the response = ", response.data);
      if (Array.isArray(response.data) && response.status) {
        setLoad((prevState: FileInfo[] | null) => {
          if (prevState instanceof Array) {
            const updatedFiles: FileInfo[] = [...prevState];
            for (let i = 0; i < updatedFiles.length; i++) {
              updatedFiles[i].progress = true
                ? "success"
                : "error";
            }
            return updatedFiles;
          }
          return null;
        });
        setData({ success: true, data: [...response.data] });
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {

    }
  };

  useEffect(() => {
    console.log(data?.data);
  }, [data]);

  return (
    <>
      <div className="flex justify-center">
        <div className="mt-8 w-fit">
          {!load ? (
            <FileUploader
              handleChange={handleChange}
              name=""
              types={["pdf"]}
              multiple={true}
              maxSize={5}
            />
          ) : (
            load.map((item, index) => (
              <LinearProgressWithDetail
                key={item.name}
                fileName={item.name}
                size={item.size}
                progress={item.progress}
                data={(data && data.data && data.data[index]) || null}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AddFiles;
