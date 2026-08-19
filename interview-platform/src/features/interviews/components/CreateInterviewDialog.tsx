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