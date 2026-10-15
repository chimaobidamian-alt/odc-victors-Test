"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  // your existing verify logic here, keep it
  // e.g. const ref = searchParams.get("reference")
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Verifying payment...</h1>
      <p>Reference: {searchParams.get("reference")}</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
