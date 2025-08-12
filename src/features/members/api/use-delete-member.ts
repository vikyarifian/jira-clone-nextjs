import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.members[":memberId"]["$delete"]>;

export const useDeleteMember = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.members[":memberId"]["$delete"]({ param });

            if (!response.ok) {
                throw new Error("Member delete failed");
            }   

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Member delete successfully", { style: { color: "green" } });
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
        onError: () => {
            toast.error(`Failed to delete member`, { style: { color: "red" } });
        },
    });

    return mutation;
};