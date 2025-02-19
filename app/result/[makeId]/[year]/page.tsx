import { Suspense } from "react";

interface VehicleModel {
    Model_ID: number;
    Model_Name: string;
}

async function fetchModels(makeId: string, year: string): Promise<VehicleModel[]> {
    const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
    );
    if (!res.ok) throw new Error("Failed to fetch vehicle models.");
    const data = await res.json();
    return data.Results;
}

export default async function ResultPage({ params }: { params: { makeId: string; year: string } }) {
    const { makeId, year } = params;
    let models: VehicleModel[] = [];

    try {
        models = await fetchModels(makeId, year);
    } catch (error) {
        console.error("Error fetching models:", error);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Car Models for Make ID {makeId} - Year {year}
            </h1>

            <Suspense fallback={<p className="text-gray-600">Loading models...</p>}>
                {models.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                        {models.map((model, index) => (
                            <li
                                key={`${model.Model_ID}-${index}`}
                                className="p-4 bg-white shadow-md rounded-lg text-center border border-gray-200"
                            >
                                <span className="text-lg font-semibold text-gray-700">{model.Model_Name}</span>
                            </li>
                        ))}
                    </ul>

                ) : (
                    <p className="text-red-500 font-semibold">No models found.</p>
                )}
            </Suspense>

            <a
                href="/"
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Back to Home
            </a>
        </div>
    );
}

export async function generateStaticParams() {
    const makesRes = await fetch(
        "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
    );
    const makesData = await makesRes.json();
    const makes = makesData.Results.slice(0, 5);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 3 }, (_, i) => (currentYear - i).toString());

    return makes.flatMap((make: { MakeId: number }) =>
        years.map((year) => ({ makeId: make.MakeId.toString(), year }))
    );
}
