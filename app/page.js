"use client";
import React from "react";
import { BackgroundRippleEffect } from "@/app/components/ui/background-ripple-effect";
import HeroSection from "@/app/components/ui/hero";
import { HoverEffect } from "@/app/components/ui/card-hover-effect";
import {features} from "@/data/features";

export default function LandingPage() {
  return (
    <>
    <div className="absolute inset-0 -z-10 overflow-hidden">
          <BackgroundRippleEffect />
        </div>
          <HeroSection />
    <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
        Powerful tools for career growth
      </h2>
      <div>
        <HoverEffect items={features} />
      </div>
    </div>
    </>
      
    
  );
}
