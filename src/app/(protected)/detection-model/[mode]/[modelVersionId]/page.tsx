'use client';

import { useSearchParams, useParams } from 'next/navigation';
import DetectionModelForm from '../../components/detection-model-form';

export default function DetectionModelStepPage() {
  const params = useParams();
  const mode = params.mode; // 'edit' or 'view'
  const modelVersionId = typeof params?.modelVersionId === 'string' ? parseInt(params?.modelVersionId, 10) : NaN;
  const isEditMode = mode === 'edit';

  if (Number.isNaN(modelVersionId)) {
    return <div>Error: Invalid model version id</div>;
  }

  return (
    <DetectionModelForm modelVersionId={modelVersionId} isEditMode={isEditMode} />
  );
}
