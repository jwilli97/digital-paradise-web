"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RetroNav() {
  const [currentPage, setCurrentPage] = useState("Home Page");
  const [history, setHistory] = useState(["Home Page"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const router = useRouter();

  const navigate = (page: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(page)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCurrentPage(page)
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentPage(history[historyIndex - 1])
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentPage(history[historyIndex + 1])
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-3xl bg-gradient-to-b from-gray-300 to-gray-400 p-1 rounded-t-lg shadow-lg">
        <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded">
          <Button
            size="icon"
            className="w-8 h-8 bg-gray-300 border-gray-400 hover:bg-gray-400"
            onClick={goBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="w-8 h-8 bg-gray-300 border-gray-400 hover:bg-gray-400"
            onClick={goForward}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="w-8 h-8 bg-gray-300 border-gray-400 hover:bg-gray-400"
            onClick={() => navigate("Home Page")}
          >
            <Home className="h-4 w-4" />
          </Button>
          <div className="flex-grow bg-white px-2 py-1 border border-gray-400 rounded shadow-inner">
            <p className="text-sm font-mono truncate">{currentPage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}