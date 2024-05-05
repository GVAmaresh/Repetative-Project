"use client";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import LinearProgressWithDetail from "@/components/FeedBack/loadProgress";
import { AddFileAPI } from "@/lib/fetch2";

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
  const [summary, setSummary] = useState<string>("");
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
              setSummary(data.summary);
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
            />
          ) : (
            newData.length >= 1 && (
              <div className="">
                <div className=" ml-4 p-6 md:ml-28 md:mr-20 mb-10 border-2 rounded-tl-3xl rounded-br-3xl">
                  <div className="">Summary: </div>
                  <div className="pl-4 pr-1 md:pl-20 md:pr-32">{summary}</div>
                </div>
                <div className="">
                {newData.map((item) => (
                  <LinearProgressWithDetail
                    key={item.id}
                    fileName=""
                    size={0}
                    progress="success"
                    data={item}
                  />
                ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default AddFileCompare;
