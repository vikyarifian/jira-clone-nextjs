import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({ param });

            if (!response.ok) {
                throw new Error("Reset invite code failed");
            }   

            return await response.json();
        },
        onSuccess: ({ data} ) => {
            toast.success("Reset invite code successfully", { style: { color: "green" } });
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
        },
        onError: (error) => {
            toast.error(`Failed to reset invite code`, { style: { color: "red" } });
        },
    });

    return mutation;
};