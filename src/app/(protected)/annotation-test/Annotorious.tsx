
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, Trash2, Square, Circle as CircleIcon, Edit3, Hexagon, Type, Save, RefreshCw } from 'lucide-react';

// Annotorious type definitions
declare global {
  interface Window {
    Annotorious: any;
  }
}

const AnnotoriousImplementation = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const annotoriousRef = useRef<any>(null);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<any>(null);
  const [tool, setTool] = useState<string>('rect');
  const [defectType, setDefectType] = useState<string>('defect');
  const [labelCounter, setLabelCounter] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  // Defect categories
  const defectCategories = [
    { id: 'defect', name: 'General Defect', color: '#ff4444', prefix: 'DEF' },
    { id: 'scratch', name: 'Scratch', color: '#ff8800', prefix: 'SCR' },
    { id: 'dent', name: 'Dent', color: '#8800ff', prefix: 'DNT' },
    { id: 'missing', name: 'Missing Part', color: '#ff0088', prefix: 'MIS' },
    { id: 'crack', name: 'Crack', color: '#0088ff', prefix: 'CRK' },
  ];

  // Generate auto label
  const generateAutoLabel = (type: string) => {
    const category = defectCategories.find(c => c.id === type);
    const prefix = category?.prefix || 'DEF';
    const label = `${prefix}-${String(labelCounter).padStart(3, '0')}`;
    setLabelCounter(prev => prev + 1);
    return label;
  };

  // Initialize Annotorious
  useEffect(() => {
    let anno: any = null;

    const loadAnnotorious = async () => {
      try {
        // Load Annotorious from CDN
        if (!window.Annotorious) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@recogito/annotorious@2.7.10/dist/annotorious.min.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // Load CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/@recogito/annotorious@2.7.10/dist/annotorious.min.css';
          document.head.appendChild(link);
        }

        // Wait for image to load
        if (imageRef.current && imageRef.current.complete && window.Annotorious) {
          initializeAnnotorious();
        }
      } catch (error) {
        console.error('Failed to load Annotorious:', error);
        setImageError(true);
      }
    };

    const initializeAnnotorious = () => {
      if (!imageRef.current || !window.Annotorious) return;

      try {
        // Initialize Annotorious
        anno = new window.Annotorious({
          image: imageRef.current,
          locale: 'en',
          allowEmpty: false,
          widgets: [
            {
              widget: 'COMMENT',
              editable: true
            },
            {
              widget: 'TAG',
              vocabulary: defectCategories.map(c => c.name)
            }
          ]
        });

        annotoriousRef.current = anno;

        // Custom formatter for colored annotations
        anno.formatters = [{
          formatter: (annotation: any) => {
            const defectTag = annotation.body?.find((b: any) => b.purpose === 'tagging')?.value;
            const category = defectCategories.find(c => c.name === defectTag);
            const className = category ? `defect-${category.id}` : 'defect-default';
            return className;
          }
        }];

        // Event handlers
        anno.on('createAnnotation', (annotation: any) => {
          handleAnnotationCreate(annotation);
        });

        anno.on('updateAnnotation', (annotation: any, previous: any) => {
          handleAnnotationUpdate(annotation, previous);
        });

        anno.on('deleteAnnotation', (annotation: any) => {
          handleAnnotationDelete(annotation);
        });

        anno.on('selectAnnotation', (annotation: any) => {
          setSelectedAnnotation(annotation);
        });

        anno.on('cancelSelected', () => {
          setSelectedAnnotation(null);
        });

        // Set initial tool
        setCurrentTool(tool);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Annotorious:', error);
        setImageError(true);
      }
    };

    // Load Annotorious
    loadAnnotorious();

    // Cleanup
    return () => {
      if (anno) {
        anno.destroy();
      }
    };
  }, []);

  // Handle annotation creation
  const handleAnnotationCreate = (annotation: any) => {
    // Add auto-generated label
    const label = generateAutoLabel(defectType);
    const category = defectCategories.find(c => c.id === defectType);
    
    const enhancedAnnotation = {
      ...annotation,
      body: [
        {
          type: 'TextualBody',
          purpose: 'commenting',
          value: label
        },
        {
          type: 'TextualBody',
          purpose: 'tagging',
          value: category?.name || 'General Defect'
        }
      ],
      defectType: defectType
    };

    // Update annotation with label
    annotoriousRef.current?.updateAnnotation(annotation, enhancedAnnotation);
    
    setAnnotations(prev => [...prev, enhancedAnnotation]);
  };

  // Handle annotation update
  const handleAnnotationUpdate = (annotation: any, previous: any) => {
    setAnnotations(prev => prev.map(ann => ann.id === previous.id ? annotation : ann));
  };

  // Handle annotation deletion
  const handleAnnotationDelete = (annotation: any) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== annotation.id));
  };

  // Set drawing tool
  const setCurrentTool = (toolName: string) => {
    if (!annotoriousRef.current) return;

    switch (toolName) {
      case 'rect':
        annotoriousRef.current.setDrawingTool('rect');
        break;
      case 'polygon':
        annotoriousRef.current.setDrawingTool('polygon');
        break;
      case 'circle':
        // Annotorious doesn't have native circle, use ellipse
        annotoriousRef.current.setDrawingTool('ellipse');
        break;
      case 'freehand':
        annotoriousRef.current.setDrawingTool('freehand');
        break;
      default:
        annotoriousRef.current.setDrawingTool('rect');
    }
    setTool(toolName);
  };

  // Delete selected annotation
  const handleDeleteSelected = () => {
    if (selectedAnnotation && annotoriousRef.current) {
      annotoriousRef.current.removeAnnotation(selectedAnnotation);
      setSelectedAnnotation(null);
    }
  };

  // Clear all annotations
  const handleClearAll = () => {
    if (annotoriousRef.current) {
      annotoriousRef.current.clearAnnotations();
      setAnnotations([]);
      setLabelCounter(1);
    }
  };

  // Export annotations
  const handleExport = () => {
    const exportData = {
      image: imageRef.current?.src || '',
      annotations: annotations.map(ann => ({
        id: ann.id,
        type: ann.target?.selector?.type || 'unknown',
        defectType: ann.defectType || 'defect',
        label: ann.body?.find((b: any) => b.purpose === 'commenting')?.value || '',
        tag: ann.body?.find((b: any) => b.purpose === 'tagging')?.value || '',
        geometry: ann.target?.selector?.value || ann.target?.selector,
        timestamp: ann.created || new Date().toISOString()
      })),
      exportDate: new Date().toISOString(),
      totalDefects: annotations.length
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotorious_annotations_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import annotations
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.annotations && Array.isArray(data.annotations)) {
          // Clear existing annotations
          handleClearAll();
          
          // Add imported annotations
          data.annotations.forEach((ann: any) => {
            const annotation = {
              '@context': 'http://www.w3.org/ns/anno.jsonld',
              type: 'Annotation',
              id: ann.id || `#${Date.now()}-${Math.random()}`,
              body: [
                {
                  type: 'TextualBody',
                  purpose: 'commenting',
                  value: ann.label || ''
                },
                {
                  type: 'TextualBody',
                  purpose: 'tagging',
                  value: ann.tag || 'General Defect'
                }
              ],
              target: {
                source: imageRef.current?.src,
                selector: ann.geometry
              },
              defectType: ann.defectType
            };
            
            annotoriousRef.current?.addAnnotation(annotation);
          });
        }
      } catch (error) {
        console.error('Failed to import annotations:', error);
        alert('Failed to import annotations. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Annotorious Implementation for Product Inspection</h1>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Tool Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTool('rect')}
              className={`p-2 rounded ${tool === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Rectangle"
            >
              <Square size={20} />
            </button>
            <button
              onClick={() => setCurrentTool('circle')}
              className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Circle/Ellipse"
            >
              <CircleIcon size={20} />
            </button>
            <button
              onClick={() => setCurrentTool('polygon')}
              className={`p-2 rounded ${tool === 'polygon' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Polygon"
            >
              <Hexagon size={20} />
            </button>
            <button
              onClick={() => setCurrentTool('freehand')}
              className={`p-2 rounded ${tool === 'freehand' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              title="Freehand"
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

          {/* Action Buttons */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleDeleteSelected}
              disabled={!selectedAnnotation}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
            <button
              onClick={handleClearAll}
              disabled={annotations.length === 0}
              className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Clear All
            </button>
            <button
              onClick={handleExport}
              disabled={annotations.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300 flex items-center gap-2"
            >
              <Download size={16} />
              Export ({annotations.length})
            </button>
            <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer flex items-center gap-2">
              <Save size={16} />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Annotation Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
                  <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                    <p className="mt-2">Loading Annotorious...</p>
                  </div>
                </div>
              )}
              
              {imageError ? (
                <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
                  <p className="text-red-500">Failed to load image or Annotorious library</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Reload Page
                  </button>
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src="https://picsum.photos/800/600?random=1"
                  alt="Product for inspection"
                  className="w-full rounded"
                  crossOrigin="anonymous"
                  onLoad={() => {
                    if (window.Annotorious && annotoriousRef.current === null) {
                      // Re-initialize if needed
                      setTimeout(() => {
                        const event = new Event('annotorious-init');
                        window.dispatchEvent(event);
                      }, 100);
                    }
                  }}
                />
              )}
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> Select a tool and defect type, then draw on the image. 
                Annotations are automatically labeled. Click on annotations to select them. 
                Use the comment field in the popup to edit labels.
              </p>
            </div>
          </div>
        </div>

        {/* Annotations List */}
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
                    const label = ann.body?.find((b: any) => b.purpose === 'commenting')?.value || 'Unlabeled';
                    const tag = ann.body?.find((b: any) => b.purpose === 'tagging')?.value || 'General Defect';
                    const category = defectCategories.find(c => c.name === tag);
                    const isSelected = selectedAnnotation?.id === ann.id;

                    return (
                      <div
                        key={ann.id}
                        onClick={() => {
                          if (annotoriousRef.current) {
                            annotoriousRef.current.selectAnnotation(ann);
                          }
                        }}
                        className={`p-3 rounded cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                        } border`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">#{index + 1}</span>
                              <span 
                                className="text-xs px-2 py-1 rounded text-white"
                                style={{ backgroundColor: category?.color || '#888' }}
                              >
                                {tag}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{label}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {new Date(ann.created || Date.now()).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Summary */}
            {annotations.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Summary</h3>
                <div className="space-y-1 text-sm">
                  {defectCategories.map(cat => {
                    const count = annotations.filter(ann => {
                      const tag = ann.body?.find((b: any) => b.purpose === 'tagging')?.value;
                      return tag === cat.name;
                    }).length;
                    
                    if (count === 0) return null;
                    
                    return (
                      <div key={cat.id} className="flex justify-between">
                        <span>{cat.name}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles for Annotorious */}
      <style jsx global>{`
        .a9s-annotation.defect-defect {
          stroke: #ff4444 !important;
          stroke-width: 2px !important;
          fill: rgba(255, 68, 68, 0.2) !important;
        }
        
        .a9s-annotation.defect-scratch {
          stroke: #ff8800 !important;
          stroke-width: 2px !important;
          fill: rgba(255, 136, 0, 0.2) !important;
        }
        
        .a9s-annotation.defect-dent {
          stroke: #8800ff !important;
          stroke-width: 2px !important;
          fill: rgba(136, 0, 255, 0.2) !important;
        }
        
        .a9s-annotation.defect-missing {
          stroke: #ff0088 !important;
          stroke-width: 2px !important;
          fill: rgba(255, 0, 136, 0.2) !important;
        }
        
        .a9s-annotation.defect-crack {
          stroke: #0088ff !important;
          stroke-width: 2px !important;
          fill: rgba(0, 136, 255, 0.2) !important;
        }
        
        .a9s-annotation.selected {
          stroke-width: 3px !important;
        }
        
        .a9s-widget {
          background: white !important;
          border: 1px solid #ddd !important;
          border-radius: 4px !important;
        }
        
        .a9s-comment-widget textarea {
          font-size: 14px !important;
          padding: 8px !important;
        }
        
        .a9s-tag-widget {
          margin-top: 8px !important;
        }
        
        .a9s-tag-widget .a9s-autocomplete {
          font-size: 14px !important;
        }
      `}</style>
    </div>
  );
};

export default AnnotoriousImplementation;