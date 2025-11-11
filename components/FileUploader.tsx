"use client"
import { convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Thumbnail from "./Thumbnail";
import { Button } from "./ui/button";

type FileUploaderProps = {
  className: string
}

function FileUploader({ className }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
            const { type, extension } = getFileType(file.name)
            return (
              <li key={`${file.name}-${index}`} className="uploader-preview-item">
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    <p>{file.name}</p>
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="loader"
                    />
                  </div>
                </div>
                <Image
                  src="/public/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            )
          })}
        </ul>
      )}
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag & drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default FileUploader;
