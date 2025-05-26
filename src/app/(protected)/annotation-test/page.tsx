// src/app/(protected)/annotation-test/page.tsx
'use client';

import { useState } from 'react';
import AnnotoriousImplementation from './Annotorious';
import KonvaAnnotation from './KonvaAnnotation';

export default function AnnotationTestPage() {
  const [activeTab, setActiveTab] = useState<'annotorious' | 'konva'>('konva');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('konva')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'konva'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Konva.js Annotation
            </button>
            <button
              onClick={() => setActiveTab('annotorious')}
              className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'annotorious'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Annotorious Implementation
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'konva' && <KonvaAnnotation />}
        {activeTab === 'annotorious' && <AnnotoriousImplementation />}
      </div>
    </div>
  );
}