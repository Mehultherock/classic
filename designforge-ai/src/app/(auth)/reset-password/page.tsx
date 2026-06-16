"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleRecovery = async () => {
      try {
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setIsValidToken(true);
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidToken(true);
        }
      } catch {
        setIsValidToken(false);
      } finally {
        setIsChecking(false);
      }
    };

    handleRecovery();
  }, [searchParams, supabase]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSuccess(true);
      toast.success("Password reset successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (isChecking) {
    return (
      <div className="glass rounded-2xl p-8 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Verifying your reset link...</p>
        </motion.div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="glass rounded-2xl p-8 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mt-4">Invalid or Expired Link</h2>
          <p className="text-muted-foreground text-sm mt-2">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button className="mt-4" onClick={() => router.push("/forgot-password")}>
            Request New Link
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="glass rounded-2xl p-8 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mt-4">Password Reset!</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Your password has been successfully reset. Redirecting to login...
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 text-sm text-primary hover:text-primary-light transition-colors"
          >
            Go to login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-foreground">Reset your password</h2>
        <p className="text-muted-foreground mt-1">Enter your new password below</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Input
          label="New Password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 8 characters"
          icon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register("password")}
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          icon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Reset Password
        </Button>
      </motion.form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
