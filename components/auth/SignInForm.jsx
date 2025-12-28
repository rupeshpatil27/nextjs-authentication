"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useState, useTransition } from "react";
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
import { signInSchema } from "@/schemas/signInSchema";
import { signin } from "@/actions/sign-in";

const SignInForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = async (data) => {
    startTransition(async () => {
      try {
        const response = await signin(data);
        if (response?.error) {
          toast.error(response?.error);
        }

        if (response?.success) {
          toast.success(response?.success);
        }

        if (response?.twoFactor) {
          setShowTwoFactor(true);
        }
      } catch (error) {
        form.reset();
        console.log(error);
        toast.error(error.message);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel={showTwoFactor ? "Two-Factor Authentication" : "Welcome back"}
      backButtonlabel={
        showTwoFactor ? "Back to Login" : "Don't have an account?"
      }
      backButtonHref={showTwoFactor ? "#" : "/sign-up"}
      showSocial={!showTwoFactor}
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
                    <FormLabel>Security Code</FormLabel>
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
                      <FormMessage />
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal w-fit"
                      >
                        <Link href="/reset">Forget password?</Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending
              ? showTwoFactor
                ? "Verifying..."
                : "Signing in..."
              : showTwoFactor
                ? "Confirm Code"
                : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignInForm;
