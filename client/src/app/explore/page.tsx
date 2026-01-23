"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconSearch, IconTerminal2 } from "@tabler/icons-react";

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
  if (!address || address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ExplorePage = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <p className="text-neutral-400">Loading...</p>
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
      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-normal text-neutral-900 mb-2">
            Power-ups
          </h1>
          <p className="text-neutral-500">
            Plug in. Pay per use. Build more.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <IconSearch className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-3 text-lg border-b border-neutral-200 bg-transparent placeholder-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
          />
        </div>

        {/* Tools List */}
        {filteredTools.length === 0 ? (
          <p className="text-neutral-400 py-8">
            {searchQuery ? "No results found." : "No tools yet."}
          </p>
        ) : (
          <div className="space-y-1">
            {filteredTools.map((tool, index) => (
              <Link
                key={tool.id}
                href={`/explore/${tool.id}`}
                className="group flex items-center gap-6 py-5 border-b border-neutral-100 hover:bg-neutral-50 -mx-4 px-4 transition-colors"
              >
                {/* Number */}
                <span className="w-8 text-sm text-neutral-300 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <IconTerminal2 className="w-5 h-5 text-neutral-500" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-neutral-400 truncate">
                    {tool.description || "No description"}
                  </p>
                </div>

                {/* Meta */}
                <div className="hidden sm:flex items-center gap-8 text-sm">
                  <span className="text-neutral-400 w-28 truncate">
                    {truncateAddress(tool.owner)}
                  </span>
                  <span className="text-neutral-900 font-medium w-16 text-right">
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
