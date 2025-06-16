"use client";

type Props = {
  cameraName: string;
  liveStream: string;
  loading: boolean;
};

export default function CameraBox({ cameraName, liveStream, loading }: Props) {

  return (
    <div className="w-[640px] overflow-hidden rounded shadow">
      <div className={`bg-black text-white font-semibold text-left px-4 py-2 h-10 ${loading && "animate-pulse bg-gray-600 text-transparent"}`}>
        {cameraName}
      </div>
      <div className="w-[640px] h-[480px] bg-gray-300 flex items-center justify-center text-center text-sm">
        {loading ? (
          <div className="w-full h-full bg-gray-400 animate-pulse" />
        ) : (
          <>
            <div className="relative w-full max-w-[640px] aspect-[4/3]">
              <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="text-[8px] leading-none">🔴</span>
                <span>LIVE</span>
              </div>
              {/* <img
                className="absolute inset-0 w-full h-full object-cover"
                src={`data:image/jpeg;base64,${liveStream}`}
                alt="Live stream"
              /> */}
              <video
                width={640}
                height={480}
                controls
                src="/videos/2025-01-24_16-51-55.mp4"
                preload="metadata"
                loop
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}