"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useWebSocketTelemetry, useTelemetryStore } from "../hooks/useWebSocketTelemetry";
import { useState, useEffect } from "react";
import { Physics } from "@react-three/rapier";
import Landing from "@/components/landing";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Dynamically load components
const Skateboard = dynamic(() => import("@/components/skateboard"), { ssr: false });
const HighlightRender = dynamic(() => import("@/components/highlight-render"), { ssr: false });

export default function Home() {
  const { sendMessage } = useWebSocketTelemetry("ws://localhost:8000/ws/viewer");
  const triggerReset = useTelemetryStore((state) => state.triggerReset);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00");

  const presenterColors = ["#ec4899", "#3b82f6", "#10b981", "#f97316"];

  const presenters = [
    { top: 10, left: 40 },
    { top: 12, left: 48 },
    { top: 14, left: 36 },
    { top: 13, left: 52 },
  ];

  const [audience] = useState(() =>
    Array.from({ length: 250 }, () => ({
      top: 60 + Math.random() * 35,
      left: Math.random() * 100,
    }))
  );

  const startTimer = (start: Date) => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = new Date(now.getTime() - start.getTime());
      const minutes = String(diff.getUTCMinutes()).padStart(2, "0");
      const seconds = String(diff.getUTCSeconds()).padStart(2, "0");
      setElapsedTime(`${minutes}:${seconds}`);
    }, 1000);
    return interval;
  };

  useEffect(() => {
    if (!sessionStarted || !sessionStartTime) return;
    const interval = startTimer(sessionStartTime);
    return () => clearInterval(interval);
  }, [sessionStarted, sessionStartTime]);

  const handleStartSession = () => {
    sendMessage({ type: "session:start" });
    setSessionStartTime(new Date());
    setSessionStarted(true);
  };

  const handleStopSession = () => {
    sendMessage({ type: "session:stop" });
    setSessionStarted(false);
    setShowAnalysis(true);
  };

  const handleReturnHome = () => {
    setElapsedTime("00:00");
    setSessionStartTime(null);
    setShowAnalysis(false);
  };

  const cardStyle =
    "bg-white border-[3px] border-black rounded-xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]";

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-hidden">
      <AnimatePresence mode="wait">
        {!sessionStarted && !showAnalysis ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Landing handleStartSession={handleStartSession} />
          </motion.div>
        ) : showAnalysis ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center w-full h-full px-6 py-10 overflow-y-scroll"
          >
            <div className="max-w-5xl w-full space-y-8">
              <h1 className="text-3xl font-black text-black uppercase text-center">Session Report</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={cardStyle}>
                  <h2 className="text-lg font-bold mb-2">AI Summary</h2>
                  <p>Analyzing your movements... Session showed high consistency and board control.</p>
                  <p className="mt-2">Estimated skill level: <strong>Intermediate</strong></p>
                  <p>Suggested Focus: <strong>Trick linking & balance drills</strong></p>
                </div>

                <div className={cardStyle}>
                  <h2 className="text-lg font-bold mb-2">Time & Conditions</h2>
                  <p>Session Time: <strong>{elapsedTime}</strong></p>
                  <p>Location: Burnside Skatepark</p>
                  <p>Weather: Partly Cloudy, 22°C</p>
                </div>
              </div>

              <div className={cardStyle}>
                <h2 className="text-xl font-black mb-6 tracking-tight text-black">Highlights</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Ollie Card */}
                  <div className={`${cardStyle} overflow-hidden p-0`}>
                    <img src="/images/ollie.jpg" alt="Ollie" className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-black">Ollie</h3>
                        <span className="text-xs font-semibold text-white bg-green-500 px-3 py-1 rounded-full">Easy</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        A fundamental skateboarding trick where the rider and board leap into the air.
                      </p>
                      <div className="flex justify-between text-sm mt-2 text-gray-600">
                        <span>Trick Count: <strong>15</strong></span>
                        <span>Performance: <strong>85%</strong></span>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <Button className="w-full bg-black text-white">View Details</Button>
                    </div>
                  </div>

                  {/* Shuvit Card */}
                  <div className={`${cardStyle} overflow-hidden p-0`}>
                    <img src="/images/shuvit.jpg" alt="Shuvit" className="w-full h-44 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-black">Shuvit</h3>
                        <span className="text-xs font-semibold text-white bg-yellow-500 px-3 py-1 rounded-full">Medium</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        A trick where the skateboard spins 180 degrees without flipping.
                      </p>
                      <div className="flex justify-between text-sm mt-2 text-gray-600">
                        <span>Trick Count: <strong>10</strong></span>
                        <span>Performance: <strong>78%</strong></span>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <Button className="w-full bg-black text-white">View Details</Button>
                    </div>
                  </div>
                </div>

                {/* Kickflip - Full Width Card Below */}
                <div className={`${cardStyle} overflow-hidden mt-6 p-0`}>
                  <img src="/images/kickflip.jpg" alt="Kickflip" className="w-full h-44 object-cover" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-black">Kickflip</h3>
                      <span className="text-xs font-semibold text-white bg-red-500 px-3 py-1 rounded-full">Hard</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      A trick where the skateboard flips 360 degrees along its axis.
                    </p>
                    <div className="flex justify-between text-sm mt-2 text-gray-600">
                      <span>Trick Count: <strong>5</strong></span>
                      <span>Performance: <strong>65%</strong></span>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <Button className="w-full bg-black text-white">View Details</Button>
                  </div>
                </div>
              </div>


              <div className={cardStyle}>
                <h2 className="text-lg font-bold mb-4">Heatmap Recap</h2>
                <div className="relative w-full h-64 bg-gray-100 border-2 border-dashed border-black rounded-lg overflow-hidden">
                  <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {audience.map((pos, i) => (
                      <circle key={i} cx={pos.left} cy={pos.top} r="0.7" fill="gray" opacity="0.3" />
                    ))}
                  </svg>
                  {presenters.map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{
                        backgroundColor: presenterColors[i],
                        top: `${pos.top}%`,
                        left: `${pos.left}%`,
                      }}
                      animate={{ y: [0, -2, 0] }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleReturnHome}
                  className="bg-black text-white border-2 border-black px-6 py-2 font-bold rounded-lg hover:bg-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]"
                >
                  Return Home
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="canvas"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center justify-start w-full h-full px-6 py-10 overflow-y-auto"
          >
            <div className="max-w-5xl w-full space-y-8">
              {/* Header */}
              <div className="bg-white border-[3px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-black uppercase tracking-wide mb-1">
                      Burnside Skatepark
                    </h2>
                    <p className="text-md text-gray-700 font-medium">Portland, Oregon</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
                    <div>
                      <p className="text-sm text-gray-500">Session Time</p>
                      <p className="text-3xl font-bold text-black">{elapsedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-lg font-semibold text-green-600">Active</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Board</p>
                      <p className="text-lg font-semibold text-green-500">Connected</p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Button
                      onClick={handleStopSession}
                      className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-all border-2 border-black shadow"
                    >
                      Stop Session
                    </Button>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden aspect-video">
                <Canvas
                  shadows
                  camera={{ position: [5, 3, 5], fov: 60 }}
                  style={{ borderRadius: "1rem" }}
                >
                  <ambientLight intensity={0.4} />
                  <directionalLight
                    position={[5, 8, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                  />
                  <Physics>
                    <Skateboard />
                  </Physics>
                  <OrbitControls />
                  <Environment preset="sunset" />
                </Canvas>
              </div>

              {/* Heatmap */}
              <div className={cardStyle}>
                <h3 className="text-lg font-bold text-black mb-4">Skatepark Heatmap</h3>
                <div className="relative w-full h-80 bg-gray-100 border-2 border-dashed border-black rounded-lg overflow-hidden">
                  <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {audience.map((pos, i) => (
                      <circle
                        key={`aud-${i}`}
                        cx={pos.left}
                        cy={pos.top}
                        r="0.7"
                        fill="gray"
                        opacity="0.3"
                      />
                    ))}
                  </svg>
                  {presenters.map((pos, i) => (
                    <motion.div
                      key={`pres-${i}`}
                      className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{
                        backgroundColor: presenterColors[i],
                        top: `${pos.top}%`,
                        left: `${pos.left}%`,
                      }}
                      animate={{ y: [0, -2, 0] }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
