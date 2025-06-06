"use client";

type Props = {
  cameraName: string;
  liveStream: string;
  loading: boolean;
};

export default function CameraBox({ cameraName, liveStream, loading }: Props) {
  
  return (
    <div className="bg-gray-200">
      <div className={`bg-black text-white px-4 py-2 font-semibold ${loading && "animate-pulse bg-gray-600 text-transparent"}`}>
        {cameraName}
      </div>
      <div className="flex items-center justify-center w-full h-60 sm:h-72 md:h-[480px] bg-gray-300 text-black text-center">
        {loading ? (
          <div className="w-full h-full bg-gray-400 animate-pulse" />
        ) : (
          // "640 × 480"
          <img
            className="w-full h-full object-cover"
            src={`data:image/jpeg;base64,${liveStream}`}
            alt="Live stream"
          />
        )}
        </div>
    </div>
  );
}