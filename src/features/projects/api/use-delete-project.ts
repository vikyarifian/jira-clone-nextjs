import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.projects[":projectId"]["$delete"]({ param });

            if (!response.ok) {
                throw new Error("Project delete failed");
            }   

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Project deleted successfully", { style: { color: "green" } });
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
        },
        onError: (error) => {
            toast.error(`Failed to delete project`, { style: { color: "red" } });
        },
    });

    return mutation;
};