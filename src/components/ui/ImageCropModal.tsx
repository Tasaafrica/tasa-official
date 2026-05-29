"use client";

import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { X, Check } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropSave: (blob: Blob) => void;
  aspectRatio?: number;
}

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropSave,
  aspectRatio = 1,
}: ImageCropModalProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && imageSrc && imageRef.current) {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }

      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: aspectRatio,
        viewMode: 1,
        guides: true,
        background: false,
        autoCropArea: 1,
        responsive: true,
        checkOrientation: false, // Prevents issues with some browser image caches
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [isOpen, imageSrc, aspectRatio]);

  const handleSave = () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);
    cropperRef.current.getCroppedCanvas({
      width: 400, // Reasonable size for profile picture
      height: 400,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    }).toBlob((blob) => {
      if (blob) {
        onCropSave(blob);
      }
      setIsProcessing(false);
      onClose();
    }, "image/jpeg", 0.9);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h3 className="text-sm font-semibold text-gray-900">Crop Profile Picture</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 bg-gray-50/50">
          <div className="relative w-full max-h-[60vh] flex items-center justify-center bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-200">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop"
              className="max-w-full block max-h-full"
            />
          </div>
          <p className="mt-4 text-[10px] sm:text-[11px] text-gray-500 text-center font-medium">
            Drag the corners to adjust. Scroll to zoom.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#334155] hover:bg-[#1e293b] disabled:bg-gray-400 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
