import { DashboardData } from '@/app/types/dashboard';

interface TotalProductsCardProps {
  data: DashboardData | null;
}

export default function TotalProductsCard({ data }: TotalProductsCardProps) {
  const totalProducts = data?.totalProducts || 5000;

  return (
    <div className="bg-white p-3 md:p-4 rounded shadow w-full min-h-[120px] flex flex-col justify-center">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2">
        Total all products
      </h2>
      <p className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4">
        {totalProducts.toLocaleString()}
      </p>
    </div>
  );
}