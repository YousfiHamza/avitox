import Image from 'next/image';

export default function LoadingComponent() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Image
        src="/images/loading.webp"
        width={333}
        height={333}
        alt="empty search illustration"
      />
      <p className="mt-6 text-lg font-medium">Searching ...</p>
    </div>
  );
}
