"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
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
import { resetSchema } from "@/schemas/resetSchema";
import { reset } from "@/actions/reset";

const ResetForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await reset(data);
      if (response?.error) {
        toast.error(response?.error);
      }

      if (response?.success) {
        form.reset();
        toast.success(response?.success);
      }
    } catch (error) {
      form.reset();
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonlabel="Back to sign in"
      backButtonHref="/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="m@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Sending email..." : "Send reset email"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
