"use client"
import { useState } from 'react';
import { Menu, X, Pencil, Users, Zap, Download, Github, Twitter } from 'lucide-react';

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const features = [
    {
      icon: <Pencil className="w-8 h-8" />,
      title: "Intuitive Drawing",
      description: "Create beautiful hand-drawn diagrams with our easy-to-use tools. No design skills required."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time. See changes as they happen, anywhere in the world."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Built for speed and performance. Start drawing instantly with no loading times."
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Export Anywhere",
      description: "Export your diagrams as PNG, SVG, or share them with a link. Your work, your way."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg transform group-hover:rotate-12 transition-transform duration-300"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Excalidraw
              </span>
            </div>``

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Features</a>
              <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">About</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Pricing</a>
              <a href="#docs" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Docs</a>
            </div>

            {/* Right side - Login/Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-shadow duration-200">
                    JD
                  </div>
                  <span className="text-gray-700 font-medium">John Doe</span>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-purple-600 py-2">Features</a>
              <a href="#about" className="block text-gray-700 hover:text-purple-600 py-2">About</a>
              <a href="#pricing" className="block text-gray-700 hover:text-purple-600 py-2">Pricing</a>
              <a href="#docs" className="block text-gray-700 hover:text-purple-600 py-2">Docs</a>
              {!isLoggedIn ? (
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <span className="text-gray-700 font-medium">John Doe</span>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Draw. Collaborate. Create.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The whiteboard tool that brings your ideas to life. Sketch, diagram, and collaborate in real-time with beautiful hand-drawn style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
              Start Drawing Now
            </button>
            <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-50 transform hover:-translate-y-1 transition-all duration-200">
              Watch Demo
            </button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-purple-200 transform hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Pencil className="w-24 h-24 mx-auto text-purple-400 mb-4" />
                  <p className="text-2xl text-gray-600 font-semibold">Your Canvas Awaits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make your workflow seamless and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-purple-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of teams already using Excalidraw
          </p>
          <button className="px-10 py-4 bg-white text-purple-600 rounded-lg text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg"></div>
                <span className="text-xl font-bold">Excalidraw</span>
              </div>
              <p className="text-gray-400">Making diagramming delightful</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Github className="w-6 h-6 cursor-pointer hover:text-purple-400 transition-colors" />
                <Twitter className="w-6 h-6 cursor-pointer hover:text-purple-400 transition-colors" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Excalidraw. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}