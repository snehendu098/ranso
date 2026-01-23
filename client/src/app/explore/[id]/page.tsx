"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IconExternalLink, IconChevronRight } from "@tabler/icons-react";

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

const ToolDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`${API_URL}/tools/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Tool not found");
          } else {
            throw new Error("Failed to fetch tool");
          }
          return;
        }
        const data = await response.json();
        setTool(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tool");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTool();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <p className="text-neutral-500">{error || "Tool not found"}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-10">
          <Link href="/explore" className="text-neutral-500 hover:text-neutral-700 transition-colors">
            Explore
          </Link>
          <IconChevronRight className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-800">{tool.name}</span>
        </nav>

        {/* Tool Icon - Centered */}
        <div className="flex justify-start mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">{tool.name.charAt(0)}</span>
          </div>
        </div>

        {/* Title and Connect Button */}
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-3xl font-bold text-neutral-800">{tool.name}</h1>
          <button className="px-6 py-2 bg-white text-neutral-800 border border-neutral-300 rounded-full font-medium hover:bg-neutral-50 transition-colors">
            Connect
          </button>
        </div>

        {/* Owner tagline */}
        <p className="text-neutral-500 mb-10">by {tool.owner}</p>

        {/* Images Carousel */}
        {tool.images && tool.images.length > 0 && (
          <div className="relative mb-10">
            <div
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {tool.images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-72 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-4 border border-neutral-200"
                >
                  <div className="bg-white rounded-lg h-44 flex items-center justify-center border border-neutral-200 overflow-hidden">
                    <img src={image} alt={`Screenshot ${index + 1}`} className="object-cover w-full h-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-neutral-600 leading-relaxed mb-10">
          {tool.description || "No description available"}
        </p>

        {/* Information */}
        <div className="border-t border-neutral-200 pt-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-6">Information</h2>

          <div className="space-y-4">
            <div className="flex">
              <span className="w-40 text-neutral-500">Owner</span>
              <span className="text-neutral-800 font-medium">{tool.owner}</span>
            </div>
            <div className="flex items-center">
              <span className="w-40 text-neutral-500">API URL</span>
              <a
                href={tool.apiURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-800 hover:text-neutral-600 transition-colors flex items-center gap-1"
              >
                {tool.apiURL}
                <IconExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="flex">
              <span className="w-40 text-neutral-500">Price</span>
              <span className="text-neutral-800 font-medium">${tool.price.toFixed(2)} / request</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
