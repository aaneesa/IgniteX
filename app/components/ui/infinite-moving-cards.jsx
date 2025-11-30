"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "right",
  speed = "fast",
  pauseOnHover = true,
  className
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "100s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}>
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}>
        {items.map((item, idx) => (
<li
  className="relative w-[300px] max-w-full shrink-0 rounded-xl border border-b-0 
             border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)]
             px-6 py-6 md:w-[380px] dark:border-zinc-700 
             dark:bg-[linear-gradient(180deg,#27272a,#18181b)]
             h-[220px] overflow-hidden"
  key={item.name}
>
  <blockquote>
    <span className="relative z-20 text-sm leading-[1.45] text-neutral-800 dark:text-gray-100 line-clamp-6">
      {item.quote}
    </span>

    <div className="relative z-20 mt-5 flex flex-row items-center">
      <span className="flex flex-col gap-1">
        <span className="text-sm text-neutral-500 dark:text-gray-400">
          {item.name}
        </span>
        <span className="text-sm text-neutral-500 dark:text-gray-400">
          {item.title}
        </span>
      </span>
    </div>
  </blockquote>
</li>


        ))}
      </ul>
    </div>
  );
};
