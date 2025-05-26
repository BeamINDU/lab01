import React, { useEffect, useRef, useState } from 'react';
import { Save, Download, Upload, RotateCcw, Eye, EyeOff, Settings } from 'lucide-react';

// หมายเหตุ: ในการใช้งานจริง คุณจะต้องติดตั้ง Annotorious ก่อน
// npm install @recogito/annotorious
// import { Annotorious } from '@recogito/annotorious';
// import '@recogito/annotorious/dist/annotorious.min.css';

const AnnotoriousImplementation = () => {
  const [annotations, setAnnotations] = useState([]);
  const [currentImage, setCurrentImage] = useState('https://picsum.photos/800/600?random=1');
  const [selectedTool, setSelectedTool] = useState('rect');
  const [selectedCategory, setSelectedCategory] = useState('defect');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // References สำหรับ Annotorious
  const imageRef = useRef(null);
  const annoRef = useRef(null);
  
  // Mock Annotorious สำหรับ demo (ในการใช้งานจริงจะเป็น Annotorious library)
  const [annotoriousReady, setAnnotoriousReady] = useState(false);
  
  // การกำหนดหมวดหมู่ defect ที่จะใช้ใน vocabulary
  const defectCategories = [
    { id: 'defect', name: 'Defect', color: '#ff4444' },
    { id: 'missing', name: 'Missing Part', color: '#ff8800' },
    { id: 'damage', name: 'Damage', color: '#8800ff' },
    { id: 'good', name: 'Good Area', color: '#00ff44' },
    { id: 'crack', name: 'Crack', color: '#ff0088' },
    { id: 'scratch', name: 'Scratch', color: '#0088ff' }
  ];

  // การตั้งค่า Annotorious เมื่อรูปภาพโหลดเสร็จ
  useEffect(() => {
    if (!isImageLoaded || !imageRef.current) return;
    
    console.log('🎯 Initializing Annotorious...');
    
    // ในการใช้งานจริง จะเป็นการสร้าง Annotorious instance
    /*
    const anno = new Annotorious({
      image: imageRef.current,
      // กำหนด widgets ที่จะใช้
      widgets: [
        'COMMENT', // ช่องสำหรับใส่ comment
        { 
          widget: 'TAG',  // ช่องสำหรับเลือก tag/category
          vocabulary: defectCategories.map(cat => cat.name)
        }
      ],
      // การตั้งค่าเพิ่มเติม
      allowEmpty: false, // ไม่อนุญาตให้สร้าง annotation เปล่า
      readOnly: false,   // อนุญาตให้แก้ไขได้
      headless: false,   // แสดง UI ของ Annotorious
      // กำหนด formatter สำหรับแสดงผล
      formatter: (annotation) => {
        // กำหนดรูปแบบการแสดงผลของ annotation
        const category = annotation.bodies?.find(b => b.purpose === 'tagging');
        if (category) {
          const cat = defectCategories.find(c => c.name === category.value);
          return {
            stroke: cat ? cat.color : '#ff0000',
            'stroke-width': 2,
            fill: cat ? cat.color + '33' : '#ff000033'
          };
        }
        return null;
      }
    });
    
    annoRef.current = anno;
    
    // การจัดการ events ต่างๆ
    anno.on('createAnnotation', handleAnnotationCreate);
    anno.on('updateAnnotation', handleAnnotationUpdate);
    anno.on('deleteAnnotation', handleAnnotationDelete);
    anno.on('selectAnnotation', handleAnnotationSelect);
    
    setAnnotoriousReady(true);
    
    // Cleanup function
    return () => {
      if (annoRef.current) {
        annoRef.current.destroy();
        annoRef.current = null;
      }
    };
    */
    
    // Mock initialization for demo
    setTimeout(() => {
      setAnnotoriousReady(true);
      console.log('✅ Annotorious initialized (mock)');
    }, 1000);
    
  }, [isImageLoaded]);

  // การจัดการเมื่อมีการสร้าง annotation ใหม่
  const handleAnnotationCreate = (annotation) => {
    console.log('📝 New annotation created:', annotation);
    
    // การจัดการข้อมูล annotation ใน Annotorious format
    // annotation จะมีรูปแบบตาม W3C Web Annotation Model
    const processedAnnotation = {
      id: annotation.id,
      type: annotation.type || 'Annotation',
      // ข้อมูล bodies จะเก็บ comment และ tags
      bodies: annotation.body || [],
      // ข้อมูล target จะระบุตำแหน่งบนรูปภาพ
      target: annotation.target,
      // ข้อมูลเพิ่มเติมสำหรับ Product Inspection
      metadata: {
        tool: selectedTool,
        category: selectedCategory,
        timestamp: new Date().toISOString(),
        inspector: 'current-user', // จากระบบ authentication
        confidence: 1.0, // ระดับความมั่นใจในการตรวจพบ
        severity: getSeverityFromCategory(selectedCategory)
      }
    };
    
    setAnnotations(prev => [...prev, processedAnnotation]);
    saveAnnotationToBackend(processedAnnotation);
  };

  // การจัดการเมื่อมีการอัปเดต annotation
  const handleAnnotationUpdate = (annotation, previous) => {
    console.log('✏️ Annotation updated:', annotation);
    console.log('Previous state:', previous);
    
    setAnnotations(prev => 
      prev.map(a => a.id === annotation.id ? {
        ...a,
        ...annotation,
        metadata: {
          ...a.metadata,
          lastModified: new Date().toISOString(),
          modifiedBy: 'current-user'
        }
      } : a)
    );
    
    updateAnnotationInBackend(annotation);
  };

  // การจัดการเมื่อมีการลบ annotation
  const handleAnnotationDelete = (annotation) => {
    console.log('🗑️ Annotation deleted:', annotation);
    
    setAnnotations(prev => prev.filter(a => a.id !== annotation.id));
    deleteAnnotationFromBackend(annotation.id);
  };

  // การจัดการเมื่อมีการเลือก annotation
  const handleAnnotationSelect = (annotation) => {
    console.log('👆 Annotation selected:', annotation);
    // สามารถเพิ่มการแสดงข้อมูลใน sidebar หรือ popup ได้
  };

  // ฟังก์ชันช่วยในการกำหนดระดับความรุนแรง
  const getSeverityFromCategory = (category) => {
    const severityMap = {
      'defect': 'high',
      'damage': 'critical',
      'crack': 'critical',
      'missing': 'high',
      'scratch': 'medium',
      'good': 'low'
    };
    return severityMap[category] || 'medium';
  };

  // การจัดการการโหลดรูปภาพ
  const handleImageLoad = () => {
    console.log('🖼️ Image loaded successfully');
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    console.log('❌ Image failed to load');
    setIsImageLoaded(false);
  };

  // การส่งออกข้อมูล annotations ในรูปแบบ W3C Web Annotation
  const exportAnnotations = () => {
    const webAnnotationFormat = {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      type: 'AnnotationCollection',
      id: `annotations-${Date.now()}`,
      label: 'Product Inspection Annotations',
      created: new Date().toISOString(),
      generator: {
        type: 'Software',
        name: 'Product Inspection System',
        homepage: window.location.origin
      },
      items: annotations.map(annotation => ({
        ...annotation,
        '@context': 'http://www.w3.org/ns/anno.jsonld'
      }))
    };
    
    const dataStr = JSON.stringify(webAnnotationFormat, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // การนำเข้าข้อมูล annotations
  const importAnnotations = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        let annotationsToImport = [];
        
        // รองรับรูปแบบ W3C Web Annotation Collection
        if (data.type === 'AnnotationCollection' && data.items) {
          annotationsToImport = data.items;
        }
        // รองรับรูปแบบ array ธรรมดา
        else if (Array.isArray(data)) {
          annotationsToImport = data;
        }
        // รองรับรูปแบบ object ที่มี annotations property
        else if (data.annotations) {
          annotationsToImport = data.annotations;
        }
        
        if (annotationsToImport.length > 0) {
          // ใช้ Annotorious API ในการโหลด annotations
          if (annoRef.current && annoRef.current.setAnnotations) {
            annoRef.current.setAnnotations(annotationsToImport);
          }
          
          setAnnotations(annotationsToImport);
          console.log('📥 Imported annotations:', annotationsToImport);
        }
        
      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import annotations. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // การล้างข้อมูล annotations ทั้งหมด
  const clearAnnotations = () => {
    if (window.confirm('Are you sure you want to clear all annotations?')) {
      if (annoRef.current && annoRef.current.clearAnnotations) {
        annoRef.current.clearAnnotations();
      }
      setAnnotations([]);
      console.log('🧹 All annotations cleared');
    }
  };

  // Mock functions สำหรับ backend operations
  const saveAnnotationToBackend = async (annotation) => {
    setIsLoading(true);
    try {
      // ในการใช้งานจริง จะส่งข้อมูลไปยัง API
      // const response = await fetch('/api/annotations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(annotation)
      // });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('💾 Saved to backend:', annotation);
    } catch (error) {
      console.error('❌ Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnnotationInBackend = async (annotation) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('🔄 Updated in backend:', annotation);
    } catch (error) {
      console.error('❌ Update failed:', error);
    }
  };

  const deleteAnnotationFromBackend = async (annotationId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('🗑️ Deleted from backend:', annotationId);
    } catch (error) {
      console.error('❌ Delete failed:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📊 Annotorious Implementation - Product Inspection
      </h1>
      
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Tool Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annotation Tool
            </label>
            <select 
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="rect">Rectangle</option>
              <option value="polygon">Polygon</option>
              <option value="point">Point</option>
              <option value="circle">Circle</option>
              <option value="ellipse">Ellipse</option>
              <option value="freehand">Freehand</option>
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Defect Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {defectCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Image
            </label>
            <select 
              value={currentImage}
              onChange={(e) => {
                setCurrentImage(e.target.value);
                setIsImageLoaded(false);
                setAnnotoriousReady(false);
                setAnnotations([]);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="https://picsum.photos/800/600?random=1">Sample Product 1</option>
              <option value="https://picsum.photos/800/600?random=2">Sample Product 2</option>
              <option value="https://picsum.photos/800/600?random=3">Sample Product 3</option>
            </select>
          </div>

          {/* Annotorious Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annotorious Status
            </label>
            <div className={`p-2 rounded-md text-sm font-medium ${
              annotoriousReady 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {annotoriousReady ? '✅ Ready' : '⏳ Initializing...'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={exportAnnotations}
            disabled={annotations.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 disabled:bg-gray-400"
          >
            <Download size={16} />
            Export W3C Format ({annotations.length})
          </button>
          
          <label className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center gap-2 cursor-pointer">
            <Upload size={16} />
            Import Annotations
            <input
              type="file"
              accept=".json"
              onChange={importAnnotations}
              className="hidden"
            />
          </label>
          
          <button
            onClick={clearAnnotations}
            disabled={annotations.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2 disabled:bg-gray-400"
          >
            <RotateCcw size={16} />
            Clear All
          </button>
          
          <div className="flex items-center gap-2 ml-auto">
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                Saving...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Image Annotation Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Product Image with Annotorious</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Settings size={16} />
                {selectedTool} • {defectCategories.find(c => c.id === selectedCategory)?.name}
              </div>
            </div>
            
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
              {/* รูปภาพที่ Annotorious จะแนบเข้าไป */}
              <img
                ref={imageRef}
                src={currentImage}
                alt="Product for inspection"
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="w-full h-auto rounded-lg shadow-sm"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
              
              {/* Overlay สำหรับแสดงสถานะการทำงานของ Annotorious */}
              {!annotoriousReady && isImageLoaded && (
                <div className="absolute inset-4 flex items-center justify-center bg-blue-50 rounded-lg bg-opacity-90">
                  <div className="text-center text-blue-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-700 border-t-transparent mx-auto mb-2"></div>
                    <p className="font-medium">Initializing Annotorious...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* คำแนะนำการใช้งาน */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📝 Annotorious Instructions:</strong> 
                {annotoriousReady ? (
                  <>
                    Click and drag to create annotations using the selected tool ({selectedTool}). 
                    Right-click on existing annotations to edit or delete them. 
                    Use the annotation editor to add comments and tags.
                  </>
                ) : (
                  'Waiting for Annotorious to initialize...'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Annotations Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">
              Annotations ({annotations.length})
            </h2>
            
            {/* Annotorious Feature List */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Available Features</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div>✅ Multiple annotation tools</div>
                <div>✅ Rich text comments</div>
                <div>✅ Tagging system</div>
                <div>✅ W3C Web Annotation format</div>
                <div>✅ Plugin architecture</div>
                <div>✅ Keyboard shortcuts</div>
                <div>✅ Responsive design</div>
                <div>✅ Export/Import</div>
              </div>
            </div>

            {/* Category Legend */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-1">
                {defectCategories.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded border"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annotations List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {annotations.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  <p>No annotations yet.</p>
                  <p className="text-sm mt-2">
                    {annotoriousReady 
                      ? 'Start annotating on the image using the tools above.' 
                      : 'Waiting for Annotorious to be ready...'
                    }
                  </p>
                </div>
              ) : (
                annotations.map((annotation, index) => (
                  <div key={annotation.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">
                        Annotation #{index + 1}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {annotation.metadata?.tool || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Category: {annotation.metadata?.category}</div>
                      <div>Severity: {annotation.metadata?.severity}</div>
                      <div>Created: {new Date(annotation.metadata?.timestamp).toLocaleString()}</div>
                      {annotation.bodies?.length > 0 && (
                        <div>
                          Bodies: {annotation.bodies.length} item(s)
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Annotorious vs Custom Comparison */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Annotorious vs Custom
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>📊 Data: W3C Standard</div>
                <div>🎨 UI: Built-in widgets</div>
                <div>🔧 Tools: Extensible</div>
                <div>📱 Responsive: Automatic</div>
                <div>🔌 Plugins: Available</div>
                <div>⚡ Performance: Optimized</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Console */}
      <div className="mt-6 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
        <h3 className="text-white mb-2">🔧 Annotorious Debug Console</h3>
        <div className="space-y-1">
          <div>Image loaded: {isImageLoaded ? '✅' : '❌'}</div>
          <div>Annotorious ready: {annotoriousReady ? '✅' : '❌'}</div>
          <div>Selected tool: {selectedTool}</div>
          <div>Selected category: {selectedCategory}</div>
          <div>Total annotations: {annotations.length}</div>
          <div>Library: @recogito/annotorious</div>
          <div>Data format: W3C Web Annotation Model</div>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 การติดตั้งและใช้งาน Annotorious จริง
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>1. ติดตั้ง package:</strong></p>
          <code className="block bg-blue-100 p-2 rounded">npm install @recogito/annotorious</code>
          
          <p><strong>2. Import ใน component:</strong></p>
          <code className="block bg-blue-100 p-2 rounded">
            import {`{ Annotorious }`} from '@recogito/annotorious';<br/>
            import '@recogito/annotorious/dist/annotorious.min.css';
          </code>
          
          <p><strong>3. แทนที่ mock code ด้วย real implementation ตามตัวอย่างในคอมเม้นท์</strong></p>
          
          <p className="text-blue-600">
            <strong>หมายเหตุ:</strong> โค้ดนี้เป็น demo ที่แสดงโครงสร้างและการทำงาน 
            เพื่อให้คุณเข้าใจก่อนการใช้งานจริง
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnotoriousImplementation;