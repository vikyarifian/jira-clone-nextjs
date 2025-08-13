import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>;

export const useUpdateTask = () => {
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
            
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
            queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
            queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
        },
        onError: () => {
            toast.error(`Failed to update task`, { style: { color: "red" } });
        },
    });

    return mutation;
};