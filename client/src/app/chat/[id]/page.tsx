"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { IconPlus, IconX, IconMicrophone, IconWaveSine } from "@tabler/icons-react";
import { useAppKitAccount } from "@reown/appkit/react";
import ChatLayout from "@/components/layout/ChatLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Tool {
  id: string;
  owner: string;
  name: string;
  description: string;
  apiURL: string;
  images: string[];
  price: number;
}

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAppKitAccount();
  const threadId = params.id as string;

  const [showTools, setShowTools] = useState(false);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialProcessed = useRef(false);

  // Save chat to database
  const saveChat = useCallback(async (msgs: Message[]) => {
    if (!isConnected || !address || msgs.length === 0) return;

    try {
      await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          owner: address,
          messages: msgs,
        }),
      });
      // Notify sidebar to refresh recent chats
      window.dispatchEvent(new CustomEvent("chat-updated"));
    } catch (err) {
      console.error("Failed to save chat:", err);
    }
  }, [threadId, address, isConnected]);

  // Load existing chat from database
  useEffect(() => {
    const loadChat = async () => {
      if (!threadId || chatLoaded) return;

      try {
        const res = await fetch(`${API_URL}/chats/thread/${threadId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
            initialProcessed.current = true;
          }
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
      } finally {
        setChatLoaded(true);
      }
    };

    loadChat();
  }, [threadId, chatLoaded]);

  // Process initial message from home page
  useEffect(() => {
    if (initialProcessed.current || !chatLoaded) return;

    const initialMessage = searchParams.get("initial");
    if (initialMessage) {
      initialProcessed.current = true;

      // Load tools from localStorage
      const pendingTools = localStorage.getItem("pendingTools");
      if (pendingTools) {
        setSelectedTools(JSON.parse(pendingTools));
        localStorage.removeItem("pendingTools");
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: initialMessage,
      };
      setMessages([userMessage]);
      setIsLoading(true);

      // Clean URL (remove ?initial param)
      router.replace(window.location.pathname, { scroll: false });

      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This is a simulated response. The actual AI integration will be implemented later.",
        };
        setMessages((prev) => {
          const newMsgs = [...prev, assistantMessage];
          saveChat(newMsgs);
          return newMsgs;
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [searchParams, router, chatLoaded, saveChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectTool = (tool: Tool) => {
    setSelectedTools((prev) =>
      prev.some((t) => t.id === tool.id)
        ? prev.filter((t) => t.id !== tool.id)
        : [...prev, tool]
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated response. The actual AI integration will be implemented later.",
      };
      setMessages((prev) => {
        const newMsgs = [...prev, assistantMessage];
        saveChat(newMsgs);
        return newMsgs;
      });
      setIsLoading(false);
    }, 1000);
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split("\n");
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-lg font-semibold text-neutral-800 mt-6 mb-2 flex items-center gap-2">
            {line.replace("## ", "")}
          </h2>
        );
      }
      // Horizontal rule
      if (line === "---") {
        return <hr key={index} className="border-neutral-200 my-4" />;
      }
      // Bullet points
      if (line.startsWith("- ")) {
        const text = line.replace("- ", "");
        return (
          <div key={index} className="flex items-start gap-2 my-1">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{renderInlineFormatting(text)}</span>
          </div>
        );
      }
      // Empty lines
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }
      // Regular paragraph
      return (
        <p key={index} className="my-1">
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (text: string) => {
    // Handle bold (**text**) and italic (*text*)
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <ChatLayout
      showTools={showTools}
      selectedTools={selectedTools}
      onSelectTool={handleSelectTool}
    >
      <motion.div
        className="flex flex-col h-full bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <AnimatePresence initial={true}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index === 0 ? 0.1 : 0 }}
                >
                  {message.role === "user" ? (
                    // User message - right aligned with dark bubble
                    <div className="flex justify-end">
                      <div className="max-w-[80%] px-4 py-3 bg-neutral-800 text-white rounded-2xl rounded-tr-sm">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    // Assistant message - left aligned, plain text
                    <div className="text-neutral-700 leading-relaxed">
                      {renderMessageContent(message.content)}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

      {/* Input Area */}
      <div className="bg-white pb-4">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 w-full px-4 py-3 bg-neutral-100 rounded-full border border-neutral-200">
              <button
                type="button"
                onClick={() => setShowTools(!showTools)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
              >
                {showTools ? (
                  <IconX className="h-5 w-5" />
                ) : (
                  <IconPlus className="h-5 w-5" />
                )}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400"
                disabled={isLoading}
              />

              <button
                type="button"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200 transition-colors text-neutral-500"
              >
                <IconMicrophone className="h-5 w-5" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors text-white"
              >
                <IconWaveSine className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
        </div>
      </motion.div>
    </ChatLayout>
  );
};

export default ChatPage;
