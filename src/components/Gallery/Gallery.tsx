"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryProps } from "@/types/types";

export default function Gallery({ images, title }: GalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <Image
        src={current}
        alt={title}
        width={320}
        height={320}
        className="h-auto w-full rounded-sm border border-line-strong bg-white object-contain"
        priority
      />

      {images.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === active}
              className={`rounded-sm border p-0.5 ${
                index === active
                  ? "border-brand"
                  : "border-line-strong hover:border-brand"
              }`}
            >
              <Image
                src={image}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
