// src/app/(protected)/annotation-test/KonvaInlineAnnotation.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';
import { Save, Download, Trash2, Square, Circle as CircleIcon, Edit3, Type, Edit2, Check, X } from 'lucide-react';

const KonvaInlineAnnotation = () => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState('rect');
  const [isDrawing, setIsDrawing] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState(null);
  const [defectType, setDefectType] = useState('defect');
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [autoLabelPrefix, setAutoLabelPrefix] = useState('');
  const [labelCounter, setLabelCounter] = useState(1);
  const stageRef = useRef();
  const [imageObj, setImageObj] = useState(null);

  // Defect categories for product inspection
  const defectCategories = [
    { id: 'defect', name: 'General Defect', color: '#ff4444', prefix: 'DEF' },
    { id: 'scratch', name: 'Scratch', color: '#ff8800', prefix: 'SCR' },
    { id: 'dent', name: 'Dent', color: '#8800ff', prefix: 'DNT' },
    { id: 'missing', name: 'Missing Part', color: '#ff0088', prefix: 'MIS' },
    { id: 'crack', name: 'Crack', color: '#0088ff', prefix: 'CRK' },
  ];

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageObj(img);
    };
    img.src = 'https://picsum.photos/800/600?random=1';
  }, []);

  // Update auto label prefix when defect type changes
  useEffect(() => {
    const category = defectCategories.find(c => c.id === defectType);
    setAutoLabelPrefix(category?.prefix || 'DEF');
  }, [defectType]);

  // Generate auto label
  const generateAutoLabel = () => {
    const label = `${autoLabelPrefix}-${String(labelCounter).padStart(3, '0')}`;
    setLabelCounter(labelCounter + 1);
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
      color: category.color,
      points: [pos.x, pos.y],
      startX: pos.x,
      startY: pos.y,
      width: 0,
      height: 0,
      radius: 0,
      label: '', // Will be set when mouse up
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
    
    // Create annotation with auto-generated label
    const annotationWithLabel = {
      ...newAnnotation,
      label: generateAutoLabel()
    };
    
    setAnnotations([...annotations, annotationWithLabel]);
    setNewAnnotation(null);
    
    // Automatically select and start editing the new annotation
    setSelectedId(annotationWithLabel.id);
    setEditingId(annotationWithLabel.id);
    setEditingLabel(annotationWithLabel.label);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      setAnnotations(annotations.filter(ann => ann.id !== selectedId));
      setSelectedId(null);
      setEditingId(null);
    }
  };

  const handleStartEdit = (id) => {
    const annotation = annotations.find(ann => ann.id === id);
    if (annotation) {
      setEditingId(id);
      setEditingLabel(annotation.label);
      setSelectedId(id);
    }
  };

  const handleUpdateLabel = () => {
    if (editingId && editingLabel.trim()) {
      setAnnotations(annotations.map(ann => 
        ann.id === editingId ? { ...ann, label: editingLabel } : ann
      ));
    }
    setEditingId(null);
    setEditingLabel('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLabel('');
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

  const exportAnnotations = () => {
    const exportData = {
      image: 'https://picsum.photos/800/600?random=1',
      annotations: annotations.map(ann => ({
        id: ann.id,
        type: ann.type,
        defectType: ann.defectType,
        label: ann.label,
        coordinates: ann.type === 'rect' 
          ? { x: ann.startX, y: ann.startY, width: ann.width, height: ann.height }
          : ann.type === 'circle'
          ? { x: ann.startX, y: ann.startY, radius: ann.radius }
          : { points: ann.points },
        timestamp: ann.timestamp,
      })),
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
            onDblClick={() => handleStartEdit(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn = {
                ...ann,
                startX: node.x(),
                startY: node.y(),
              };
              setAnnotations(annotations.map(a => a.id === ann.id ? updatedAnn : a));
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
            onDblClick={() => handleStartEdit(ann.id)}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn = {
                ...ann,
                startX: node.x(),
                startY: node.y(),
              };
              setAnnotations(annotations.map(a => a.id === ann.id ? updatedAnn : a));
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
            onDblClick={() => handleStartEdit(ann.id)}
          />
        )}
        
        {/* Label */}
        {ann.label && !isEditing && (
          <Text
            x={labelX}
            y={labelY}
            text={ann.label}
            fontSize={14}
            fontStyle="bold"
            fill={ann.color}
            align="center"
            offsetX={ann.label.length * 3.5}
            onClick={() => handleStartEdit(ann.id)}
            onDblClick={() => handleStartEdit(ann.id)}
          />
        )}
      </Group>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inline Annotation Tool (No Dialog)</h1>
      
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Tool Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setTool('rect')}
              className={`p-2 rounded ${tool === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Rectangle"
            >
              <Square size={20} />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Circle"
            >
              <CircleIcon size={20} />
            </button>
            <button
              onClick={() => setTool('polygon')}
              className={`p-2 rounded ${tool === 'polygon' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Polygon"
            >
              <Edit3 size={20} />
            </button>
          </div>

          {/* Defect Type Selection */}
          <select
            value={defectType}
            onChange={(e) => setDefectType(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            {defectCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Auto Label Prefix Display */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
            <Type size={16} />
            <span className="text-sm">Auto Label: <strong>{autoLabelPrefix}-{String(labelCounter).padStart(3, '0')}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleDelete}
              disabled={selectedId === null}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
            <button
              onClick={exportAnnotations}
              disabled={annotations.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Download size={16} />
              Export ({annotations.length})
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="border-2 border-gray-300 rounded">
              <Stage
                width={710}
                height={600}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onClick={handleStageClick}
                ref={stageRef}
              >
                <Layer>
                  {/* Background Image */}
                  {imageObj && (
                    <Rect
                      name="background"
                      width={710}
                      height={600}
                      fillPatternImage={imageObj}
                      fillPatternScaleX={800 / imageObj.width}
                      fillPatternScaleY={600 / imageObj.height}
                    />
                  )}
                  
                  {/* Render existing annotations */}
                  {annotations.map(ann => renderAnnotation(ann))}
                  
                  {/* Render annotation being drawn */}
                  {newAnnotation && renderAnnotation(newAnnotation)}
                </Layer>
              </Stage>
            </div>
            
            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> Draw annotations and they'll be auto-labeled. 
                Click on a label in the list to edit it inline. 
                Double-click on annotations to edit labels directly on canvas.
                Press Enter to save, Escape to cancel.
              </p>
            </div>
          </div>
        </div>

        {/* Annotations List with Inline Editing */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Annotations ({annotations.length})</h2>
            
            {/* Category Legend */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Defect Categories</h3>
              <div className="space-y-1">
                {defectCategories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span>{cat.name} ({cat.prefix})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annotations List */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Detected Defects</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {annotations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No annotations yet</p>
                ) : (
                  annotations.map((ann, index) => {
                    const category = defectCategories.find(c => c.id === ann.defectType);
                    const isEditing = editingId === ann.id;
                    
                    return (
                      <div
                        key={ann.id}
                        onClick={() => !isEditing && setSelectedId(ann.id)}
                        className={`p-3 rounded cursor-pointer transition-colors ${
                          selectedId === ann.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                        } border`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">#{index + 1}</span>
                              <span 
                                className="text-xs px-2 py-1 rounded text-white"
                                style={{ backgroundColor: category?.color }}
                              >
                                {category?.name}
                              </span>
                            </div>
                            
                            {/* Inline Label Editing */}
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
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
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{ann.label}</p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEdit(ann.id);
                                  }}
                                  className="text-gray-500 hover:text-blue-500 opacity-0 group-hover:opacity-100"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <span className="text-xs text-gray-500">{ann.type}</span>
                        </div>
                        
                        <div className="text-xs text-gray-600 mt-1">
                          {new Date(ann.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {annotations.length > 0 && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KonvaInlineAnnotation;