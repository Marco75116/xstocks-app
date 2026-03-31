import { Navbar } from "@/components/Navbar";

export function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-4">{children}</div>
    </>
  );
}
