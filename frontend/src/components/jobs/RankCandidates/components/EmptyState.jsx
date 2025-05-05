import { UserCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";

export const EmptyState = ({ type = "no-selection" }) => {
  if (type === "no-selection") {
    return (
      <div className="text-center py-16 flex flex-col items-center justify-center">
        <div className="rounded-full bg-blue-100 p-4 mb-4">
          <UserCircleIcon className="h-10 w-10 text-blue-600" />
        </div>
        <p className="text-gray-600 font-medium mb-2">No candidates selected</p>
        <p className="text-sm text-gray-500 max-w-md">
          Please select a job posting from the dropdown above to view and rank eligible candidates
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 flex flex-col items-center justify-center">
      <div className="rounded-full bg-amber-100 p-4 mb-4">
        <CalendarIcon className="h-10 w-10 text-amber-600" />
      </div>
      <p className="text-gray-600 font-medium mb-2">No candidates found</p>
      <p className="text-sm text-gray-500 max-w-md">
        There are no applications for this job posting yet
      </p>
    </div>
  );
};