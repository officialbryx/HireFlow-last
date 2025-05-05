export const LoadingState = () => {
  return (
    <div className="text-center py-16 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-b-2 border-gray-200"></div>
        <div className="absolute top-0 w-16 h-16 rounded-full border-b-2 border-blue-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-500 font-medium">Loading candidates...</p>
      <p className="text-sm text-gray-400">This may take a moment</p>
    </div>
  );
};