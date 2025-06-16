import React from 'react';
import { Loader } from 'lucide-react';

export default function SpinnerLoading () {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader className="animate-spin" size={60} color="rgba(0, 136, 202, 0.75)" />
      {/* <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-900' /> */}
    </div>
  );
};
