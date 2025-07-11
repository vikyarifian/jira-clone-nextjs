import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form }) => {
            const response = await client.api.workspaces["$post"]({ form });

            if (!response.ok) {
                throw new Error("Workspace creation failed");
            }   

            return await response.json();
        },
        onSuccess: (data) => {
            toast.success("Workspace created successfully", { style: { color: "green" } });
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: (error) => {
            toast.error(`Failed to create workspace`, { style: { color: "red" } });
        },
    });

    return mutation;
};