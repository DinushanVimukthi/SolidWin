"use client";

import { useState, useRef, type ChangeEvent } from "react";
import styles from "./FileUpload.module.css";

interface FileUploadProps {
  label?: string;
  hint?: string;
  maxSizeMb?: number;
  acceptedFormats?: string;
  onFileSelect?: (file: File | null) => void;
}

export function FileUpload({
  label = "Attach drawings, plans or BOQ",
  hint = "Supports PDF, DWG, PNG, JPG or Excel up to 25 MB",
  maxSizeMb = 25,
  acceptedFormats = ".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.xls,.xlsx",
  onFileSelect,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxBytes = maxSizeMb * 1024 * 1024;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    if (file.size > maxBytes) {
      setError(`File exceeds the maximum ${maxSizeMb} MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    onFileSelect?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>

      {!selectedFile ? (
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptedFormats}
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
          <div className={styles.uploadIcon}>📁</div>
          <p className={styles.dropText}>
            Click to browse or drop file here
          </p>
          <span className={styles.hint}>{hint}</span>
        </div>
      ) : (
        <div className={styles.fileSelectedBox}>
          <div className={styles.fileInfo}>
            <span className={styles.docIcon}>📄</span>
            <div>
              <p className={styles.fileName}>{selectedFile.name}</p>
              <span className={styles.fileSize}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className={styles.removeBtn}
            aria-label="Remove attached file"
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
