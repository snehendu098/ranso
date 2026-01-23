"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  owner: string;
  apiURL: string;
  price: number;
  images: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const truncateAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ExplorePage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch(`${API_URL}/tools`);
        if (!response.ok) {
          throw new Error("Failed to fetch tools");
        }
        const data = await response.json();
        setTools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tools");
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <p className="text-neutral-500">Loading tools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-neutral-800 mb-8">
          Explore Tools
        </h1>

        {tools.length === 0 ? (
          <p className="text-neutral-500">No tools available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/explore/${tool.id}`}
                className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer group block"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-800 leading-tight pr-2 line-clamp-2">
                    {tool.name}
                  </h3>
                </div>

                <p className="text-sm text-neutral-500 mb-4 line-clamp-3 leading-relaxed">
                  {tool.description || "No description available"}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600">
                    by{" "}
                    <span className="font-medium">
                      {truncateAddress(tool.owner)}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-rose-600">
                    ${tool.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
