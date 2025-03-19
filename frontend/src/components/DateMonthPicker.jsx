import React, { useState, useEffect, useRef } from "react";

const MonthYearPicker = ({
  value,
  onChange,
  label,
  id,
  placeholder = "Select month and year",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const dropdownRef = useRef(null);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Parse the value to set initial year and update display value
  useEffect(() => {
    if (value) {
      const [month, year] = value.split("/"); // Split MM/YYYY format
      if (month && year) {
        setYear(parseInt(year, 10));
        const selectedMonth = months.find((m) => m.value === month);
        setDisplayValue(selectedMonth ? `${selectedMonth.label} ${year}` : "");
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle selecting a month
  const handleMonthSelect = (monthValue) => {
    const formattedValue = `${monthValue}/${year}`; // Format as MM/YYYY
    onChange(formattedValue);
    setIsOpen(false);

    // Update display value to show Month YYYY format
    const selectedMonth = months.find((m) => m.value === monthValue);
    setDisplayValue(selectedMonth ? `${selectedMonth.label} ${year}` : "");
  };

  // Handle year change
  const handleYearChange = (offset) => {
    setYear((prevYear) => prevYear + offset);
  };

  // Get CSS class for month button
  const getMonthButtonClass = (monthValue) => {
    const isSelected = value === `${monthValue}/${year}`;
    return `py-2 px-3 text-center rounded-md ${
      isSelected
        ? "bg-blue-600 text-white font-medium"
        : "hover:bg-blue-50 text-gray-700"
    } transition-colors`;
  };

  // Get current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm text-gray-600 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-10 w-64 p-3">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <span className="font-medium text-gray-800">{year}</span>

            <button
              onClick={() => handleYearChange(1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {months.map((month) => (
              <button
                key={month.value}
                className={getMonthButtonClass(month.value)}
                onClick={() => handleMonthSelect(month.value)}
              >
                {month.label.substring(0, 3)}
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-between border-t pt-3">
            <button
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Clear
            </button>

            <button
              onClick={() => {
                const today = new Date();
                const currentMonth = String(today.getMonth() + 1).padStart(
                  2,
                  "0"
                );
                const currentYear = today.getFullYear();
                onChange(`${currentMonth}/${currentYear}`);
                setIsOpen(false);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
