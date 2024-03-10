export const AddFolderAPI = async (files: File) => {
  const formData = new FormData();
  formData.append("file", files);
  try {
    const response = await fetch("http://127.0.0.1:8000/api/upload", {
      method: "POST",
      body: formData,

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

export const AddFileAPI = async (files: File) => {
  const formData = new FormData();
  formData.append("file", files);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/compare", {
      method: "POST",
      body: formData,
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

export const GetFileAPI = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/getReports", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to GET Summary");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error Getting Summary : ", error);
    throw error;
  }
};

export const DeleteFileAPI = async (ids: string[]) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/delete", {
      method: "POST",
      body: JSON.stringify({ ids: ids }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to Delete Summary");
    }
    const data = await response.json();
    console.log("Deleted Sucessfully");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error Deleting Summary : ", error);
    throw error;
  }
};
