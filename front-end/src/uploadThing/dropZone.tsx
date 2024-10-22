import { useState, useCallback } from 'react';
import {
  generateReactHelpers,
} from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react';
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from 'uploadthing/client';

import { OurFileRouter } from '../uploadThing.ts';
import { ClientUploadedFileData } from 'uploadthing/types';
import { UploadThingError } from 'uploadthing/server';
import { Json } from '@uploadthing/shared';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';

// const initOpts = {
//   url: window.location.origin,
// } satisfies GenerateTypedHelpersOptions;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function UploadButton(props: {
  endpoint: keyof OurFileRouter;
  onComplete: (file: ClientUploadedFileData<null>[]) => void;
  onError?: (err: UploadThingError<Json>) => void;
  uploadBegin?: (file: string) => void;
  files?: string;
  onDelete?: () => void;
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
  const alreadyUploadedFiles = !(!props.files || props.files.length === 0) || uploadedFiles.length < 0;
  return (
    <div>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition duration-200 ease-in-out"
      >
        {!alreadyUploadedFiles && (
          <input {...getInputProps()} className="hidden" />
        )}
        <div className="text-center">
          {uploading ? (
            <p className="text-blue-600 mt-2">Uploading...</p>
          ) : (
              !alreadyUploadedFiles && (
              <p className="text-gray-600 mb-2">Drop files here to upload!</p>
            )
          )}
          {/* Display Uploaded Files */}
          {alreadyUploadedFiles && (
            <div className="mt-4">
              <h4 className="font-semibold">Image Upload Successful!</h4>
              <ul className="list-disc list-inside flex justify-center">
                {uploadedFiles.length > 0 ? uploadedFiles.map((file, index) => (
                  <ImageWithDeleteButton
                    key={index}
                    src={file.url}
                    className=' h-20 object-contain'
                    onDelete={props.onDelete}
                  />

                )) :
                  <ImageWithDeleteButton
                    src={props.files || ""}
                    className=' h-20 object-contain'
                    onDelete={props.onDelete}
                  />

                }


              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const ImageWithDeleteButton = ({ src, alt, className, onDelete }: { src: string, alt?: string, className?: string, onDelete?: () => void }) => {
  const [hover, setHover] = useState(false);
  const [isImgLoaded, setIsImageLoaded] = useState(false);
  return (
    <div className="relative group flex justify-center items-center" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {!isImgLoaded &&
        <div className="w-full h-full flex justify-center items-center flex-col gap-4 animate-pulse">
          <svg
            className="text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 640 512">
            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
          </svg>
        </div>

      }
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-auto rounded-lg", className)}
        onLoad={() => setIsImageLoaded(true)}
      />
      {onDelete && hover && <>
        <div className='absolute w-full h-full bg-black/20 rounded-lg flex justify-center'>
          <Button variant="destructive" className='mt-4 absolute' onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </>
      }
    </div>
  );
};

export default ImageWithDeleteButton;
