import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.tasks["bulk-update"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks["bulk-update"]["$post"]>;

export const useBulkUpdateTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api.tasks["bulk-update"]["$post"]({ json });
            
            if (!response.ok) {
                throw new Error("Tasks update failed");
            }   

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Tasks updated successfully", { style: { color: "green" } });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
            toast.error(`Failed to update tasks`, { style: { color: "red" } });
        },
    });

    return mutation;
};