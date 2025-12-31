"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { settingSchema } from "@/schemas/settingSchema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { settings } from "@/actions/settings";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hook/use-current-user";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userRole } from "@/constants";
import { Switch } from "@/components/ui/switch";

const settingPage = () => {
  const { update } = useSession();

  const user = useCurrentUser();

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: undefined,
      email: undefined,
      role: undefined,
      isTwoFactorEnabled: false,
      password: undefined,
      newPassword: undefined,
    },
  });

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const data = await settings(values);

        if (data?.error) {
          toast.error(data.error);
          return;
        }

        if (data?.success) {
          await update();
          toast.success(data.success);

          form.resetField("password");
          form.resetField("newPassword");
        }
      } catch {
        toast.error("Something went wrong!");
      }
    });
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      form.reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || undefined,
        isTwoFactorEnabled: user.isTwoFactorEnabled || false,
        password: "",
        newPassword: "",
      });
    }
  }, [user, form]);

  if (!user) {
    return <div className="flex justify-center mt-10">Loading settings...</div>;
  }

  return (
    <div className="w-full flex justify-center mt-4">
      <Card className="w-150">
        <CardHeader>
          <p className="text-2xl font font-semibold text-center">Setting</p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="John Doe"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.isOAuth === false && (
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
                              placeholder="john.doe@example.com"
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
                              placeholder="********"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="********"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={userRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={userRole.USER}>User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.isOAuth === false && (
                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Two Factor Authentication</FormLabel>
                          <FormDescription>
                            Enable two factor authentication for your account
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <Button disabled={isPending} type="submit">
                {isPending ? "Updating..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default settingPage;
