"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ImageUploadProps {
  initialImage?: string | null;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved?: () => void;
  className?: string;
}

export function ImageUpload({
  initialImage,
  onImageUploaded,
  onImageRemoved,
  className = "",
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const imageUrl = await uploadToCloudinary(file);

      setImage(imageUrl);
      onImageUploaded(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!image ? (
        <div
          className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={handleClickUpload}
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG or GIF up to 5MB
          </p>
          {isUploading && <div className="mt-2 text-sm">Uploading...</div>}
          {uploadError && (
            <div className="mt-2 text-sm text-destructive">{uploadError}</div>
          )}
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border">
          <img
            src={image || "/placeholder.svg"}
            alt="Uploaded image"
            className="w-full h-auto object-cover max-h-[300px]"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="destructive"
              onClick={handleRemoveImage}
              className="h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleClickUpload}
              className="h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            >
              <Upload className="h-4 w-4" />
              <span className="sr-only">Replace image</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
