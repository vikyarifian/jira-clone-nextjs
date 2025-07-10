import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
    try {
        const { account } = await createSessionClient();

        return await account.get();
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
}