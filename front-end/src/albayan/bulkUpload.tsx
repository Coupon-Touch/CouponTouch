import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

export default function BulkUpload() {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file);
      setFile(file)

      const formData = new FormData();
      formData.append('file', file);  // 'file' is the key expected by the backend

      try {
        const response = await fetch('/api/uploadCSV', {
          method: 'POST',
          body: formData,  // Sending the form data to the backend
          headers: {
            'Content-Type': 'multipart/form-data',
            'authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          alert('File uploaded successfully');
        } else {
          console.log(response)
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
  return <>
    <div className='flex justify-center flex-col items-center gap-2'>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      {
        file
        && file.name

      }

      <Button onClick={handleButtonClick} className='w-36' >Bulk Upload</Button>
    </div>
  </>
}