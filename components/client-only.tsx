"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import components without SSR
const ServiceWorker = dynamic(() => import("@/components/service-worker"), {
  ssr: false,
});

export default function ClientOnly() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
    <>
      <ServiceWorker />
    </>
  );
}
