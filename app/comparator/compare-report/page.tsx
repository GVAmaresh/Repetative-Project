import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import LinearProgressWithDetail from "@/components/FeedBack/loadProgress";
import { AddFileAPI, AddFolderAPI } from "@/lib/fetch";

interface FileInfo {
  name: string;
  size: number;
  progress: string;
}

function CompareReport() {
  const [load, setLoad] = useState<FileInfo[] | null>(null);

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

        const data = await AddFileAPI(file);
        if (!data.success) {
          setLoad((prevState) => {
            if (prevState instanceof Array) {
              const updatedFiles = [...prevState];
              updatedFiles[i].progress = "error";
              return updatedFiles;
            }
            return null;
          });
        } else {
          setLoad((prevState) => {
            if (prevState instanceof Array) {
              const updatedFiles = [...prevState];
              updatedFiles[i].progress = "success";
              return updatedFiles;
            }
            return null;
          });
        }
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

export default CompareReport;
