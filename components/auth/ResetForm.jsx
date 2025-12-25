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
import axios from "axios";

const ResetForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(false);

    try {
      const response = await axios.post("/api/reset", data);

      toast.success("success", { description: response.data.message });

      // router.replace(`verify/${data.email}`);
    } catch (error) {
      console.log(error);
      toast.error("Error!", {
        description: error.response?.data.message || "Something went wrong!",
      });
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
