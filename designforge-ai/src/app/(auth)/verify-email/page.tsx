"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

type VerificationStatus = "verifying" | "success" | "error" | "idle";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "signup";
  const emailParam = searchParams.get("email");

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    if (tokenHash) {
      verifyToken();
    } else if (emailParam) {
      setStatus("idle");
    }
  }, [tokenHash, emailParam]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyToken = async () => {
    if (!tokenHash) return;

    setStatus("verifying");

    try {
      const { error } = await supabase.auth.verifyOtp({
        type: type as "signup" | "email" | "recovery",
        token_hash: tokenHash,
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      setStatus("success");
      toast.success("Email verified successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleResend = useCallback(async () => {
    if (!email || isResending || countdown > 0) return;

    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Verification email resent!");
      setCountdown(60);
    } catch {
      toast.error("Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, countdown, supabase]);

  const renderVerifying = () => (
    <div className="text-center space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-semibold text-foreground mt-4">Verifying your email...</h2>
        <p className="text-muted-foreground text-sm mt-2">Please wait while we verify your email address.</p>
      </motion.div>
    </div>
  );

  const renderSuccess = () => (
    <motion.div
      className="text-center space-y-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      >
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
      </motion.div>
      <h2 className="text-xl font-semibold text-foreground">Email Verified!</h2>
      <p className="text-muted-foreground text-sm">
        Your email has been successfully verified. Redirecting to login...
      </p>
      <Link
        href="/login"
        className="inline-block text-sm text-primary hover:text-primary-light transition-colors"
      >
        Go to login
      </Link>
    </motion.div>
  );

  const renderError = () => (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8 text-error" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Verification Failed</h2>
      <p className="text-muted-foreground text-sm">{errorMessage || "The verification link is invalid or has expired."}</p>
      <Button variant="outline" onClick={verifyToken} className="mt-2">
        Try Again
      </Button>
      {email && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={isResending || countdown > 0}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend Verification Email"}
          </Button>
        </div>
      )}
    </motion.div>
  );

  const renderIdle = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mt-4">Check your email</h2>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          We&apos;ve sent a verification email to{" "}
          <span className="text-foreground font-medium">{email || "your email address"}</span>.
          Please click the link in the email to verify your account.
        </p>
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={isResending || countdown > 0 || !email}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`} />
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="glass rounded-2xl p-8">
      {status === "verifying" && renderVerifying()}
      {status === "success" && renderSuccess()}
      {status === "error" && renderError()}
      {status === "idle" && renderIdle()}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}
