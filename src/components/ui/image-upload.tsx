"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => { setPreview(value); }, [value]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        onChangeRef.current(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload failed", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChangeRef.current("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "var(--admin-text)" }}>{label}</label>}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            border: "2px dashed var(--admin-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            background: preview ? `url(${preview}) center/cover no-repeat` : "var(--admin-bg-secondary)",
            position: "relative",
          }}
        >
          {!preview && !uploading && <Upload size={24} style={{ color: "var(--admin-text-muted)" }} />}
          {uploading && <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>Uploading...</span>}
        </div>
        {preview && (
          <button type="button" onClick={handleRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}>
            <X size={18} />
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "4px 0 0" }}>{error}</p>}
    </div>
  );
}
