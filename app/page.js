"use client";
import React from "react";
import { BackgroundRippleEffect } from "@/app/components/ui/background-ripple-effect";
import HeroSection from "@/app/components/ui/hero";
import { HoverEffect } from "@/app/components/ui/card-hover-effect";
import {features} from "@/data/features";
import { testimonials } from "@/data/testimonials";
import { InfiniteMovingCards } from "./components/ui/infinite-moving-cards";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import { faqs } from "@/data/faqs";

export default function LandingPage() {
  return (
    <>
    <div className="absolute inset-0 -z-10 overflow-hidden">
          <BackgroundRippleEffect />
        </div>
          <HeroSection />
    <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-5xl text-gray-400 font-bold tracking-tighter text-center mb-12 ">
        Powerful tools for career growth
      </h2>
      <div>
        <HoverEffect items={features} />
      </div>
    </div>
    <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">95%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>
    <div className="h-160 rounded-md flex flex-col antialiased bg-muted/50 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
    <h1 className="text-5xl mb-12">Trusted by Thousands</h1>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
    <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
