import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function Websiteayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-screen-xl flex-1">
        <div className="mx-auto w-fit p-24">{children}</div>
      </main>
      <Footer />
    </>
  );
}
