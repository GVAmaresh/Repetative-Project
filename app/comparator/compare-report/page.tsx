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
  compare: string;
}

function AddFileCompare() {
  const [load, setLoad] = useState<FileInfo[] | null>(null);
  const [newData, setNewData] = useState<Naming[] | []>([]);
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
              // setData((prevData) => {
              //   const idExists = prevData.some(
              //     (item) => item.id === data.data.id
              //   );
              //   if (!idExists) {
              //     return [
              //       ...prevData,
              //       {
              //         category: data.data.category,
              //         drive: data.data.drive,
              //         id: data.data.id,
              //         compare: data.data.compare,
              //         summary: data.data.summary,
              //         title: data.data.title,
              //         year: data.data.year,
              //       },
              //     ];
              //   }
              //   return prevData;
              // });
              setNewData(data.data);
              const updatedFiles = [...prevState];
              console.log(data.data);
              console.log(data.data[1]);
              // console.log(updatedFiles);
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
    console.log(newData);
    console.log(newData[1]);
  }, [newData, setNewData]);
  return (
    <>
      <div className="flex justify-center">
        <div className="mt-8">
          {!load ? (
            <FileUploader
              handleChange={handleChange}
              name=""
              types={["pdf"]}
              multiple={true}
              maxSize={5}
            ></FileUploader>
          ) : (
            newData.length >= 1 &&
            newData.map((item) => (
              <LinearProgressWithDetail
                key={item.id}
                fileName=""
                size={0}
                progress="success"
                data={item}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default AddFileCompare;
