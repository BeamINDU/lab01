"use client";

import React, { useEffect, useState } from "react";
// import ReactImageAnnotate from "react-image-annotate";

import dynamic from "next/dynamic";
const ReactImageAnnotate = dynamic(() => import("react-image-annotate"), { ssr: false });

export default function AnnotatePage() {
  const [images, setImages] = useState<any[]>([]);
  const [annotationData, setAnnotationData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // โหลดรูปจาก API (mock)
  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/images");
      const data = await res.json();
      const formatted = data.map((img: any, i: number) => ({
        src: img.url,
        name: `Image ${i + 1}`,
        regions: img.regions || [],
      }));
      setImages(formatted);
    };
    fetchImages();
  }, []);

  // เมื่อบันทึก/ปิด Annotator
  const handleExit = (output: any) => {
    console.log("Annotation Result:", output);
    setAnnotationData(output);

    // ส่งกลับ backend (mock)
    fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(output),
    });
  };

  // ปุ่มบันทึก Annotation ลง local (JSON)
  const handleSaveToLocal = () => {
    if (!annotationData) return;

    const json = JSON.stringify(annotationData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
  };

  if (images.length === 0) return <p>Loading images...</p>;

  return (
    <div>
      <ReactImageAnnotate
        selectedImage={images[currentIndex].src}
        images={images} 
        regionClsList={["Person", "Car", "Dog"]}
        regionTagList={["Red", "Blue", "Green"]}
        enabledTools={["create-box"]}
      />

      {/* <Annotator
        selectedImage={images[currentIndex].src}
        images={images} 
        regionClsList={["Person", "Car", "Dog"]}
        regionTagList={["Red", "Blue", "Green"]}
        enabledTools={["select", "create-box", "create-polygon"]}
        showTags
        onExit={handleExit}
      /> */}

      <div className="p-4 space-x-2">
        <button onClick={handleSaveToLocal} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save as JSON
        </button>
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          className="px-4 py-2 border rounded"
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentIndex((i) => Math.min(i + 1, images.length - 1))}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
