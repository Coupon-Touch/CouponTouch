import {
  generateReactHelpers,
} from "@uploadthing/react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";

import { Button } from "@/components/ui/button.tsx";

import { OurFileRouter } from "../../../uploadThing.ts";
import { ClientUploadedFileData } from "uploadthing/types";
import { useCallback, useState } from "react";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";

// const initOpts = {
//   url: window.location.origin,
// } satisfies GenerateTypedHelpersOptions;

//@ts-expect-error i dont know what to put here
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function UploadButton(props: {
  endpoint: keyof OurFileRouter,
  onComplete: (file: ClientUploadedFileData<null>[]) => void,
  onError?: (err: UploadThingError<Json>) => void,
  uploadBegin?: (file: string) => void
}) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { startUpload, routeConfig } = useUploadThing(props.endpoint, {
    onClientUploadComplete: (file) => {
      props.onComplete(file)
      setUploading(false)
    },
    onUploadError: (err) => {
      setUploading(false)
      if (props.onError)
        props.onError(err)
    },
    onUploadBegin: (file) => {

      if (props.uploadBegin)
        props.uploadBegin(file);
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(generatePermittedFileTypes(routeConfig).fileTypes),
  });
  return (
    <>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition duration-200 ease-in-out"
      >
        <input {...getInputProps()} className="hidden" />
        <div className="text-center">
          <p className="text-gray-600 mb-2">Drop files here!</p>
          {files.length > 0 && (
            <Button
              onClick={(e) => { setUploading(true); startUpload(files); e.stopPropagation() }}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              {uploading ? "Uploading..." : `Upload ${files.length} files`}

            </Button>
          )}
        </div>
      </div>
    </>

  );
}
