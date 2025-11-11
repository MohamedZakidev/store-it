"use client"
import { getFileType } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";

function FileUploader({ className }) {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={`uploader-button ${className}`}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload logo"
          width={24}
          height={24}
        />
        Upload
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extention } = getFileType(file.name)
            return (
              <li key={`${file.name}-${index}`} className="uploader-preview-item">test</li>
            )
          })}
        </ul>
      )}
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default FileUploader;
