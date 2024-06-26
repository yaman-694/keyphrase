"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Label } from "../ui/label";

const FormSchema = z.object({
  research_paper_text: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(10000, {
      message: "Bio must not be longer than 30 characters.",
    }),
});

export function Text({ text }: { text: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      research_paper_text: text,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="research_paper_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article/Paper text</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[400px]" {...field} />
                </FormControl>
                <FormDescription>
                  Extracted text from document you uploaded
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div>
        <Label>Preview Text</Label>
        <p className="max-h-96 overflow-y-auto"> {text}</p>
      </div>
    </div>
  );
}
