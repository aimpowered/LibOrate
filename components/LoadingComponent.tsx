// components/LoadingComponent.tsx
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function LoadingComponent() {
  return (
    <div
      className={`${shimmer} relative flex flex-col items-center justify-center h-screen bg-gray-100`}
    >
      <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse" />
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  );
}
