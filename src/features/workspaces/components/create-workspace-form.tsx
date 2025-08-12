"use client";

import z from "zod";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { createWorkspaceSchema } from "../schemas";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useCreateWorkspace();

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        };  

        mutate({ form: finalValues }, {
            onSuccess: ({ data }) => {
                form.reset();
                // onCancel?.();
                router.push(`/workspaces/${data.$id}`);
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
        }
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-2xl font-bold">
                    Create a new Workspace
                </CardTitle>
            </CardHeader>
            <div className="p-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Workspace Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter Workspace Name"
                                                />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                                <div className="size-[72px] relative rounded-md overflow-hidden">
                                                    <Image 
                                                        alt="Workspace Image"
                                                        fill
                                                        className="object-cover"
                                                        src={
                                                        field.value instanceof File
                                                        ? URL.createObjectURL(field.value)
                                                        : field.value
                                                    } />
                                                </div>
                                            )
                                            :
                                            (
                                                <Avatar className="size-[72px]">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm">Workspace Icon</p>
                                                <p className="text-sm text-muted-foreground">
                                                    JPG, PNG or JPEG (max 1MB)
                                                </p>
                                                <input
                                                    className="hidden"
                                                    accept=".jpg, .png, .jpeg"
                                                    type="file"
                                                    ref={inputRef}
                                                    disabled={isPending}
                                                    onChange={handleImageChange}
                                                 />
                                                 {field.value ? (
                                                    <Button
                                                        type="button"   
                                                        size="xs"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            field.onChange(null);
                                                            if (inputRef.current) {
                                                                inputRef.current.value = "";
                                                            }
                                                        }}
                                                        disabled={isPending}
                                                    >Remove Image</Button>
                                                 ) : (
                                                    <Button
                                                        type="button"   
                                                        size="xs"
                                                        variant="teritary"
                                                        onClick={() => inputRef.current?.click()}
                                                        disabled={isPending}
                                                    >Upload Image</Button>
                                                 )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                        <DottedSeparator className="py-7" />
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size={"lg"}
                                variant={"secondary"}
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(
                                    !onCancel && "invisible"
                                )}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size={"lg"}
                                disabled={isPending}
                            >
                                Create Workspace
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}