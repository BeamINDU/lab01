"use client";

import React, { useState, useRef, useEffect } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';
import { HuePicker, SliderPicker } from 'react-color'
import { X, Save, Trash2, CircleChevronLeft, CircleChevronRight, MousePointerClick, Square, CircleIcon, Edit3 } from 'lucide-react';
import { } from 'lucide-react';
import { useSession } from "next-auth/react";
import { FormData, DetectionModel, ModelPicture, Annotation } from "@/app/types/detection-model";
import ImageLoading from "@/app/components/loading/ImageLoading";
import { ShapeType } from "@/app/constants/shape-type";
import { ClassName } from "@/app/types/class-name";
import ClassNameModal from "./class-name-modal";
import { getClassName } from "@/app/libs/services/class-name";

interface AnnotationModalProps {
  data: ModelPicture[];
  editPicture: ModelPicture,
  onClose: () => void;
  onSave: () => void;
  canEdit: boolean;
}

const AnnotationModal = ({
  data,
  editPicture,
  onClose,
  onSave,
  canEdit,
}: AnnotationModalProps) => {
  const { data: session } = useSession();
  const [pictureList, setPictureList] = useState<ModelPicture[]>([]);
  const [tool, setTool] = useState<ShapeType>('rect');
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
    setPictureList(data);

    const index = data.findIndex(p => p.url === editPicture.url);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [data, editPicture]);


  useEffect(() => {
    if (pictureList.length === 0) return;

    const currentPic = pictureList[currentIndex];
    if (!currentPic) return;

    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      setIsImageLoading(false);
    };
    img.src = currentPic.url;
    setIsImageLoading(true);
    setAnnotations(currentPic.annotations ?? []);

    return () => {
      img.onload = null;
    };
  }, [currentIndex, pictureList]);


  useEffect(() => {
    const fetchClassName = async () => {
      try {
        const data = await getClassName();
        setClassNames(data);

        if (data.length > 0 && pictureList.length > 0) {
          setSelectedClass(data[0]);
        }
      } catch (error) {
        console.error("Failed to getClassName:", error);
      }
    };

    fetchClassName();
  }, []);

  const handleMouseDown = (e) => {
    if (selectedId !== null) {
      return;
    }

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();

    const newAnnot = {
      id: `annotation-${Date.now()}`,
      type: tool as ShapeType,
      color: selectedColor, 
      points: [pos.x, pos.y],
      startX: pos.x,
      startY: pos.y,
      width: 0,
      height: 0,
      radius: 0,
      label: { id: selectedClass?.id ?? '', name: selectedClass?.name ?? '' }, // Will be set when mouse up
    };

    setNewAnnotation(newAnnot);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !newAnnotation) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'rect') {
      setNewAnnotation({
        ...newAnnotation,
        width: point.x - newAnnotation.startX,
        height: point.y - newAnnotation.startY,
      });
    } else if (tool === 'circle') {
      const dx = point.x - newAnnotation.startX;
      const dy = point.y - newAnnotation.startY;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setNewAnnotation({
        ...newAnnotation,
        radius: radius,
      });
    } else if (tool === 'polygon') {
      setNewAnnotation({
        ...newAnnotation,
        points: [...newAnnotation.points, point.x, point.y],
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !newAnnotation) return;

    setIsDrawing(false);

    // Don't add empty annotations
    if (tool === 'rect' && (Math.abs(newAnnotation.width) < 5 || Math.abs(newAnnotation.height) < 5)) {
      setNewAnnotation(null);
      return;
    }
    if (tool === 'circle' && newAnnotation.radius < 5) {
      setNewAnnotation(null);
      return;
    }

    // Create annotation with auto-generated label
    const annotationWithLabel = {
      ...newAnnotation,
      label: selectedClass ?? { id: '', name: '' }
    };

    setAnnotations([...annotations, annotationWithLabel]);
    setNewAnnotation(null);

    // Automatically select and start editing the new annotation
    setSelectedId(annotationWithLabel.id);
  };

  const handleDelete = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleBulkUpdateLabels = (updatedClasses: ClassName[]) => {
    setAnnotations(prevAnnotations => {
      // กรองเฉพาะ annotation ที่มี label.id อยู่ใน updatedClasses
      const filtered = prevAnnotations.filter(ann =>
        updatedClasses.some(cls => cls.id === ann.label.id)
      );

      // แทนที่ label ที่ตรงกัน
      const updated = filtered.map(ann => {
        const match = updatedClasses.find(cls => cls.id === ann.label.id);
        return match ? { ...ann, label: match } : ann;
      });

      return updated;
    });

    // เคลียร์ selectedId ถ้าไม่อยู่ใน updatedClasses
    if (!updatedClasses.some(cls => cls.id === selectedId)) {
      setSelectedId(null);
    }
  };

  const handleStageClick = (e) => {
    // Click on empty space
    if (e.target === e.target.getStage() || e.target.hasName('background')) {
      setSelectedId(null);
    }
  };

  const renderAnnotation = (ann) => {
    const isSelected = ann.id === selectedId;

    // Calculate label position
    let labelX = ann.startX;
    let labelY = ann.startY - 15;

    if (ann.type === 'rect') {
      labelX = ann.startX + ann.width / 2;
      labelY = ann.startY - 15;
    } else if (ann.type === 'circle') {
      labelX = ann.startX;
      labelY = ann.startY - ann.radius - 15;
    }

    return (
      <Group key={ann.id}>
        {/* Annotation shape */}
        {ann.type === 'rect' && (
          <Rect
            id={ann.id}
            x={ann.startX}
            y={ann.startY}
            width={ann.width}
            height={ann.height}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={isSelected ? 3 : 2}
            draggable
            onClick={() => setSelectedId(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn = {
                ...ann,
                startX: node.x(),
                startY: node.y(),
              };
              setAnnotations(annotations?.map(a => a.id === ann.id ? updatedAnn : a));
            }}
          />
        )}

        {ann.type === 'circle' && (
          <Circle
            id={ann.id}
            x={ann.startX}
            y={ann.startY}
            radius={ann.radius}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={isSelected ? 3 : 2}
            draggable
            onClick={() => setSelectedId(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn = {
                ...ann,
                startX: node.x(),
                startY: node.y(),
              };
              setAnnotations(annotations?.map(a => a.id === ann.id ? updatedAnn : a));
            }}
          />
        )}

        {ann.type === 'polygon' && ann.points.length > 2 && (
          <Line
            id={ann.id}
            points={ann.points}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={isSelected ? 3 : 2}
            closed
            draggable
            onClick={() => setSelectedId(ann.id)}
          />
        )}

        {/* Label */}
        {ann.label && (
          <Text
            x={labelX}
            y={labelY}
            text={ann.label?.name}
            fontSize={14}
            fontStyle="bold"
            fill={ann.color}
            align="center"
            offsetX={ann.label.length * 3.5}
          />
        )}
      </Group>
    );
  };

 const handleNext = () => {
    if (currentIndex < pictureList.length - 1) {
      updateCurrentAnnotationsToPicture(currentIndex);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      updateCurrentAnnotationsToPicture(currentIndex);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const updateCurrentAnnotationsToPicture = (index) => {
    const updatedPictures = [...pictureList];
    updatedPictures[index] = {
      ...updatedPictures[index],
      annotations: annotations,
    };
    setPictureList(updatedPictures);
  };

  const handleSave = (classname: ClassName[]) => {
    setClassNames(classname);
    handleBulkUpdateLabels(classname);
    setIsOpen(false);
  };

  const onSubmit = async () => {
    // const exportData = {
    //   image: pictureList[currentIndex],
    //   annotations: annotations.map(ann => ({
    //     id: ann.id,
    //     type: ann.type,
    //     color: ann.color,
    //     label: ann.label,
    //     coordinates: ann.type === 'rect'
    //       ? { x: ann.startX, y: ann.startY, width: ann.width, height: ann.height }
    //       : ann.type === 'circle'
    //         ? { x: ann.startX, y: ann.startY, radius: ann.radius }
    //         : { points: ann.points },
    //   })),
    // };

    const exportDataList = pictureList?.map((img) => {
      return {
        id: img.id,
        name: img.name,
        url: img.url,
        annotations: img.annotations?.map(ann => ({
          id: ann.id,
          type: ann.type,
          color: ann.color,
          points: ann.points,
          startX: ann.startX,
          startY: ann.startY,
          width: ann.width,
          height: ann.height,
          radius: ann.radius,
          label: ann.label,
        })),
      };
    });

    const dataStr = JSON.stringify(exportDataList, null, 2);
    console.log("dataStr:", dataStr);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setIsOpen(false);
  };

  const stageWidth = 900;
  const stageHeight = 570;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
  <div className="relative flex flex-col bg-white rounded-xl w-[95%] max-w-7xl h-[82%] p-4 shadow-xl space-y-4 overflow-hidden">

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
      <div className="flex-1 flex flex-col items-center overflow-hidden">
        <div className="relative w-full bg-gray-100 aspect-[16/10] lg:aspect-auto">
          {isImageLoading && <ImageLoading />}
          <Stage
            width={stageWidth}
            height={stageHeight}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onClick={handleStageClick}
            ref={stageRef}
            className="bg-gray-100"
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
              {annotations.map(ann => renderAnnotation(ann))}
              {newAnnotation && renderAnnotation(newAnnotation)}
            </Layer>
          </Stage>
        </div>

        {/* Image Navigation */}
        <ImageNavigator
          currentIndex={currentIndex}
          total={pictureList.length}
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
          <div style={{ width: '94%' }}>
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

  {/* Class Name Modal */}
  {isOpen && (
    <ClassNameModal
      onClose={() => setIsOpen(false)}
      onSave={handleSave}
      data={classNames}
    />
  )}
</div>

  );
}

interface ToolSelectorProps {
  tool: ShapeType | 'select';
  setTool: (id: ShapeType) => void;
}
function AnnotationToolSelector ({ tool, setTool }: ToolSelectorProps) {
  const tools: { id: ShapeType; label: string; icon?: JSX.Element }[] = [
    { id: 'select', label: 'Select', icon: <MousePointerClick size={24} /> },
    { id: 'rect', label: 'Rectangle', icon: <Square size={24} /> },
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
            className={`flex items-center space-x-2 px-1 py-1 rounded border ${
              tool === id ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
function ClassSelector({classNames, selectedClass, setSelectedClass, setIsOpen}: ClassSelectorProps) {
  return (
    <div className="mt-4 mb-6">
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
function AnnotationList({annotations, selectedId, setSelectedId, onDelete}: AnnotationListProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Annotations List</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {annotations.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">No annotations yet</p>
        ) : (
          annotations.map((ann, index) => {
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
                      <span className="font-medium text-sm">#{index + 1}</span>
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
                      <p className="text-sm font-medium">{ann.label.name}</p>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(ann.id);
                    }}
                    className="text-red-500 hover:text-red-700"
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
  onPrevious:() => void;
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


export default  AnnotationModal