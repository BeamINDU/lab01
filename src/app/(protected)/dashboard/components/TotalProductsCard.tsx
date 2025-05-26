import { DashboardData } from '@/app/types/dashboard';

interface TotalProductsCardProps {
  data: DashboardData | null;
}

export default function TotalProductsCard({ data }: TotalProductsCardProps) {
  const totalProducts = data?.totalProducts || 5000;

  return (
    <div className="bg-white p-2 rounded shadow w-full">
      <h2 className="text-xl font-semibold text-center mb-2 mt-2">
        Total all products
      </h2>
      <p className="text-4xl font-bold mt-2 text-center mb-4">
        {totalProducts.toLocaleString()}
      </p>
    </div>
  );
}