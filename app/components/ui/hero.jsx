"use client";

import React from "react";
import  { HoverBorderGradient } from "@/app/components/ui/hover-border-gradient";
import Link from "next/link";

const HeroSection = () => {

  return (
    <section className="w-full pt-36 md:pt-38 pb-10 mb-32">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
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