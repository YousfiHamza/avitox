// app/market/page.tsx
import { Suspense } from 'react';
import { FilterSidebar } from './components/FilterSidebar';
import { MarketContent } from './components/MarketContent';
import LoadingComponent from './components/loading-component';

export default function MarketPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="mx-auto flex w-full flex-col gap-6 py-6 md:flex-row">
      <aside className="">
        <FilterSidebar initialFilters={searchParams} />
      </aside>
      <main className="w-full flex-1">
        <Suspense fallback={<LoadingComponent />}>
          <MarketContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
