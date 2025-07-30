"use client";

import { useState, useEffect } from "react";

type Props = {
  liveStream: string;  // base64 string
  location: string;
  cameraName: string;
  loading: boolean;
};

export default function CameraBox({ liveStream, location, cameraName, loading }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!liveStream) return;

    // เคลียร์ Blob URL ก่อนหน้า
    setImageUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    // แปลง Base64 เป็น Blob
    const byteString = atob(liveStream);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const blobUrl = URL.createObjectURL(blob);

    setImageUrl(blobUrl);

    // ล้าง Blob URL ตอน unmount หรือเปลี่ยน frame
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [liveStream]);

  return (
    <div className="w-[800px] overflow-hidden rounded shadow">
      <div className={`bg-black text-white font-semibold text-left px-4 py-2 h-12 ${loading && "animate-pulse bg-gray-600 text-transparent"}`}>
        {location} {cameraName}
      </div>

      <div className="w-[800px] h-[600px] bg-gray-300 flex items-center justify-center text-center text-sm">
        {loading ? (
          <div className="w-full h-full bg-gray-400 animate-pulse" />
        ) : (
          imageUrl && (
            <div className="relative w-full max-w-[800px] aspect-[4/3]">
              <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-xs font-bold px-3 py-0.5 rounded flex items-center gap-1">
                <span className="text-[8px] leading-none">🔴</span>
                <span>LIVE</span>
              </div>
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src={imageUrl}
                alt="Live stream"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
