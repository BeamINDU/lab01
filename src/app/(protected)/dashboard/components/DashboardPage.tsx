'use client';

import HeaderFilters from './HeaderFilters';
import TotalProductsCard from './TotalProductsCard';
import GoodNGRatioChart from './GoodNGRatioChart';
import TrendDetectionChart from './TrendDetectionChart';
import FrequentDefectsChart from './FrequentDefectsChart';
import NGDistributionChart from './NGDistributionChart';
import DefectByCameraChart from './DefectByCameraChart';

export default function DashboardPage() {
  return (
    <main className="p-2">
      <HeaderFilters />

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Left column: Total products and Good/NG Ratio stacked */}
        <div className="lg:col-span-1 space-y-6">
          <TotalProductsCard />
          <GoodNGRatioChart />
        </div>

        {/* Middle: Trend and Top Defects */}
        <div className="lg:col-span-2">
          <TrendDetectionChart />
        </div>
        <div className="lg:col-span-3">
          <FrequentDefectsChart />
        </div>

        {/* Bottom row: NG Distribution and Camera Defects */}
        <div className="lg:col-span-3">
          <NGDistributionChart />
        </div>
        <div className="lg:col-span-3">
          <DefectByCameraChart />
        </div>
      </div>
    </main>
  );
}
