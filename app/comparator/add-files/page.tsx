"use client";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import LinearProgressWithDetail from "@/components/FeedBack/loadProgress";
import { AddFileAPI, AddFolderAPI } from "@/lib/fetch";
import { title } from "process";

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
  year: string;
  title: string;
  compare:string
}

function AddFiles() {
  const [load, setLoad] = useState<FileInfo[] | null>(null);
  const [data, setData] = useState<Naming[] | []>([]);
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
        console.log(data);
        if (!data.success) {
          // setData(e=>[...e, data.data]);
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
              setData((prevData) => {
                const idExists = prevData.some(
                  (item) => item.id === data.data.id
                );
                if (!idExists) {
                  return [
                    ...prevData,
                    {
                      category: data.data.category,
                      drive: data.data.drive,
                      id: data.data.id,
                      summary: data.data.summary,
                      title: data.data.title,
                      compare: data.data.compare,
                      year: data.data.year,
                    },
                  ];
                }

                return prevData;
              });
              const updatedFiles = [...prevState];
              console.log(data);
              console.log(updatedFiles);
              // setData(updatedFiles)
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
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <div className="flex justify-center">
        <div className="mt-8 w-full max-w-screen-lg">
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
                  data={data[index]}
                />
              ))}
        </div>
      </div>
    </>
  );
}

export default AddFiles;
