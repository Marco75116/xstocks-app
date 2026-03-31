import { TopNav } from "@/components/TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-12 py-8">
        {children}
      </main>
    </>
  );
}
