export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-linear-to-r from-slate-300 via-slate-200 to-slate-300">
      {children}
    </div>
  );
}
