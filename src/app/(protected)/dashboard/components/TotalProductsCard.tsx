
import { useEffect, useState } from 'react';

export default function TotalProductsCard() {
  return (
    <div className="bg-white p-2 rounded shadow w-full">
      <h2 className="text-xl font-semibold text-center mb-2 mt-2 ">
        Total all products
      </h2>
      <p className="text-4xl font-bold mt-2 text-center mb-4">5000</p>
    </div>
  );
}
