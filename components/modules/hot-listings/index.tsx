import Image from 'next/image';
import Link from 'next/link';

// import { getLatestPosts } from "@/lib/contentful/api";
// import { formatDateTime } from "@/lib/utils";

export async function HotListings() {
  // // TODO: change the implementation so we can request for 2 posts in each category in case the current post displayed in the page is one of the latest posts in this list.
  // const latestPosts = await getLatestPosts(preview);

  // if (!latestPosts || !latestPosts.length) {
  //   return null;
  // }

  return (
    <div className="min-h-[333px] overflow-hidden rounded-sm border-[1px] bg-slate-100 p-2">
      <h5 className="px-4 text-xl font-bold leading-5 md:text-2xl md:leading-8 lg:text-3xl">
        🔥 Hot Listings
      </h5>
      <ul className="flex flex-col gap-2">
        {/* {
          // TODO: Add Type Post remove Any
          latestPosts.map((post: any) => (
            <li
              key={post.sys.id}
              className="rounded-sm p-1 transition-all duration-300 ease-in-out hover:bg-slate-400/50"
            >
              <div className="grid grid-cols-5 gap-2">
                <div className="relative col-span-2">
                  <Link href={`/journal/${post.slug}`} target="_blank">
                    <Image
                      src={post.previewImage.url}
                      alt={post.title}
                      height={333}
                      width={333}
                      className="h-full w-full rounded-sm"
                    />
                  </Link>
                </div>
                <Link
                  className="font-questrial col-span-3 flex h-full flex-col justify-between"
                  href={`/journal/${post.slug}`}
                  target="_blank"
                >
                  <p className="text-theme line-clamp-3 text-base font-semibold leading-4 md:text-base md:leading-4">
                    {post.title}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-base capitalize">
                      {post.category}
                    </span>
                    <span className="">
                      {formatDateTime(post.publishDate).dateOnly}
                    </span>
                  </div>
                </Link>
              </div>
            </li>
          ))
        } */}
      </ul>
    </div>
  );
}
