import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>;

export const useUpdateTask = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["$patch"]({ json, param });

            if (!response.ok) {
                throw new Error("Task update failed");
            }   

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Task updated successfully", { style: { color: "green" } });
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
        },
        onError: (error) => {
            toast.error(`Failed to update task`, { style: { color: "red" } });
        },
    });

    return mutation;
};