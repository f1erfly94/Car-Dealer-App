"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface VehicleMake {
  MakeId: number;
  MakeName: string;
}

export default function Home() {
  const router = useRouter();
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    fetch(
        "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
    )
        .then((res) => res.json())
        .then((data) => setMakes(data.Results))
        .catch((err) => console.error("Error fetching makes:", err));
  }, []);

  const handleNext = () => {
    if (selectedMake && selectedYear) {
      router.push(`/result/${selectedMake}/${selectedYear}`);
    }
  };

  return (
      <div className="flex flex-col items-center justify-center h-screen bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Select a Car Make and Model Year
        </h1>

        <div className="space-y-4">
          <div>
            <select
                className="text-black w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMake ?? ""}
                onChange={(e) => setSelectedMake(e.target.value)}
            >
              <option value="">Select a Make</option>
              {makes.map((make) => (
                  <option key={make.MakeId} value={make.MakeId} className="text-black">
                    {make.MakeName}
                  </option>
              ))}
            </select>
          </div>

          <div>
            <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={selectedYear ?? ""}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              <option value="">Select a Year</option>
              {Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => (
                  <option key={i} value={2015 + i} className="text-black">
                    {2015 + i}
                  </option>
              ))}
            </select>
          </div>

          <button
              className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:bg-gray-300"
              onClick={handleNext}
              disabled={!selectedMake || !selectedYear}
              title={(!selectedMake || !selectedYear) ? "Please select both make and year" : ""}
          >
            {(!selectedMake || !selectedYear) ? "Please select both make and year" : "Next"}
          </button>
        </div>
      </div>
  );
}
