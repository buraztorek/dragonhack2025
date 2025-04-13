"use client"

import { useState } from "react"
import { Clock, MapPin, Users, Sun, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SkateparkCardProps {
  handleStartSession: () => void;
}


export default function SkateparkCard({ handleStartSession }: SkateparkCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Add RGB glow animation
  const rgbGlowStyle = `
  @keyframes rgbGlow {
    0% { box-shadow: 0 0 10px rgba(255,0,0,0.5), 0 0 20px rgba(0,255,0,0.3), 0 0 30px rgba(0,0,255,0.2); }
    33% { box-shadow: 0 0 10px rgba(0,255,0,0.5), 0 0 20px rgba(255,0,0,0.3), 0 0 30px rgba(0,255,0,0.2); }
    66% { box-shadow: 0 0 10px rgba(0,0,255,0.5), 0 0 20px rgba(0,255,0,0.3), 0 0 30px rgba(255,0,0,0.2); }
    100% { box-shadow: 0 0 10px rgba(255,0,0,0.5), 0 0 20px rgba(0,255,0,0.3), 0 0 30px rgba(0,0,255,0.2); }
  }
`

  // Sample data - this would normally come from an API
  const skateparkData = {
    name: "BURNSIDE SKATEPARK",
    location: "Portland, Oregon",
    skaterCount: 23,
    isOpen: true,
    openHours: "7:00 AM - 11:00 PM",
    weather: "Partly Cloudy, 22°C",
    difficulty: "Intermediate to Pro",
  }

  return (
    <div className="w-full bg-gray-100">
      <div className="p-8 flex flex-col items-center justify-center gap-6">
        <style dangerouslySetInnerHTML={{ __html: rgbGlowStyle }} />
        <Card
          className={cn(
            "relative w-full max-w-md p-0 overflow-hidden transition-all duration-300 bg-white",
            "border-[3px] border-black rounded-xl",
            "shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]",
            isHovered ? "translate-y-[-2px] translate-x-[-2px] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.8)]" : "",
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Header with location icon */}
          <div className="border-b-[3px] border-black p-4 flex justify-between items-center bg-gradient-to-r from-white to-gray-100">
            <h2 className="text-2xl font-black text-black tracking-tight uppercase">{skateparkData.name}</h2>
            <div className="bg-black p-2 rounded-full">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Main content */}
          <div className="p-5 space-y-4 relative">
            {/* Welcome message */}
            <div className="mb-6">
              <p className="text-gray-600 font-medium">YOU ARE LOCATED AT</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-black font-bold text-lg">{skateparkData.location}</p>
                <ArrowRight className="h-4 w-4" />
                <Badge className="bg-black hover:bg-gray-800 text-white font-bold">WELCOME</Badge>
              </div>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-2 gap-4">
              {/* Skater count */}
              <div className="border-2 border-black rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Skaters:</span>
                  </div>
                  <span className="font-bold text-black text-lg">{skateparkData.skaterCount}</span>
                </div>
              </div>

              {/* Open status */}
              <div className="border-2 border-black rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Status:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${skateparkData.isOpen ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="font-bold text-black">{skateparkData.isOpen ? "OPEN" : "CLOSED"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="space-y-3 pt-2 border-t-2 border-dashed border-gray-300 mt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <p>
                  Hours: <span className="font-semibold">{skateparkData.openHours}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Sun className="h-4 w-4" />
                <p>
                  Weather: <span className="font-semibold">{skateparkData.weather}</span>
                </p>
              </div>
              <div className="mt-3">
                <Badge variant="outline" className="border-black text-black">
                  {skateparkData.difficulty}
                </Badge>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-2 -bottom-2 w-24 h-24 opacity-5 rotate-12">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M50,5 L95,50 L50,95 L5,50 Z" fill="black" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="black" strokeWidth="5" />
              </svg>
            </div>
          </div>

          {/* Footer with graffiti-style decorative elements */}
          <div className="border-t-[3px] border-black p-3 bg-black text-white text-xs font-medium text-center">
            SKATE AT YOUR OWN RISK • HELMETS RECOMMENDED • NO BMX AFTER 8PM
          </div>
        </Card>

        {/* Board Connection Section - Updated from AI Detection */}
        <div className="w-full max-w-md p-5 overflow-hidden border-b-[3px] border-black rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>
              <h3 className="text-lg font-bold text-black">SKATEBOARD CONNECTED</h3>
            </div>
            <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold">READY TO SHRED</Badge>
          </div>

          <div
            className="rounded-lg p-4 bg-transparent mb-4 relative animate-pulse-slow"
            style={{
              boxShadow: "0 0 10px rgba(255,0,0,0.5), 0 0 20px rgba(0,255,0,0.3), 0 0 10px rgba(0,0,255,0)",
              animation: "rgbGlow 10s infinite linear",
            }}
          >
            <p className="font-medium text-black text-center">
              Start rolling and we will automatically record your session. Your smart deck is locked in and ready to
              capture all your sick tricks.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-sm text-gray-500 mb-1">- or -</p>
            <button
              onClick={handleStartSession}
              className={cn(
                "px-6 py-2 bg-black text-white font-bold rounded-lg",
                "border-2 border-black",
                "hover:bg-gray-800 transition-colors",
                "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]",
                "active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]",
              )}
            >
              START SESSION
            </button>

            <div className="text-xs text-gray-500 text-center w-full mt-2">
              BOARD TRACKING WORKS BEST ON SMOOTH CONCRETE • MANUAL START FOR STREET SPOTS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
