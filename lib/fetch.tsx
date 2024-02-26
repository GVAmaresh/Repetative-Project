export const AddFolderAPI = async (files:File) => {
  const formData = new FormData();
  formData.append("file", files);
  // [...files].forEach((file, index) => {
  //   formData.append(`file${index}`, file);
  // });

  try {
    const response = await fetch('http://127.0.0.1:8000/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload files');
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};
