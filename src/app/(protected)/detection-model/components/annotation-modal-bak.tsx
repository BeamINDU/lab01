"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';
import { X, Save, Download, Trash2, Square, CircleIcon, PenTool, MousePointerClick, Edit3, Type, Edit2, Check, CheckIcon, ChevronUp, ChevronDown, CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { FormData, DetectionModel, ModelPicture } from "@/app/types/detection-model";
import ImageLoading from "@/app/components/loading/ImageLoading";
import { ClassName } from "@/app/types/class-name";
import ClassNameModal from "./class-name-modal";
// import KonvaAnnotation from '@/app/components/annotation/KonvaAnnotation';
// import { useAnnotationStore } from '@/app/stores/useAnnotationStore';
import { getClassName } from "@/app/libs/services/class-name";
import { nanoid } from 'nanoid';

import dynamic from 'next/dynamic';
// const Canvas = dynamic(() => import('@/components/Canvas'), { ssr: false });
// const KonvaAnnotation = dynamic(() => import('@/app/components/annotation/KonvaAnnotation'), {
//   ssr: false,
// });


//----------------------------------------------------------------------------

type ImageData = {
  image: {
    id: number;
    name: string;
    url: string;
  };
  annotations: string;
};


//----------------------------------------------------------------------------

type DefectCategory = {
  id: string
  name: string
  color: string
  prefix: string
}
const defectCategories: DefectCategory[] = [
  { id: 'defect', name: 'General Defect', color: '#ff4444', prefix: 'DEF' },
  { id: 'scratch', name: 'Scratch', color: '#ff8800', prefix: 'SCR' },
  { id: 'dent', name: 'Dent', color: '#8800ff', prefix: 'DNT' },
  { id: 'missing', name: 'Missing Part', color: '#ff0088', prefix: 'MIS' },
  { id: 'crack', name: 'Crack', color: '#0088ff', prefix: 'CRK' },
];


type ShapeType = 'rect' | 'circle' | 'polygon';
type ToolType = ShapeType | 'select';
const tools: { id: ToolType; label: string; icon?: JSX.Element }[] = [
  // { id: 'select', label: 'Select', icon: <MousePointerClick size={24} /> },
  { id: 'rect', label: 'Rectangle', icon: <Square size={24} /> },
  { id: 'circle', label: 'Circle', icon: <CircleIcon size={24} /> },
  { id: 'polygon', label: 'Polygon', icon: <Edit3 size={24} /> },
];


type Annotation = {
  id: string
  type: string
  defectType: string
  color?: string
  points: number[]
  startX: number
  startY: number
  width: number
  height: number
  radius: number
  label: { id: string, name: string},
};




const annotations = [
  {
    id: "annotation-1748802052373",
    type: "rect",
    defectType: "defect",
    label: {
      id: "1",
      name: "houseclip missing"
    },
    coordinates: {
      x: 459,
      y: 278.125,
      width: 126,
      height: 89
    }
  },
  {
    id: "annotation-1748802054989",
    type: "rect",
    defectType: "defect",
    label: {
      id: "1",
      name: "houseclip missing"
    },
    coordinates: {
      x: 220,
      y: 353.125,
      width: 122,
      height: 94
    }
  },
  {
    id: "annotation-1748802057604",
    type: "circle",
    defectType: "defect",
    label: {
      id: "1",
      name: "houseclip missing"
    },
    coordinates: {
      x: 142,
      y: 160.125,
      radius: 50.11985634456667
    }
  },
  {
    id: "annotation-1748802058699",
    type: "circle",
    defectType: "defect",
    label: {
      id: "1",
      name: "houseclip missing"
    },
    coordinates: {
      x: 355,
      y: 149.125,
      radius: 48.30113870293329
    }
  },
  {
    id: "annotation-1748802110167",
    type: "circle",
    defectType: "scratch",
    label: {
      id: "2",
      name: "Good clip"
    },
    coordinates: {
      x: 529,
      y: 124.125,
      radius: 33.28663395418648
    }
  },
  {
    id: "annotation-1748802128204",
    type: "circle",
    defectType: "scratch",
    label: {
      id: "2",
      name: "Good clip"
    },
    coordinates: {
      x: 613,
      y: 427.125,
      radius: 43.41658669218482
    }
  }
];


//----------------------------------------------------------------------------

interface AnnotationModalProps {
  pictureList: ModelPicture[];
  editPicture: ModelPicture,
  onClose: () => void;
  onSave: () => void;
  canEdit: boolean;
}

export default function AnnotationModal({
  pictureList,
  editPicture,
  onClose,
  onSave,
  canEdit,
}: AnnotationModalProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [classNames, setClassNames] = useState<ClassName[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassName | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState('rect');
  const [isDrawing, setIsDrawing] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState<Annotation | null>(null);
  const [defectType, setDefectType] = useState('defect');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<ClassName | null>(null);
  const [autoLabelPrefix, setAutoLabelPrefix] = useState('');
  const [labelCounter, setLabelCounter] = useState(1);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (pictureList.length === 0 || !editPicture) return;

    const index = pictureList.findIndex(p => p.url === editPicture.url);
    if (index !== -1) {
      setCurrentImageIndex(index);
    }
  }, [pictureList, editPicture]);


  useEffect(() => {
    if (pictureList.length === 0) return;

    const currentPic = pictureList[currentImageIndex];
    if (!currentPic) return;

    setIsImageLoading(true);
    
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
      setIsImageLoading(false);
    };

    if (!currentPic.url) return;
    img.src = currentPic.url; 

    return () => {
      img.onload = null;
    };
  }, [currentImageIndex, pictureList]);


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
  

  // Update auto label prefix when defect type changes
  useEffect(() => {
    const category = defectCategories.find(c => c.id === defectType);
    setAutoLabelPrefix(category?.prefix || 'DEF');
  }, [defectType]);

  // Generate auto label
  const generateAutoLabel = () => {
    // const label = `${autoLabelPrefix}-${String(labelCounter).padStart(3, '0')}`;
    // setLabelCounter(labelCounter + 1);
    const label = selectedClass;
    return label;
  };

  const handleMouseDown = (e) => {
    if (selectedId !== null || editingId !== null) {
      return;
    }

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const category = defectCategories.find(c => c.id === defectType);

    const newAnnot = {
      id: `annotation-${Date.now()}`,
      type: tool,
      defectType: defectType,
      color: category?.color,
      points: [pos.x, pos.y],
      startX: pos.x,
      startY: pos.y,
      width: 0,
      height: 0,
      radius: 0,
      label: { id: selectedClass?.id ?? '', name: selectedClass?.name ?? ''}, // Will be set when mouse up
      timestamp: new Date().toISOString(),
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
    
    const autoLabel = generateAutoLabel();

    // Create annotation with auto-generated label
    const annotationWithLabel = {
      ...newAnnotation,
      label: autoLabel ?? { id: '', name: '' }
    };

    setAnnotations([...annotations, annotationWithLabel]);
    setNewAnnotation(null);

    // Automatically select and start editing the new annotation
    setSelectedId(annotationWithLabel.id);
    // setEditingId(annotationWithLabel.id);
    setEditingLabel(annotationWithLabel.label);
  };

  const handleDelete = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    if (editingId === id) {
      setEditingId(null);
      setEditingLabel(null);
    }
  };

  const handleStartEdit = (id: string) => {
    const annotation = annotations?.find(ann => ann.id === id) as Annotation;
    if (annotation) {
      setEditingId(id);
      setEditingLabel(annotation.label);
      setSelectedId(id);
    }
  };

  const handleUpdateLabel = () => {
    if (editingId && editingLabel) {
      setAnnotations(annotations?.map(ann =>
        ann.id === editingId ? { ...ann, label: editingLabel } : ann
      ));
    }
    setEditingId(null);
    setEditingLabel(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLabel(null);
  };

  const handleStageClick = (e) => {
    // Click on empty space
    if (e.target === e.target.getStage() || e.target.hasName('background')) {
      setSelectedId(null);
      if (editingId) {
        handleUpdateLabel();
      }
    }
  };

  const renderAnnotation = (ann) => {
    const isSelected = ann.id === selectedId;
    const isEditing = ann.id === editingId;

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
            // onDblClick={() => handleStartEdit(ann.id)}
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
            // onDblClick={() => handleStartEdit(ann.id)}
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
            // onDblClick={() => handleStartEdit(ann.id)}
          />
        )}

        {/* Label */}
        {ann.label && !isEditing && (
          <Text
            x={labelX}
            y={labelY}
            text={ann.label?.name}
            fontSize={14}
            fontStyle="bold"
            fill={ann.color}
            align="center"
            offsetX={ann.label.length * 3.5}
            // onClick={() => handleStartEdit(ann.id)}
            // onDblClick={() => handleStartEdit(ann.id)}
          />
        )}
      </Group>
    );
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setAnnotations([]);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < pictureList.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setAnnotations([]);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => { }, []);

  const handleSave = (classname: ClassName[]) => {
    setClassNames(classname);
    setIsOpen(false);
  };

  const onSubmit = async () => {
    const exportData = {
      image: pictureList[currentImageIndex],
      annotations: annotations?.map(ann => ({
        id: ann.id,
        type: ann.type,
        defectType: ann.defectType,
        label: ann.label,
        coordinates: ann.type === 'rect'
          ? { x: ann.startX, y: ann.startY, width: ann.width, height: ann.height }
          : ann.type === 'circle'
            ? { x: ann.startX, y: ann.startY, radius: ann.radius }
            : { points: ann.points },
      })),
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    console.log("dataStr:", dataStr);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    // setCheckboxes(classname);
    setIsOpen(false);
  };

  const stageWidth = 900;
  const stageHeight = 600;

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
        <div className="relative flex flex-col bg-white rounded-xl w-[90%] max-w-7xl h-[85%] p-4 shadow-xl space-y-4">

          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="text-red-500" size={24} />
          </button>

          <h2 className="text-2xl font-semibold text-center">Edit</h2>

          {/* Main Content Area */}
          <div className="flex flex-1 space-x-4 overflow-hidden">

            {/* Tool Selection */}
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

            {/* Image Viewer */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-[100vh] bg-gray-100">
                <div className="w-full h-full">
                  {isImageLoading && (
                    <ImageLoading />
                  )}
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
                      {/* Background Image */}
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

                      {/* Render existing annotations */}
                      {annotations?.map(ann => renderAnnotation(ann))}

                      {/* Render annotation being drawn */}
                      {newAnnotation && renderAnnotation(newAnnotation)}

                    </Layer>
                  </Stage>
                </div>
              </div>

              {/* Image Navigation */}
              <div className="flex justify-between w-full mt-4">
                {/* Previous Image */}
                <div
                  className={`flex items-center gap-1 text-sm cursor-pointer ${currentImageIndex === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"
                    }`}
                  onClick={() => {
                    if (currentImageIndex > 0) handlePrevious();
                  }}
                  aria-disabled={currentImageIndex === 0}
                >
                  <CircleChevronLeft size={35} />
                  <span>Previous Image</span>
                </div>
                {/* Next Image */}
                <div
                  className={`flex items-center gap-1 text-sm cursor-pointer ${currentImageIndex === pictureList.length - 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"
                    }`}
                  onClick={() => {
                    if (currentImageIndex < pictureList.length - 1) handleNext();
                  }}
                  aria-disabled={currentImageIndex === pictureList.length - 1}
                >
                  <span>Next Image</span>
                  <CircleChevronRight size={35} />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-64 overflow-y-auto">
              
              {/*  Defect Type Selection */}
              <div className="">
                <h3 className="text-sm font-medium mb-2">Defect Categories</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full">
                    <select
                      value={defectType}
                      onChange={(e) => setDefectType(e.target.value)}
                      className="w-full px-2 py-2 border rounded text-base"
                      style={{
                        color: defectCategories.find(cat => cat.id === defectType)?.color || '#000',
                        fontSize: '1rem',
                        fontWeight: '500',
                      }}
                    >
                      {defectCategories.map((cat) => (
                        <option 
                          key={cat.id} 
                          value={cat.id}
                          style={{
                            color: cat.color,
                          }}
                        >
                          ■ {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Box Class */}
              <div className="mt-4 mb-6">
                {/* Header with button aligned right */}
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
                <div className="space-y-4 text-sm">
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
                  {/* <div className="flex justify-center">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="mt-2 text-xs px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      Add new class
                    </button>
                  </div> */}
                </div>
              </div>

              {/* Annotations List */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Detected Defects</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {annotations.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No annotations yet</p>
                  ) : (
                    annotations?.map((ann, index) => {
                      const category = defectCategories.find(c => c.id === ann.defectType);
                      const isEditing = editingId === ann.id;

                      return (
                        <div
                          key={ann.id}
                          onClick={() => !isEditing && setSelectedId(ann.id)}
                          className={`p-3 rounded cursor-pointer transition-colors ${selectedId === ann.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                            } border`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">#{index + 1}</span>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: category?.color,
                                    borderRadius: '2px',
                                    marginRight: '2px',
                                  }}
                                ></span>
                                <p className="text-sm font-medium">{ann.label.name}</p>
                                {/* <span
                                  className="text-xs px-2 py-1 rounded text-white"
                                  style={{ backgroundColor: category?.color }}
                                >
                                  {category?.name}
                                </span> */}
                              </div>

                              {/* Inline Label Editing */}
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  {/* <input
                                    type="text"
                                    value={editingLabel}
                                    onChange={(e) => setEditingLabel(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') handleUpdateLabel();
                                      if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                    className="flex-1 px-2 py-1 text-sm border rounded"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateLabel();
                                    }}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelEdit();
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X size={16} />
                                  </button> */}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  {/* <p className="text-sm font-medium">{ann.label}</p> */}
                                  {/* <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEdit(ann.id);
                                    }}
                                    className="text-gray-500 hover:text-blue-500 group-hover:opacity-100"
                                  >
                                    <Edit2 size={14} />
                                  </button> */}
                                </div>
                              )}
                            </div>
                            {/* <span className="text-xs text-gray-500">{ann.type}</span> */}
                            {/* Delete button */}
                            {!isEditing && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(ann.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Delete annotation"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          {/* <div className="text-xs text-gray-600 mt-1">
                            {new Date(ann.timestamp).toLocaleTimeString()}
                          </div> */}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {/* {annotations.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Summary</h3>
                  <div className="space-y-1 text-sm">
                    {defectCategories.map(cat => {
                      const count = annotations.filter(a => a.defectType === cat.id).length;
                      if (count === 0) return null;
                      return (
                        <div key={cat.id} className="flex justify-between">
                          <span>{cat.name}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Total Defects:</span>
                      <span>{annotations.length}</span>
                    </div>
                  </div>
                </div>
              )} */}

              
              {/* Setting */}
              {/* <div className='mt-10'>
                <h3 className="font-semibold mb-2">Setting</h3>
                <div className="text-sm space-y-2">
                  {["Transparent", "Grayscale", "Brightness", "Rotate"].map((label, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <label>{label}</label>
                      <input type="range" min="0" max={label === "Rotate" ? 360 : 100} defaultValue={label === "Brightness" ? 90 : 80} />
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Save & Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            {/* Save Button */}
            {canEdit && (
              <button
                // type="submit"
                className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2"
                onClick={onSubmit}
              >
                Save
                <Save size={16} />
              </button>
            )}
            {/* Cancel Button */}
            <button
              type="button"
              className="px-4 py-2 bg-secondary rounded flex items-center gap-2"
              onClick={onClose}
            >
              Close
              <X size={16} />
            </button>
          </div>
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
    </>
  );
}
