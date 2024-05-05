// http://127.0.0.1:8000
const URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
  : "http://localhost:8000/api";

export const AddFolderAPI = async (files: File[]) => {
    console.log("Check here 2")
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await fetch(`${URL}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload files");
      }
      const responseData = await response.json();
      console.log(responseData);
      const newData = responseData.data.map((item: any) => ({
        id: item.data.id || "",
        compare: item.data.compare || "",
        title: item.data.title || "",
        summary: item.data.summary || "",
        drive: item.data.drive || "",
        year: item.data.year || "",
        category: item.data.category || "",
    }));

    return {data: newData, status: true};
    } catch (error) {
      console.error("Error uploading files:", error);
      return {data: [], status: false};
    }
  };
  
  export const AddFileAPI = async (files: File) => {
    const formData = new FormData();
    formData.append("file", files);
  
    try {
      const response = await fetch(`${URL}/compare`, {
        method: "POST",
        body: formData,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });
      if (!response.ok) {
        throw new Error("Failed to upload files");
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  };