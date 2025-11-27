"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Users, Zap, Lock, ArrowRight, Sparkles, MousePointer2, Palette, Globe, Shield } from "lucide-react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    setIsLoggedIn(true);
  }, [router]);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg animate-pulse">Loading your canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.3), transparent 40%)`
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-150"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Pencil className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              DrawCollab
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500 border border-red-500/50 hover:border-red-500 rounded-full font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8 backdrop-blur-md animate-bounce">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold text-purple-300">Real-time Collaborative Drawing Experience</span>
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Draw Together,
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Create Magic ✨
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
            The ultimate collaborative whiteboard for teams. Sketch, brainstorm, and bring ideas to life together in real-time.
          </p>

          {/* Join Room Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl max-w-3xl mx-auto hover:border-purple-500/50 transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center gap-3 mb-8">
              <MousePointer2 className="w-7 h-7 text-purple-400 animate-bounce" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Start Drawing Now
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input 
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleJoinRoom();
                }}
                placeholder="Enter your room name..."
                className="flex-1 px-6 py-5 bg-white/5 border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all backdrop-blur-sm"
              />

              <button 
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                className={`group px-8 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center gap-3 justify-center whitespace-nowrap ${
                  !roomId.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-110 hover:shadow-purple-500/50 hover:shadow-2xl animate-pulse'
                }`}
              >
                Join Room
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secure & encrypted • Share room name with your team</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
          {[
            {
              icon: <Users className="w-7 h-7" />,
              title: "Real-time Collaboration",
              description: "Draw with unlimited team members simultaneously",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: <Zap className="w-7 h-7" />,
              title: "Lightning Fast",
              description: "Zero lag with WebSocket technology",
              color: "from-yellow-500 to-orange-500"
            },
            {
              icon: <Lock className="w-7 h-7" />,
              title: "Secure & Private",
              description: "End-to-end encrypted drawing sessions",
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: <Palette className="w-7 h-7" />,
              title: "Rich Tools",
              description: "Professional drawing and design toolkit",
              color: "from-purple-500 to-pink-500"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-7 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
              style={{
                animation: `fadeIn 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Visual Showcase */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-1 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition-all duration-500">
            <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 rounded-3xl p-16 flex items-center justify-center min-h-[500px]">
              <div className="text-center">
                <div className="relative inline-block mb-8">
                  <Pencil className="w-32 h-32 text-purple-400 animate-pulse" />
                  <div className="absolute -top-4 -right-4">
                    <Globe className="w-12 h-12 text-pink-400 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  Your Canvas Awaits
                </h3>
                <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-8">
                  Create stunning diagrams, sketch brilliant ideas, brainstorm with your team, or simply let your creativity flow freely!
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Unlimited Rooms</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Infinite Canvas</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Auto-Save</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-8 mt-20">
        <div className="text-center text-gray-400 text-sm">
          <p>Made with 💜 for creative teams everywhere</p>
        </div>
      </footer>
    </div>
  );
}