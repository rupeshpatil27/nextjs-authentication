import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-r from-slate-300 via-slate-200 to-slate-300">
      <Navbar />
      {children}
    </div>
  );
}
