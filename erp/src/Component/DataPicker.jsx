import React from "react";
import { Calendar } from "lucide-react";

const DatePicker = ({ selectedDate, onDateChange }) => {
  return (
    <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-6 shadow-2xl border border-white/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 text-white" />
          <div className="flex-1">
            <p className="text-white/70 text-xs md:text-sm font-medium">Select Date</p>
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              className="w-full md:w-auto bg-white/20 text-white font-semibold px-3 md:px-4 py-2 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer text-sm md:text-base"
            />
          </div>
        </div>
        <div className="text-center md:text-right w-full md:w-auto border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
          <p className="text-xl md:text-3xl font-bold text-white leading-tight">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <p className="text-white/80 text-sm md:text-lg">
            {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;