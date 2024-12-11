"use client";
// using Shadcn!
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = z.object({
  name: z.string().refine((value) => value.trim() !== "", {
    message: "Name can't be empty.",
  }),
  website: z
    .string()
    .optional()
    .refine((value) => value === undefined || value.trim() !== "", {
      message: "Website can't be empty.",
    }),
  x: z
    .string()
    .optional()
    .refine((value) => value === undefined || value.trim() !== "", {
      message: "X username can't be empty.",
    }),
  instagram: z
    .string()
    .optional()
    .refine((value) => value === undefined || value.trim() !== "", {
      message: "Instagram username can't be empty.",
    }),
  color: z.enum(["red", "white", "black", "green"], {
    errorMap: () => ({ message: "Please select a color" }),
  }),
});

export default function Settings() {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website: "",
      x: "",
      instagram: "",
      color: "white",
    },
  });

  const { setValue, handleSubmit, watch } = form;

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
        setValue("name", userData.name || "");
        setValue("website", userData.website || "");
        setValue("x", userData.x || "");
        setValue("instagram", userData.instagram || "");
        setValue("color", userData.color || "white");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [userId, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("User updated successfully!");
      } else {
        toast.error("Oops! Couldn't update user :(");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center m-auto">Loading...</div>
    );
  }

  return (
    <main className="w-140 flex flex-col justify-center items-center m-auto mt-10">
      <h1 className="text-xl font-serif text-yellow-950 mb-5">
        {user.name}'s Garden Settings
      </h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your first name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your website" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter X username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Instagram handle" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={watch("color")}
                    onValueChange={(value) => setValue("color", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="red" id="red" />
                      <Label htmlFor="red">Red</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="white" id="white" />
                      <Label htmlFor="white">White</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="black" id="black" />
                      <Label htmlFor="black">Black</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="green" id="green" />
                      <Label htmlFor="green">Green</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <ToastContainer />
    </main>
  );
}
