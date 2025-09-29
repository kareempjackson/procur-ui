"use client";

import { FC, useState } from "react";

const ComponentsPage: FC = () => {
  const [activeTab, setActiveTab] = useState("buttons");

  const tabs = [
    { id: "buttons", label: "Buttons" },
    { id: "forms", label: "Forms" },
    { id: "colors", label: "Colors" },
    { id: "cards", label: "Cards" },
    { id: "inputs", label: "Inputs" },
    { id: "navigation", label: "Navigation" },
  ];

  return (
    <div className="min-h-screen bg-white font-[var(--font-family)]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-2">
                Design System Components
              </h1>
              <p className="text-[var(--primary-base)] text-lg">
                Explore our comprehensive component library inspired by modern
                design principles
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-ghost rounded-full px-6 py-3">
                Documentation
              </button>
              <button className="btn btn-primary rounded-full px-6 py-3">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-100 sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium rounded-t-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gray-50 text-[var(--secondary-black)] border-b-2 border-[var(--primary-accent2)]"
                    : "text-[var(--primary-base)] hover:text-[var(--secondary-black)] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Buttons Section */}
        {activeTab === "buttons" && (
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
                Button Components
              </h2>

              {/* Primary Buttons */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Primary Buttons
                </h3>
                <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <button className="btn btn-primary rounded-full px-8 py-3 text-base">
                    Get Started
                  </button>
                  <button className="btn btn-primary rounded-full px-6 py-3">
                    Learn More
                  </button>
                  <button className="btn btn-primary rounded-full px-5 py-2 text-sm">
                    Small Action
                  </button>
                  <button className="btn btn-primary rounded-full px-10 py-4 text-lg font-semibold">
                    Large CTA
                  </button>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Secondary Buttons
                </h3>
                <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <button className="btn btn-secondary rounded-full px-8 py-3">
                    Secondary Action
                  </button>
                  <button className="btn btn-secondary rounded-full px-6 py-3">
                    Alternative
                  </button>
                  <button className="btn btn-secondary rounded-full px-5 py-2 text-sm">
                    Small Secondary
                  </button>
                </div>
              </div>

              {/* Ghost Buttons */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Ghost Buttons
                </h3>
                <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <button className="btn btn-ghost rounded-full px-8 py-3">
                    Ghost Button
                  </button>
                  <button className="btn btn-ghost rounded-full px-6 py-3">
                    Outline Style
                  </button>
                  <button className="btn btn-ghost rounded-full px-5 py-2 text-sm">
                    Small Ghost
                  </button>
                </div>
              </div>

              {/* Button States */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Button States
                </h3>
                <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <button className="btn btn-primary rounded-full px-6 py-3">
                    Normal
                  </button>
                  <button className="btn btn-primary rounded-full px-6 py-3 hover:bg-[var(--primary-accent3)]">
                    Hover
                  </button>
                  <button
                    className="btn btn-primary rounded-full px-6 py-3 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Disabled
                  </button>
                  <button className="btn btn-primary rounded-full px-6 py-3 animate-pulse">
                    Loading...
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Forms Section */}
        {activeTab === "forms" && (
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
                Form Components
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-6">
                    Contact Form
                  </h3>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Category
                      </label>
                      <select className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all appearance-none cursor-pointer">
                        <option value="general">General Inquiry</option>
                        <option value="support">Support</option>
                        <option value="sales">Sales</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-6 py-4 rounded-3xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-full border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                      />
                      <label className="text-sm text-[var(--primary-base)]">
                        Subscribe to our newsletter for updates
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full py-4"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Login Form */}
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-6">
                    Login Form
                  </h3>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Enter your password"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded-full border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                        />
                        <label className="text-sm text-[var(--primary-base)]">
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        className="text-sm text-[var(--primary-accent2)] hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full py-4"
                    >
                      Sign In
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-[var(--primary-base)]">
                        Don't have an account?{" "}
                        <a
                          href="#"
                          className="text-[var(--primary-accent2)] hover:underline font-medium"
                        >
                          Sign up
                        </a>
                      </span>
                    </div>
                  </form>
                </div>
              </div>

              {/* Form Input Variations */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-6">
                  Input Variations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Text Inputs */}
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Text Inputs
                    </h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Standard input"
                      />
                      <input
                        type="email"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Email input"
                      />
                      <input
                        type="password"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Password input"
                      />
                      <div className="relative">
                        <input
                          type="search"
                          className="w-full px-6 py-4 pl-12 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                          placeholder="Search..."
                        />
                        <svg
                          className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Selection Inputs */}
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Selection Inputs
                    </h4>
                    <div className="space-y-4">
                      <select className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all appearance-none cursor-pointer">
                        <option>Choose an option</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>

                      <textarea
                        rows={3}
                        className="w-full px-6 py-4 rounded-3xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all resize-none"
                        placeholder="Textarea with rounded corners"
                      />

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-full border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Checkbox option 1
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-full border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Checkbox option 2
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="radio-demo"
                            className="w-5 h-5 border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Radio choice A
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="radio-demo"
                            className="w-5 h-5 border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Radio choice B
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form States */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-6">
                  Form States
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Normal State
                    </h4>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                      placeholder="Normal input"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Focused State
                    </h4>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-full border-2 border-[var(--primary-accent2)] bg-white ring-2 ring-[var(--primary-accent2)] ring-opacity-20 transition-all"
                      placeholder="Focused input"
                      value="Sample text"
                      readOnly
                    />
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Disabled State
                    </h4>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-full border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      placeholder="Disabled input"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Colors Section */}
        {activeTab === "colors" && (
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
                Color Palette
              </h2>

              {/* Primary Colors */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Primary Colors
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--primary-background)] rounded-2xl mb-4 border border-gray-200"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Background
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #F2EFE6
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--primary-base)] rounded-2xl mb-4"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Base
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #6C715D
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--primary-accent1)] rounded-2xl mb-4"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Accent 1
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #E0A374
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--primary-accent2)] rounded-2xl mb-4"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Accent 2
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #CB5927
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                </div>
              </div>

              {/* Secondary Colors */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Secondary Colors
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--secondary-soft-highlight)] rounded-2xl mb-4"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Soft Highlight
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #C0D1C7
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--secondary-muted-edge)] rounded-2xl mb-4"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Muted Edge
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #407178
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--secondary-highlight1)] rounded-2xl mb-4"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Highlight 1
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #D3E458
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <div className="w-full h-20 bg-[var(--secondary-highlight2)] rounded-2xl mb-4"></div>
                    <h4 className="font-semibold text-[var(--secondary-black)]">
                      Highlight 2
                    </h4>
                    <p className="text-sm text-[var(--primary-base)]">
                      #A6B1E7
                    </p>
                    <button className="btn btn-ghost text-xs mt-2">Copy</button>
                  </div>
                </div>
              </div>

              {/* Color Usage Examples */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Color Usage Examples
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[var(--primary-accent2)] text-white rounded-3xl p-6">
                    <h4 className="font-semibold mb-2">Primary Actions</h4>
                    <p className="text-sm opacity-90 mb-4">
                      Used for main call-to-action buttons and important
                      interactive elements.
                    </p>
                    <button className="bg-white text-[var(--primary-accent2)] px-4 py-2 rounded-full text-sm font-medium">
                      Example Button
                    </button>
                  </div>
                  <div className="bg-[var(--secondary-muted-edge)] text-white rounded-3xl p-6">
                    <h4 className="font-semibold mb-2">Secondary Actions</h4>
                    <p className="text-sm opacity-90 mb-4">
                      Used for secondary buttons and supporting interactive
                      elements.
                    </p>
                    <button className="bg-white text-[var(--secondary-muted-edge)] px-4 py-2 rounded-full text-sm font-medium">
                      Example Button
                    </button>
                  </div>
                  <div className="bg-[var(--secondary-highlight1)] text-[var(--secondary-black)] rounded-3xl p-6">
                    <h4 className="font-semibold mb-2">Highlights</h4>
                    <p className="text-sm opacity-80 mb-4">
                      Used for success states, notifications, and accent
                      elements.
                    </p>
                    <button className="bg-[var(--secondary-black)] text-white px-4 py-2 rounded-full text-sm font-medium">
                      Example Button
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cards Section */}
        {activeTab === "cards" && (
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
                Card Components
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                    Basic Card
                  </h3>
                  <p className="text-[var(--primary-base)] mb-4">
                    A simple card component with rounded corners and clean flat
                    design for content organization.
                  </p>
                  <button className="btn btn-ghost">Learn More</button>
                </div>

                {/* Feature Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-[var(--primary-accent2)] rounded-2xl flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                    Feature Card
                  </h3>
                  <p className="text-[var(--primary-base)] mb-4">
                    Enhanced card with icon for highlighting key features with
                    flat design.
                  </p>
                  <button className="btn btn-primary">Get Started</button>
                </div>

                {/* Stats Card */}
                <div className="bg-[var(--primary-accent2)] text-white rounded-3xl p-6 border border-gray-200">
                  <h3 className="text-3xl font-bold mb-2">2.5K+</h3>
                  <p className="text-lg font-medium mb-1">Active Users</p>
                  <p className="text-sm opacity-90">Growing every day</p>
                </div>

                {/* Testimonial Card */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[var(--secondary-soft-highlight)] rounded-full flex items-center justify-center mr-3">
                      <span className="text-[var(--secondary-black)] font-semibold">
                        JD
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--secondary-black)]">
                        John Doe
                      </h4>
                      <p className="text-sm text-[var(--primary-base)]">
                        Product Manager
                      </p>
                    </div>
                  </div>
                  <p className="text-[var(--primary-base)] italic">
                    "This design system has transformed how we build
                    interfaces. The components are beautiful and
                    functional."
                  </p>
                </div>

                {/* Pricing Card */}
                <div className="bg-white rounded-3xl p-6 border-2 border-[var(--primary-accent2)]">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
                      Pro Plan
                    </h3>
                    <div className="text-3xl font-bold text-[var(--primary-accent2)] mb-1">
                      $29
                    </div>
                    <p className="text-[var(--primary-base)]">per month</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-[var(--primary-base)]">
                      <svg
                        className="w-4 h-4 text-[var(--secondary-highlight1)] mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Unlimited projects
                    </li>
                    <li className="flex items-center text-[var(--primary-base)]">
                      <svg
                        className="w-4 h-4 text-[var(--secondary-highlight1)] mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center text-[var(--primary-base)]">
                      <svg
                        className="w-4 h-4 text-[var(--secondary-highlight1)] mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Advanced analytics
                    </li>
                  </ul>
                  <button className="btn btn-primary w-full">
                    Choose Plan
                  </button>
                </div>

                {/* Image Card */}
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-200">
                  <div className="h-40 bg-[var(--primary-accent1)]"></div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-[var(--secondary-black)] mb-3">
                      Image Card
                    </h3>
                    <p className="text-[var(--primary-base)] mb-4">
                      Card component with solid color header and content
                      section.
                    </p>
                    <button className="btn btn-ghost">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Inputs Section */}
        {activeTab === "inputs" && (
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
                Input Components
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Text Inputs */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[var(--primary-base)]">
                    Text Inputs
                  </h3>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Standard Input
                      </label>
                      <input
                        type="text"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Enter text here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Email Input
                      </label>
                      <input
                        type="email"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Password Input
                      </label>
                      <input
                        type="password"
                        className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                        placeholder="Enter password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Search Input
                      </label>
                      <div className="relative">
                        <input
                          type="search"
                          className="w-full px-6 py-4 pl-12 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                          placeholder="Search..."
                        />
                        <svg
                          className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selection Inputs */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[var(--primary-base)]">
                    Selection Inputs
                  </h3>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Select Dropdown
                      </label>
                      <select className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all appearance-none cursor-pointer">
                        <option>Choose an option</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Textarea
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-6 py-4 rounded-3xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all resize-none"
                        placeholder="Enter your message..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-3">
                        Checkboxes
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Option 1
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Option 2
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-3">
                        Radio Buttons
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="radio-group-inputs"
                            className="w-5 h-5 border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Choice A
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="radio-group-inputs"
                            className="w-5 h-5 border-2 border-gray-300 text-[var(--primary-accent2)] focus:ring-[var(--primary-accent2)] mr-3"
                          />
                          <span className="text-[var(--primary-base)]">
                            Choice B
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input States */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-6">
                  Input States
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Normal
                    </h4>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent transition-all"
                      placeholder="Normal input"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Focused
                    </h4>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-full border-2 border-[var(--primary-accent2)] bg-white ring-2 ring-[var(--primary-accent2)] ring-opacity-20 transition-all"
                      placeholder="Focused input"
                      value="Sample text"
                      readOnly
                    />
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Error
                    </h4>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-full border-2 border-red-300 bg-white ring-2 ring-red-200 transition-all"
                      placeholder="Error input"
                      value="Invalid input"
                      readOnly
                    />
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h4 className="font-semibold text-[var(--secondary-black)] mb-4">
                      Disabled
                    </h4>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-full border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      placeholder="Disabled input"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Navigation Section */}
        {activeTab === "navigation" && (
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-black)] mb-6">
                Navigation Components
              </h2>

              {/* Breadcrumbs */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Breadcrumbs
                </h3>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                      <li>
                        <a
                          href="#"
                          className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)] px-3 py-1 rounded-full hover:bg-white transition-all"
                        >
                          Home
                        </a>
                      </li>
                      <li>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[var(--primary-base)] hover:text-[var(--primary-accent2)] px-3 py-1 rounded-full hover:bg-white transition-all"
                        >
                          Components
                        </a>
                      </li>
                      <li>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </li>
                      <li>
                        <span className="text-[var(--secondary-black)] font-medium px-3 py-1 bg-white rounded-full">
                          Navigation
                        </span>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              {/* Pagination */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Pagination
                </h3>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <nav className="flex items-center justify-center space-x-2">
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] rounded-full hover:bg-white transition-all">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full">
                      1
                    </button>
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] rounded-full hover:bg-white transition-all">
                      2
                    </button>
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] rounded-full hover:bg-white transition-all">
                      3
                    </button>
                    <span className="px-4 py-2 text-gray-400">...</span>
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] rounded-full hover:bg-white transition-all">
                      10
                    </button>
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] rounded-full hover:bg-white transition-all">
                      Next
                    </button>
                  </nav>
                </div>
              </div>

              {/* Menu */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Menu
                </h3>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <nav className="space-y-2">
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-[var(--secondary-black)] bg-white rounded-2xl font-medium shadow-sm"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                      </svg>
                      Dashboard
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-[var(--primary-base)] hover:text-[var(--secondary-black)] hover:bg-white rounded-2xl transition-all"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                      Team
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-[var(--primary-base)] hover:text-[var(--secondary-black)] hover:bg-white rounded-2xl transition-all"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Projects
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-[var(--primary-base)] hover:text-[var(--secondary-black)] hover:bg-white rounded-2xl transition-all"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </a>
                  </nav>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Tab Navigation
                </h3>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex space-x-1 mb-6">
                    <button className="px-6 py-3 bg-white text-[var(--secondary-black)] rounded-full font-medium shadow-sm">
                      Overview
                    </button>
                    <button className="px-6 py-3 text-[var(--primary-base)] hover:text-[var(--secondary-black)] hover:bg-white rounded-full transition-all">
                      Analytics
                    </button>
                    <button className="px-6 py-3 text-[var(--primary-base)] hover:text-[var(--secondary-black)] hover:bg-white rounded-full transition-all">
                      Reports
                    </button>
                    <button className="px-6 py-3 text-[var(--primary-base)] hover:text-[var(--secondary-black)] hover:bg-white rounded-full transition-all">
                      Settings
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl p-4">
                    <p className="text-[var(--primary-base)]">
                      Tab content goes here. This is the Overview tab content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Pills */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary-base)] mb-4">
                  Navigation Pills
                </h3>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium">
                      Active
                    </span>
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] hover:bg-white rounded-full text-sm transition-all">
                      Inactive
                    </button>
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] hover:bg-white rounded-full text-sm transition-all">
                      Another
                    </button>
                    <button className="px-4 py-2 text-[var(--primary-base)] hover:text-[var(--primary-accent2)] hover:bg-white rounded-full text-sm transition-all">
                      Option
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-4">
              Ready to build with our components?
            </h3>
            <p className="text-[var(--primary-base)] mb-6">
              Start creating beautiful interfaces with our comprehensive design
              system.
            </p>
            <div className="flex justify-center gap-4">
              <button className="btn btn-primary rounded-full px-8 py-3">
                Get Started
              </button>
              <button className="btn btn-ghost rounded-full px-8 py-3">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComponentsPage;
