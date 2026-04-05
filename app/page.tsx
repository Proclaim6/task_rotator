"use client";

import React, { useState, useEffect } from "react";
import {ConstellationBackground} from "@/components/ui/constellation";
import { motion, AnimatePresence } from "framer-motion";
import { Geist } from "next/font/google"; // Import Geist

// Configure Geist font
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

interface Task {
  id: string;
  text: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: "1", text: "Assignment Task" },
  { id: "2", text: "University Study Task" },
  { id: "3", text: "Astrophysics Study Task" },
  { id: "4", text: "Language Learning Task"},
  { id: "5", text: "Admin Task" },
  { id: "6", text: "Youtube Task"},
  { id: "7", text: "Hobbie Task" },
  { id: "8", text: "Read 10 pages" }
];

export default function InfiniteTaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check v2 to force a reset if you changed the list above
    const saved = localStorage.getItem("task-loop-order-v2");
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(DEFAULT_TASKS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("task-loop-order-v2", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

const completeTask = (id: string) => {
  const taskToMove = tasks.find((t) => t.id === id);
  if (!taskToMove) return;

  // Use a timestamp instead of crypto for the ID to avoid build errors
  const newId = `${taskToMove.id}-${Date.now()}`;

  const updatedTasks = [
    ...tasks.filter((t) => t.id !== id),
    { ...taskToMove, id: newId },
  ];

  setTasks(updatedTasks);
};

  if (!isLoaded) return <div className={`min-h-screen bg-[#050509] ${geist.variable} font-sans`} />;

  return (
    // Apply the font variable to the main wrapper
    <main className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050509] p-6 ${geist.variable} font-sans`}>
      <ConstellationBackground 
        className="absolute inset-0 -z-0" 
      />

      <div className="z-10 w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          {/* New Branding: ORBITAL */}
          <h1 className="text-5xl font-black tracking-tighter text-white">ORBITAL</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">Infinite Academic Cycles</p>
        </header>

        <ul className="relative space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                onClick={() => completeTask(task.id)}
                className="cursor-pointer rounded-xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/15 active:scale-95"
              >
                <div className="flex items-center justify-center text-center">
                  <span className="text-lg font-medium tracking-tight text-white/95">{task.text}</span>
                  {/* BLUE DOT IS GONE */}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </main>
  );
}