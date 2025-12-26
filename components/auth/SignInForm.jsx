"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import CardWrapper from "./CardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signInSchema } from "@/schemas/signInSchema";

const SignInForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          if (result.error === "InvalidCredentials") {
            toast.error("Invalid credentials", {
              description: "Please check your email and password.",
            });
          } else if (result.error === "InvalidCode") {
            toast.error("Incorrect Code", {
              description:
                "The verification code you entered is incorrect. Please check the code and try again.",
            });
          } else if (result.error === "ExpiredCode") {
            toast.error("Code Expired", {
              description:
                "This verification code has expired for your security. Please request a new code to sign in.",
            });
          } else if (result.error === "VerificationEmailSent") {
            form.reset();
            toast.success("Verification email sent!", {
              description:
                "A new verification link has been sent to your email.",
            });
          } else if (result.error === "2FAEmailSent") {
            setShowTwoFactor(true);
            toast.success("Email sent!", {
              description:
                "Security code sent! If you don't see it, please check your spam folder.",
            });
          } else {
            form.reset();
            toast.error("Something went wrong");
          }
          // AccessDenied
          return;
        }

        if (result?.ok) {
          form.reset();
          toast.success("Signed in successfully");
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        form.reset();
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonlabel="Don't have an account?"
      backButtonHref="/sign-up"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="123456"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="m@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal w-fit"
                      >
                        <Link href="/reset">Forget password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {showTwoFactor
              ? isPending
                ? "Verifying..."
                : "Confirm"
              : isPending
                ? "Signing in..."
                : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignInForm;
