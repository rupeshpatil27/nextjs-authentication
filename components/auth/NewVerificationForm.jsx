"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./CardWrapper";

import { BeatLoader } from "react-spinners";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const VerificationContent = () => {
  const verificationStarted = useRef(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const onSubmit = useCallback(async () => {
    setError(null);
    if (!token) {
      setError("Missing token.");
      return;
    }

    try {
      const response = await axios.post("/api/new-verification", {
        token,
      });

      toast.success("success", { description: response.data.message });
      
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed.";
      setError(message);
      toast.error("Error", { description: message });
    }
  }, [token]);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex flex-col items-center w-full justify-center gap-4">
      {!error ? (
        <>
          <BeatLoader color="#2563eb" />
          <p className="text-sm text-muted-foreground">
            Validating your token...
          </p>
        </>
      ) : (
        <p className="text-destructive font-medium">{error}</p>
      )}
    </div>
  );
};

const NewVerificationForm = () => {
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonlabel="Back to login"
      backButtonHref="/sign-in"
    >
      <Suspense fallback={<BeatLoader color="#2563eb" />}>
        <VerificationContent />
      </Suspense>
    </CardWrapper>
  );
};

export default NewVerificationForm;
