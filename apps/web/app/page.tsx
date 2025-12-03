"use client"
import { useState } from 'react';
import { Menu, X, Pencil, Users, Zap, Download, Github, Twitter, Sparkles, ArrowRight, Check, Star } from 'lucide-react';
// import { useSession, signOut } from 'next-auth/react'
export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  const handleLogin = () => {
    window.location.href = '/signin';
  };

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

  const benefits = [
    "Unlimited drawings",
    "Real-time collaboration",
    "Cloud sync across devices"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Excalidraw
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">About</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</a>
              <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Docs</a>
            </div>

            {/* Right side - Login/Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button 
                    onClick={handleLogin}
                    className="px-5 py-2 text-gray-700 font-semibold hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleGetStarted}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                    JD
                  </div>
                  <span className="text-gray-700 font-medium">John Doe</span>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-gray-900 py-2 font-medium">Features</a>
              <a href="#about" className="block text-gray-600 hover:text-gray-900 py-2 font-medium">About</a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900 py-2 font-medium">Pricing</a>
              <a href="#docs" className="block text-gray-600 hover:text-gray-900 py-2 font-medium">Docs</a>
              {!isLoggedIn ? (
                <div className="space-y-2 pt-2">
                  <button 
                    onClick={handleLogin}
                    className="w-full px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleGetStarted}
                    className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-6 border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Now with AI-powered features</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
            Draw. Collaborate.
            <br />
            <span className="text-blue-600">Create Magic.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            The whiteboard tool that brings your ideas to life. Sketch, diagram, and collaborate in real-time with beautiful hand-drawn style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={handleGetStarted}
              className="group px-10 py-5 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Start Drawing Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-bold hover:border-gray-400 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Watch Demo
            </button>
          </div>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-4 mb-16 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Hero Image/Canvas */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-200">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-32 h-32 border-4 border-blue-200 rounded-lg transform rotate-12"></div>
                <div className="absolute bottom-4 right-4 w-40 h-40 border-4 border-green-200 rounded-full"></div>
                
                <div className="text-center relative z-10">
                  <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer">
                    <Pencil className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    Your Canvas Awaits
                  </p>
                  <p className="text-gray-500">Start creating in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-6 font-medium">Trusted by creative teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <span className="text-2xl font-bold text-gray-400">Mictosoft</span>
            <span className="text-2xl font-bold text-gray-400">AWS</span>
            <span className="text-2xl font-bold text-gray-400">Maven</span>
            <span className="text-2xl font-bold text-gray-400">Google</span>
          </div>
        </div>  
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-semibold mb-4 border border-blue-100">
              Features
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
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
                className="group bg-white rounded-xl p-8 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 hover:border-blue-300"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="text-5xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="text-5xl font-bold text-green-600 mb-2">50M+</div>
              <div className="text-gray-600 font-medium">Diagrams Created</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="text-5xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-600 rounded-2xl p-12 md:p-16 text-center shadow-xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Creating?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of teams already using Excalidraw to bring their ideas to life
            </p>
            <button 
              onClick={handleGetStarted}
              className="group px-12 py-5 bg-white text-blue-600 rounded-lg text-lg font-bold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-blue-100 mt-6 text-sm">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">Excalidraw</span>
              </div>
              <p className="text-gray-400 leading-relaxed">Making diagramming delightful for everyone</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Connect</h4>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </div>
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