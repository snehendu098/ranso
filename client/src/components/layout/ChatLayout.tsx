"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import ToolsPanel from "@/components/panels/ToolsPanel";

interface Tool {
  id: string;
  owner: string;
  name: string;
  description: string;
  apiURL: string;
  images: string[];
  price: number;
}

interface ChatLayoutProps {
  children: ReactNode;
  showTools: boolean;
  selectedTools: Tool[];
  onSelectTool: (tool: Tool) => void;
}

const ChatLayout = ({
  children,
  showTools,
  selectedTools,
  onSelectTool,
}: ChatLayoutProps) => {
  return (
    <div className="flex w-full h-full">
      {/* Left: Chat area */}
      <div className="flex-1 h-full overflow-hidden">{children}</div>

      {/* Right: Tools panel (animated) */}
      <AnimatePresence>
        {showTools && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full overflow-hidden"
          >
            <div className="w-[400px] h-full">
              <ToolsPanel
                onSelectTool={onSelectTool}
                selectedTools={selectedTools}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatLayout;
