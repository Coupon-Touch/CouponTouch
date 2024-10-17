import { useState, useCallback } from 'react';
import {
  generateReactHelpers,
} from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react';
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from 'uploadthing/client';

import { OurFileRouter } from '../../../uploadThing.ts';
import { ClientUploadedFileData } from 'uploadthing/types';
import { UploadThingError } from 'uploadthing/server';
import { Json } from '@uploadthing/shared';

// const initOpts = {
//   url: window.location.origin,
// } satisfies GenerateTypedHelpersOptions;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function UploadButton(props: {
  endpoint: keyof OurFileRouter;
  onComplete: (file: ClientUploadedFileData<null>[]) => void;
  onError?: (err: UploadThingError<Json>) => void;
  uploadBegin?: (file: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    ClientUploadedFileData<null>[]
  >([]); // Track uploaded files

  const { startUpload, routeConfig } = useUploadThing(props.endpoint, {
    onClientUploadComplete: files => {
      setUploading(false);
      setUploadedFiles(files); // Add newly uploaded files to state
      props.onComplete(files);
    },
    onUploadError: err => {
      setUploading(false);
      if (props.onError) props.onError(err);
    },
    onUploadBegin: file => {
      setUploadedFiles([]);
      if (props.uploadBegin) props.uploadBegin(file);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploading(true);
      startUpload(acceptedFiles); // Automatically start upload when files are dropped
    },
    [startUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition duration-200 ease-in-out"
      >
        <input {...getInputProps()} className="hidden" />
        <div className="text-center">
          {uploading ? (
            <p className="text-blue-600 mt-2">Uploading...</p>
          ) : (
            uploadedFiles.length === 0 && (
              <p className="text-gray-600 mb-2">Drop files here to upload!</p>
            )
          )}
          {/* Display Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Image Upload Successful!</h4>
              <ul className="list-disc list-inside">
                {uploadedFiles.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
