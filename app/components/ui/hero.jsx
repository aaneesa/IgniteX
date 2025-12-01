"use client";

import React from "react";
import  { HoverBorderGradient } from "@/app/components/ui/hover-border-gradient";
import Link from "next/link";

const HeroSection = () => {

  return (
    <section className="w-full pt-36 md:pt-38 pb-10 mb-32">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-4xl font-bold md:text-6xl lg:text-6xl xl:text-8xl gradient-title animate-gradient text-gray-300 ">
            Intelligent Career Guidance for 
            <br />
            a Future-Ready You
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Boost your job readiness with curated career advice, targeted interview coaching, and AI-powered insights.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/roadmap">
            <HoverBorderGradient size="lg" className="px-8">
              Get Started
            </HoverBorderGradient>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;