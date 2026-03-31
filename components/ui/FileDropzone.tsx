'use client';

import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import type { Accept } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  onFilesSelected?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: Accept;
}

const DEFAULT_ACCEPT: Accept = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
};

export function FileDropzone({
  files = [],
  onFilesChange,
  onFilesSelected,
  maxFiles = 10,
  maxSizeMB = 5,
  accept = DEFAULT_ACCEPT,
}: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const code = rejection.errors[0]?.code;
        if (code === 'file-too-large') {
          setError(`Datei zu gross. Max. ${maxSizeMB}MB erlaubt.`);
        } else if (code === 'file-invalid-type') {
          setError('Nur JPG, PNG und WebP sind erlaubt.');
        } else {
          setError(rejection.errors[0]?.message ?? 'Datei nicht akzeptiert.');
        }
        return;
      }
      setError(null);
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      onFilesChange?.(newFiles);
      onFilesSelected?.(newFiles);
    },
    [files, maxFiles, maxSizeMB, onFilesChange, onFilesSelected]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange?.(updated);
    onFilesSelected?.(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
  });

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={cn(
          'rounded-[12px] border-2 border-dashed px-6 py-8 text-center transition-all duration-200 cursor-pointer',
          isDragActive
            ? 'border-[#0369A1] bg-[#F0F7FF]'
            : 'border-[#E2EDF7] bg-white hover:border-[#0369A1] hover:bg-[#F0F7FF]',
          files.length >= maxFiles && 'cursor-not-allowed opacity-60'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload size={40} strokeWidth={2.5} color="#0369A1" />
          {isDragActive ? (
            <p className="text-sm font-medium text-[#0369A1]">Bilder hier ablegen...</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#0F172A]">
                Bilder hochladen oder hierher ziehen
              </p>
              <p className="text-xs text-[#64748B]">
                JPG, PNG, WebP &middot; max. {maxSizeMB}MB pro Bild &middot; max. {maxFiles} Bilder
              </p>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-[#EF4444]">{error}</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {files.map((file, index) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={index} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={file.name}
                  className="h-20 w-full rounded-lg object-cover border border-[#E2EDF7]"
                  onLoad={() => URL.revokeObjectURL(url)}
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow"
                  aria-label="Bild entfernen"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <p className="text-xs text-[#64748B]">
          {files.length} von {maxFiles} Bildern hochgeladen
        </p>
      )}
    </div>
  );
}

export default FileDropzone;
