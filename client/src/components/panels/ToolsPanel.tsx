"use client";

import { useState, useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";

interface Tool {
  id: string;
  owner: string;
  name: string;
  description: string;
  apiURL: string;
  images: string[];
  price: number;
}

interface ToolsPanelProps {
  onSelectTool: (tool: Tool) => void;
  selectedTools: Tool[];
}

const ToolsPanel = ({ onSelectTool, selectedTools }: ToolsPanelProps) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );

  const truncateAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await fetch("http://localhost:3001/tools");
        const data = await res.json();
        setTools(data);
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const isSelected = (tool: Tool) =>
    selectedTools.some((t) => t.id === tool.id);

  return (
    <div className="h-full flex flex-col bg-neutral-50 border-l border-neutral-200">
      <div className="p-4 border-b border-neutral-200 space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Tools</h2>
          <p className="text-sm text-neutral-500">Add tools to your chat</p>
        </div>
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm outline-none focus:border-neutral-400 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            {search ? "No tools match your search" : "No tools available"}
          </div>
        ) : (
          filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                isSelected(tool)
                  ? "bg-neutral-800 text-white"
                  : "bg-white hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{tool.name}</h3>
                    {isSelected(tool) && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                        Added
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 line-clamp-2 ${
                      isSelected(tool) ? "text-neutral-300" : "text-neutral-500"
                    }`}
                  >
                    {tool.description}
                  </p>
                  {tool.owner && (
                    <p
                      className={`text-xs mt-2 font-mono ${
                        isSelected(tool) ? "text-neutral-400" : "text-neutral-400"
                      }`}
                    >
                      {truncateAddress(tool.owner)}
                    </p>
                  )}
              </div>
            </button>
          ))
        )}
      </div>

      {selectedTools.length > 0 && (
        <div className="p-4 border-t border-neutral-200 bg-white">
          <p className="text-sm text-neutral-600">
            <span className="font-medium">{selectedTools.length}</span> tool
            {selectedTools.length > 1 ? "s" : ""} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolsPanel;
