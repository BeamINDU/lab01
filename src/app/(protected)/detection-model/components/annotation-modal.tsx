"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';
import { HuePicker, SliderPicker } from 'react-color'
import { X, Save, Trash2, CircleChevronLeft, CircleChevronRight, MousePointerClick, Square, CircleIcon, Edit3 } from 'lucide-react';
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { extractErrorMessage } from '@/app/utils/errorHandler';
import ImageLoading from "@/app/components/loading/ImageLoading";
import type { Annotation, RectangleAnnotation, CircleAnnotation, PolygonAnnotation, PointAnnotation } from "@/app/types/annotation";
import { ShapeType } from "@/app/constants/shape-type";
import { ClassName } from "@/app/types/class-name";
import { ModelPicture } from "@/app/types/detection-model";
import { getClassName } from "@/app/libs/services/class-name";
import { annotateImage, uploadBase64Image } from "@/app/libs/services/detection-model";
import ClassNameModal from "./class-name-modal";

interface AnnotationModalProps {
  modelVersionId: number;
  modelId: number,
  data: ModelPicture[];
  setData: React.Dispatch<React.SetStateAction<ModelPicture[]>>;
  editPicture: ModelPicture,
  onClose: () => void;
  onSave: (editDate: ModelPicture[]) => void;
  canEdit: boolean;
}

const AnnotationModal = ({
  modelVersionId,
  modelId,
  data,
  setData,
  editPicture,
  onClose,
  onSave,
  canEdit,
}: AnnotationModalProps) => {
  const { data: session } = useSession();
  // const [pictureList, setPictureList] = useState<ModelPicture[]>([]);
  const [tool, setTool] = useState<ShapeType>('rectangle');
  const [classNames, setClassNames] = useState<ClassName[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<Annotation | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassName | null>(null);
  const [selectedColor, setSelectedColor] = useState('#FF5722');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    if (data.length === 0) return;
    // setPictureList(data);

    const index = data.findIndex(p => p.url === editPicture.url);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [data, editPicture]);


  useEffect(() => {
    if (data.length === 0) return;
    // if (pictureList.length === 0) return;
    
    const currentPic = data[currentIndex];
    // const currentPic = pictureList[currentIndex];
    if (!currentPic) return;

    setIsImageLoading(true);

    const img = new Image();
    img.onload = () => {
      setImageObj(img);
    };

    if (!currentPic.url) return;
    img.src = currentPic.url;
    setIsImageLoading(false);

    setAnnotations(currentPic?.annotate ?? []);

    return () => {
      img.onload = null;
    };
  }, [currentIndex, data]);


  useEffect(() => {
    const fetchClassName = async () => {
      try {
        const data = await getClassName();
        setClassNames(data);

        if (data.length > 0 && data.length > 0) {
          setSelectedClass(data[0]);
        }
      } catch (error) {
        console.error("Failed to getClassName:", error);
      }
    };

    fetchClassName();
  }, []);

  const renderAnnotation = (ann: Annotation) => {
    const isSelected = ann.id === selectedId;

    let labelX = 0;
    let labelY = 0;

    if (ann.type === 'rectangle') {
      const [xMin, yMin, xMax, yMax] = ann.bbox;
      labelX = (xMin + xMax) / 2;
      labelY = yMin - 15;
    } else if (ann.type === 'circle') {
      const [cx, cy] = ann.center;
      labelX = cx;
      labelY = cy - ann.radius - 15;
    } else if (ann.type === 'polygon' && ann.points.length > 0) {
      const [x0, y0] = ann.points[0];
      labelX = x0;
      labelY = y0 - 15;
    } else if (ann.type === 'point') {
      const [px, py] = ann.position;
      labelX = px;
      labelY = py - 15;
    }

    return (
      <Group key={ann.id}>
        {/* Rectangle */}
        {ann.type === 'rectangle' && (
          <Rect
            id={ann.id}
            x={ann.bbox[0]}
            y={ann.bbox[1]}
            width={ann.bbox[2] - ann.bbox[0]}
            height={ann.bbox[3] - ann.bbox[1]}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={isSelected ? 3 : 2}
            draggable
            onClick={() => setSelectedId(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const width = ann.bbox[2] - ann.bbox[0];
              const height = ann.bbox[3] - ann.bbox[1];
              const updatedAnn: RectangleAnnotation = {
                ...ann,
                bbox: [
                  node.x(),
                  node.y(),
                  node.x() + width,
                  node.y() + height
                ]
              };
              setAnnotations(annotations?.map(a => a.id === ann.id ? updatedAnn : a));
            }}
          />
        )}

        {/* Circle */}
        {ann.type === 'circle' && (
          <Circle
            id={ann.id}
            x={ann.center[0]}
            y={ann.center[1]}
            radius={ann.radius}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={isSelected ? 3 : 2}
            draggable
            onClick={() => setSelectedId(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn: CircleAnnotation = {
                ...ann,
                center: [node.x(), node.y()]
              };
              setAnnotations(annotations?.map(a => a.id === ann.id ? updatedAnn : a));
            }}
          />
        )}

        {/* Polygon */}
        {ann.type === 'polygon' && ann.points?.length > 2 && (
          <Line
            id={ann.id}
            points={ann.points.flat()}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={isSelected ? 3 : 2}
            closed
            draggable
            onClick={() => setSelectedId(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const dx = node.x() - ann.points[0][0];
              const dy = node.y() - ann.points[0][1];
              const updatedPoints: [number, number][] = ann.points.map(([x, y]) => [x + dx, y + dy]);
              setAnnotations(annotations?.map(a => 
                a.id === ann.id ? { ...ann, points: updatedPoints } : a
              ));
              node.position({ x: 0, y: 0 });
            }}
          />
        )}

        {/* Point */}
        {ann.type === 'point' && (
          <Circle
            id={ann.id}
            x={ann.position[0]}
            y={ann.position[1]}
            radius={5}
            fill={ann.color}
            stroke={ann.color}
            strokeWidth={isSelected ? 3 : 2}
            draggable
            onClick={() => setSelectedId(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn: PointAnnotation = {
                ...ann,
                position: [node.x(), node.y()],
              };
              setAnnotations(annotations?.map(a => a.id === ann.id ? updatedAnn : a));
            }}
          />
        )}

        {/* Label for all types */}
        {ann.class && (
          <Text
            x={labelX}
            y={labelY}
            text={ann.class.name}
            fontSize={14}
            fontStyle="bold"
            fill={ann.color}
            align="center"
            verticalAlign="top"
            offsetX={(ann.class.name.length || 0) * 3.5}
          />
        )}
      </Group>
    );
  };

  const handleMouseDown = (e) => {
    if (selectedId !== null) return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    setIsDrawing(true);
    const id = `annotation-${Date.now()}`;
    let newAnnot;

    switch (tool) {
      case "circle":
        newAnnot = {
          id: id,
          type: "circle",
          color: selectedColor,
          class: { id: selectedClass?.id ?? '', name: selectedClass?.name ?? '' },
          center: [pos.x, pos.y],
          radius: 0,
        };
        break;

      case "rectangle":
        newAnnot = {
          id: id,
          type: "rectangle",
          color: selectedColor,
          class: { id: selectedClass?.id ?? '', name: selectedClass?.name ?? '' },
          bbox: [pos.x, pos.y, pos.x, pos.y], 
        };
        break;

      case "polygon":
        newAnnot = {
          id: id,
          type: "polygon",
          color: selectedColor,
          class: { id: selectedClass?.id ?? '', name: selectedClass?.name ?? '' },
          points: [[pos.x, pos.y]],
        };
        break;

      case "point":
        newAnnot = {
          id: id,
          type: "point",
          color: selectedColor,
          class: { id: selectedClass?.id ?? '', name: selectedClass?.name ?? '' },
          position: [pos.x, pos.y],
        };
        break;

      default:
        console.warn("Unknown tool type:", tool);
        return;
    }

    setNewAnnotation(newAnnot);
  };
  
  const handleMouseMove = (e) => {
    if (!isDrawing || !newAnnotation) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    if (newAnnotation.type === 'rectangle') {
      const [x0, y0] = newAnnotation.bbox ?? [point.x, point.y, point.x, point.y];
      const x1 = point.x;
      const y1 = point.y;

      const x_min = Math.min(x0, x1);
      const y_min = Math.min(y0, y1);
      const x_max = Math.max(x0, x1);
      const y_max = Math.max(y0, y1);

      setNewAnnotation({
        ...newAnnotation,
        bbox: [x_min, y_min, x_max, y_max],
      });
    }

    else if (newAnnotation.type === 'circle') {
      const [cx, cy] = newAnnotation.center ?? [point.x, point.y];
      const dx = point.x - cx;
      const dy = point.y - cy;
      const radius = Math.sqrt(dx * dx + dy * dy);

      setNewAnnotation({
        ...newAnnotation,
        radius,
      });
    }

    else if (newAnnotation.type === 'polygon') {
      setNewAnnotation({
        ...newAnnotation,
        points: [...(newAnnotation.points ?? []), [point.x, point.y]],
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !newAnnotation) return;

    setIsDrawing(false);

    // Validation ตามประเภทของ annotation
    if (newAnnotation.type === 'rectangle') {
      const [x_min, y_min, x_max, y_max] = newAnnotation.bbox;
      const width = Math.abs(x_max - x_min);
      const height = Math.abs(y_max - y_min);

      if (width < 5 || height < 5) {
        setNewAnnotation(null);
        return;
      }
    }

    if (newAnnotation.type === 'circle') {
      if (newAnnotation.radius < 5) {
        setNewAnnotation(null);
        return;
      }
    }

    if (newAnnotation.type === 'polygon') {
      if (!newAnnotation.points || newAnnotation.points.length < 3) {
        setNewAnnotation(null);
        return;
      }
    }

    // สร้าง annotation พร้อม class label
    const annotationWithClass: Annotation = {
      ...newAnnotation,
      class: selectedClass ?? { id: '', name: '' },
    };

    setAnnotations([...annotations, annotationWithClass]);
    setNewAnnotation(null);
    setSelectedId(annotationWithClass.id);
  };

  const handleDelete = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleBulkUpdateLabels = (updatedClasses: ClassName[]) => {
    setAnnotations(prevAnnotations => {
      return prevAnnotations?.map(ann => {
        const match = updatedClasses.find(cls => cls.id === ann.class.id);
        if (match) {
          return { ...ann, class: match };
        }
        return ann; // ไม่เปลี่ยนถ้าไม่ match
      });
    });

    // เคลียร์ selectedId ถ้า class ของ annotation ปัจจุบันไม่อยู่ใน updatedClasses
    const selectedAnnotation = annotations.find(ann => ann.id === selectedId);
    if (selectedAnnotation && !updatedClasses.some(cls => cls.id === selectedAnnotation.class.id)) {
      setSelectedId(null);
    }
  };

  const handleStageClick = (e) => {
    // ถ้าคลิกที่ stage โดยตรง หรือ node ที่มีชื่อว่า 'background'
    if (e.target === e.target.getStage() || e.target.hasName('background')) {
      setSelectedId(null); // ยกเลิกการเลือก annotation
    }
  };

  const handleSaveClassName = (classname: ClassName[]) => {
    setClassNames(classname);
    handleBulkUpdateLabels(classname);

    const selected = classname.find(c => c.id == selectedClass?.id);
    setSelectedClass(selected || null);

    setIsOpen(false);
  };
  
  const updateCurrentAnnotationsToImages = (index: number) => {
    const updated = [...data];
    // const updated = [...pictureList];
    updated[index] = { ...updated[index], annotate: annotations };
    setData(updated);
    // setPictureList(updated);
    return updated;
  };

  const updateAnnotateImage = async () => {
    try {
      const updated = updateCurrentAnnotationsToImages(currentIndex);
      const img = updated[currentIndex];

      const res = await annotateImage({
        imageId: img.id ?? undefined,
        file: img.file,
        modelVersionId,
        modelId,
        updatedBy: session?.user?.userid ?? "",
        annotate: JSON.stringify(annotations),
      });

      updated[currentIndex] = {
        ...updated[currentIndex],
        id: res.id,
        name: res.name,
        file: res.file,
        url: res.url,
        annotate: res.annotate,
      };

      setData(updated);
      // setPictureList(updated);

      return updated;
    } catch (error) {
      console.error("Upload operation failed:", error);
      showError(`Upload failed: ${extractErrorMessage(error)}`);
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const updated = await updateAnnotateImage();
      if (updated) setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < data.length - 1) {
      const updated = await updateAnnotateImage();
      if (updated) setCurrentIndex(currentIndex + 1);
    }
  };

  const onSubmit = async () => {
    const updated = await updateAnnotateImage();
    if (updated) {
      onSave(updated);
      // onSave(pictureList);
    }
  };

  const stageWidth = 760;
  const stageHeight = 500;

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
        <div className="relative flex flex-col bg-white rounded-xl w-[100%] max-w-6xl h-[75%] p-4 shadow-xl space-y-4 overflow-hidden">

          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="text-red-500" size={24} />
          </button>

          <h2 className="text-xl sm:text-2xl font-semibold text-center">Edit</h2>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row flex-1 space-y-4 lg:space-y-0 lg:space-x-4 overflow-hidden">

            {/* Tool Selection (top in mobile, left in desktop) */}
            <AnnotationToolSelector tool={tool} setTool={setTool} />

            {/* Image Viewer */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
              <div className="flex items-center justify-center relative w-full bg-white aspect-[1ุ6/10] lg:aspect-auto">
                {isImageLoading && <ImageLoading />}
                <Stage
                  width={stageWidth}
                  height={stageHeight}
                  onMouseDown={handleMouseDown}
                  onMousemove={handleMouseMove}
                  onMouseup={handleMouseUp}
                  onClick={handleStageClick}
                  ref={stageRef}
                  className="bg-white"
                >
                  <Layer>
                    {imageObj && (
                      <Rect
                        name="background"
                        width={stageWidth}
                        height={stageHeight}
                        fillPatternImage={imageObj}
                        fillPatternScaleX={stageWidth / imageObj.width}
                        fillPatternScaleY={stageHeight / imageObj.height}
                      />
                    )}
                    {annotations?.map(ann => renderAnnotation(ann))}
                    {newAnnotation && renderAnnotation(newAnnotation)}
                  </Layer>
                </Stage>
              </div>

              {/* Image Navigation */}
              <ImageNavigator
                currentIndex={currentIndex}
                total={data?.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-64 overflow-y-auto space-y-6">

              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium mb-2">Color</h3>
                {/* <HuePicker
                color={selectedColor}
                onChange={(updatedColor) => setSelectedColor(updatedColor.hex)}
                width="93%"
              /> */}
                <div style={{ width: '100%' }}>
                  <SliderPicker
                    color={selectedColor}
                    onChange={(updatedColor) => setSelectedColor(updatedColor.hex)}
                  />
                </div>
              </div>

              {/* Box Class */}
              <ClassSelector
                classNames={classNames}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                setIsOpen={setIsOpen}
              />

              {/* Annotations List */}
              <AnnotationList
                annotations={annotations}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Save & Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            {canEdit && (
              <button
                className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2"
                onClick={onSubmit}
              >
                Save <Save size={16} />
              </button>
            )}
            <button
              className="px-4 py-2 bg-secondary rounded flex items-center gap-2"
              onClick={onClose}
            >
              Close <X size={16} />
            </button>
          </div>
          
        </div>
      </div>

      {/* Class Name Modal */}
      {isOpen && (
        <ClassNameModal
          onClose={() => setIsOpen(false)}
          onSave={handleSaveClassName}
          data={classNames}
        />
      )}
    </>
  );
}

interface ToolSelectorProps {
  tool: ShapeType | 'rectangle';
  setTool: (id: ShapeType) => void;
}
function AnnotationToolSelector({ tool, setTool }: ToolSelectorProps) {
  const tools: { id: ShapeType; label: string; icon?: JSX.Element }[] = [
    { id: 'point', label: 'Point', icon: <MousePointerClick size={24} /> },
    { id: 'rectangle', label: 'Rectangle', icon: <Square size={24} /> },
    { id: 'circle', label: 'Circle', icon: <CircleIcon size={24} /> },
    { id: 'polygon', label: 'Polygon', icon: <Edit3 size={24} /> },
  ];

  return (
    <div className="w-14 flex flex-col items-center">
      <div className="space-y-6">
        {tools.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={`flex items-center space-x-2 px-1 py-1 rounded border ${tool === id ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            title={label}
          >
            {icon && <span>{icon}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};


type ClassSelectorProps = {
  classNames: ClassName[];
  selectedClass: ClassName | null;
  setSelectedClass: (cls: ClassName) => void;
  setIsOpen: (open: boolean) => void;
};
function ClassSelector({ classNames, selectedClass, setSelectedClass, setIsOpen }: ClassSelectorProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium mb-2">Box Class</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
        >
          Add new class
        </button>
      </div>
      {/* Class radio list */}
      <div className="space-y-3 text-sm">
        {classNames.map((item, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name="className"
              value={item.id}
              checked={item.id === selectedClass?.id}
              onChange={() => setSelectedClass(item)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span>{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  )
}


type AnnotationListProps = {
  annotations: Annotation[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  onDelete: (id: string) => void;
};
function AnnotationList({ annotations, selectedId, setSelectedId, onDelete }: AnnotationListProps) {
  return (
    <div className="mt-0">
      <h3 className="text-sm font-medium mb-2">Annotations List</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {annotations.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">No annotations yet</p>
        ) : (
          annotations?.map((ann, index) => {
            return (
              <div
                key={ann.id}
                onClick={() => setSelectedId(ann.id)}
                className={`p-1.5 rounded cursor-pointer transition-colors ${selectedId === ann.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                  } border`}
              >
                <div className="flex justify-between items-start">
                  {/* Annotations */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm mr-1">{index + 1}.</span>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          backgroundColor: ann?.color,
                          borderRadius: '2px',
                          marginRight: '2px',
                        }}
                      ></span>
                      <p className="text-sm font-medium">{ann?.class?.name}</p>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(ann.id);
                    }}
                    className="text-red-500 hover:text-red-700 mt-1"
                    title="Delete annotation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


type ImageNavigatorProps = {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
};
function ImageNavigator({ currentIndex, total, onPrevious, onNext }: ImageNavigatorProps) {
  return (
    <div className="flex justify-between w-full mt-4">
      {/* Previous Image */}
      <div
        className={`flex items-center gap-1 text-sm cursor-pointer ${currentIndex === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"
          }`}
        onClick={() => {
          if (currentIndex > 0) onPrevious();
        }}
        aria-disabled={currentIndex === 0}
      >
        <CircleChevronLeft size={35} />
        <span>Previous Image</span>
      </div>
      {/* Next Image */}
      <div
        className={`flex items-center gap-1 text-sm cursor-pointer ${currentIndex === total - 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"
          }`}
        onClick={() => {
          if (currentIndex < total - 1) onNext();
        }}
        aria-disabled={currentIndex === total - 1}
      >
        <span>Next Image</span>
        <CircleChevronRight size={35} />
      </div>
    </div>
  );
}


export default AnnotationModal