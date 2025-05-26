'use client';

import { useParams } from 'next/navigation';
import DetectionModelForm from '../components/detection-model-form';

export default function DetectionModelStepPage() {
  const params = useParams();

  const modelId = params?.modelId;

  if (!modelId || Array.isArray(modelId)) {
    return <div>Error: Invalid model ID</div>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 ml-3">Detection Model: {modelId}</h2>
      <div className="p-3 mx-auto">
          <DetectionModelForm modelId={modelId}/>
      </div>
    </>
  );
}
