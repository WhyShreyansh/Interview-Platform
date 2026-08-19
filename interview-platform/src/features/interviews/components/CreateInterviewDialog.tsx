"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  createInterviewSchema,
  type CreateInterviewInput,
} from "@/features/interviews/schemas/interview.schema";
import { createInterview } from "@/features/interviews/actions/interviews.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DURATION_OPTIONS = [30, 45, 60, 90, 120];

export function CreateInterviewDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateInterviewInput>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: { duration: 60 },
  });

  const onSubmit = async (values: CreateInterviewInput) => {
    setIsSubmitting(true);
    try {
      const result = await createInterview(values);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            setError(field as keyof CreateInterviewInput, { message: messages[0] });
          }
        }
        toast.error(result.error);
        return;
      }

      toast.success("Interview scheduled!");
      reset();
      setOpen(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create interview
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Schedule an interview</DialogTitle>
          <DialogDescription>
            The candidate must already have an account. A unique room link is generated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Frontend Engineer — Round 1" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidateEmail">Candidate email</Label>
            <Input
              id="candidateEmail"
              type="email"
              placeholder="candidate@example.com"
              {...register("candidateEmail")}
            />
            {errors.candidateEmail && (
              <p className="text-sm text-destructive">{errors.candidateEmail.message}</p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Frontend Engineer — Round 1" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidateEmail">Candidate email</Label>
            <Input
              id="candidateEmail"
              type="email"
              placeholder="candidate@example.com"
              {...register("candidateEmail")}
            />
            {errors.candidateEmail && (
              <p className="text-sm text-destructive">{errors.candidateEmail.message}</p>
            )}
          </div>