"use client";

type Props = {
  location: string;
  cameraName: string;
  liveStream: string;
  loading: boolean;
};

export default function CameraBox({ location, cameraName, liveStream, loading }: Props) {

  return (
    <div className="w-[800px] overflow-hidden rounded shadow">
      <div className={`bg-black text-white font-semibold text-left px-4 py-2 h-12 ${loading && "animate-pulse bg-gray-600 text-transparent"}`}>
        {location} {cameraName} 
      </div>

      <div className="w-[800px] h-[600px] bg-gray-300 flex items-center justify-center text-center text-sm">
        {loading ? (
          <div className="w-full h-full bg-gray-400 animate-pulse" />
        ) : (
          <>
            <div className="relative w-full max-w-[800px] aspect-[4/3]">
              <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-xs font-bold px-3 py-0.5 rounded flex items-center gap-1">
                <span className="text-[8px] leading-none">🔴</span>
                <span>LIVE</span>
              </div>
              {/* <img
                className="absolute inset-0 w-full h-full object-cover"
                src={`data:image/jpeg;base64,${liveStream}`}
                alt="Live stream"
              /> */}
              <video
                width={800}
                height={600}
                controls
                src="/videos/box.mp4"
                preload="metadata"
                loop
                autoPlay
                muted
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}