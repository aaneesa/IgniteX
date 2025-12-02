"use client";

export default function PrimaryButton({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`
        border text-xs sm:text-sm font-medium relative
        border-neutral-200 dark:border-white/20
        text-black dark:text-white px-3 py-1.5 sm:px-5 sm:py-2
        rounded-full overflow-hidden ${className}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px
                       bg-linear-to-r from-transparent via-red-500 to-transparent h-px" />
    </button>
  );
}
