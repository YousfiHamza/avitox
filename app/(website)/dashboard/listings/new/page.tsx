import CreateListingForm from '@/components/modules/create-listing-form';
import { VerticalAds } from '@/components/modules/Ads/Vertical';
import { HotListings } from '@/components/modules/hot-listings';

export default function NewAdvertPage() {
  return (
    <div className="container mx-auto pb-8">
      <div className="flex w-full gap-2">
        <CreateListingForm />
        <div className="flex min-h-full flex-col justify-between gap-3 self-stretch">
          <HotListings />
          <VerticalAds />
        </div>
      </div>
    </div>
  );
}
