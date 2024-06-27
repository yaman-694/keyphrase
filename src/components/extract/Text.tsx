"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Loader from "./Loader";
import { Dispatch, SetStateAction, useState } from "react";
import { axiosClient } from "@/lib/axios";
import formatTextToList from "@/utils/extractPhrase";

const FormSchema = z.object({
  research_paper_text: z.string().min(100, {
    message: "Bio must be at least 100 characters.",
  }),
  numberOfKeyPhrase: z.string(),
});

export function Text({
  text,
  setKeyPhrases,
}: {
  text: string;
  setKeyPhrases: Dispatch<SetStateAction<string[] | string | null>>;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      research_paper_text: text,
      numberOfKeyPhrase: "5",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    try {
      const response = await axiosClient.post(
        "/process?number_of_key_phrases=" + data.numberOfKeyPhrase,
        { text: data.research_paper_text }
      );
      setKeyPhrases(formatTextToList(response.data.data));
      toast({
        title: "Success",
        description: "Successfully extracted key phrases",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occured while extracting key phrases",
        variant: "destructive",
      });
    }
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
          <FormField
            control={form.control}
            name="numberOfKeyPhrase"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Number of key phrases</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="5" />
                      </FormControl>
                      <FormLabel className="font-normal">5</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="10" />
                      </FormControl>
                      <FormLabel className="font-normal">10</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="15" />
                      </FormControl>
                      <FormLabel className="font-normal">15</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-1">
                <Loader />
                Hang Tight! Extracting KeyPhrases...
              </span>
            ) : (
              "Unveil KeyPhrases"
            )}
          </Button>
        </form>
      </Form>
      <div>
        <Label>Preview Text</Label>
        <p className="max-h-[400px] overflow-y-scroll"> {text}</p>
      </div>
    </div>
  );
}
