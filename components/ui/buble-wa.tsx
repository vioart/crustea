"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppBubble() {
  return (
    <a
      href="https://wa.me/6282140773592"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat dengan Crustea melalui WhatsApp"
      className="group fixed bottom-6 right-6 z-[9999]"
    >
      {/* BUBBLE */}
      <div className="relative flex size-14 items-center justify-center rounded-full bg-[#16763F] text-2xl text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#145c32]">
        {/* PULSE EFFECT */}
        <span
          className="absolute inset-0 animate-ping rounded-full bg-[#16763F] opacity-30"
          aria-hidden="true"
        />

        {/* ICON */}
        <FaWhatsapp className="relative z-10" aria-hidden="true" />
      </div>

      {/* TOOLTIP */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-black px-3 py-1 text-xs text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}