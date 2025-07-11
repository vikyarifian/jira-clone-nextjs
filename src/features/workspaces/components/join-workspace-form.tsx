"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";

interface JoinWorkspaceFromProps{
    initialValues: {
        name: string,
    };
};

export const JoinWorkspaceForm = ({
    initialValues,
}: JoinWorkspaceFromProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const { mutate, isPending } = useJoinWorkspace();

    const onSubmit = () => {
        mutate({
            param: { workspaceId },
            json: { code: inviteCode },
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`)
            },
            onError: (err)=> {
                console.log(err)
            }
        });
    };

    return (
        <Card className="h-full w-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join Workspace
                </CardTitle>
                <CardDescription>
                    You&apos;ve been invited to join <strong>{initialValues.name}</strong> workspace
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col lg:flex-row gap-y-2 gap-x-2 items-center justify-between">
                    <Button
                        variant={"secondary"}
                        type="button"
                        size={"lg"}
                        asChild
                        disabled={isPending}
                        className="w-full lg:w-fit"
                    >
                        <Link href={"/"}>
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        size={"lg"}
                        type={"button"}
                        onClick={onSubmit}
                        disabled={isPending}
                        className="w-full lg:w-fit"
                    >
                        Join Workspace
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};