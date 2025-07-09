import type { TotalProductsData } from '@/app/types/dashboard';

interface TotalProductsCardProps {
  data: TotalProductsData | null;
  loading?: boolean;
  error?: string;
}

export default function TotalProductsCard({ data, loading, error }: TotalProductsCardProps) {
  if (loading) {
    return (
      <div className="bg-white p-3 md:p-4 rounded shadow w-full h-[150px] flex flex-col justify-center"> {/* เปลี่ยนจาก min-h-[120px] เป็น h-[150px] */}
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2">
          Total all products
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-3 md:p-4 rounded shadow w-full h-[150px] flex flex-col justify-center"> {/* เปลี่ยนจาก min-h-[120px] เป็น h-[150px] */}
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2">
          Total all products
        </h2>
        <p className="text-red-500 text-center text-sm">{error}</p>
      </div>
    );
  }

  const totalProducts = data?.total_products || 0;

  return (
    <div className="bg-white p-3 md:p-15 rounded shadow w-full h-[100px] flex flex-col justify-center">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-">
        Total all products
      </h2>
      <p className="text-2xl md:text-4xl font-bold text-center mb-1 md:mb-1">
        {totalProducts.toLocaleString()}
      </p>
    </div>
  );
}