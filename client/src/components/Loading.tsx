"use client";
export const Loading = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full bg-white/50 z-50">
      <div className="animate-spin rounded-full border-4 border-t-transparent border-colorPalette-600 w-8 h-8" />
      <p className="mt-2 text-colorPalette-600">Loading...</p>
    </div>
  );
};
