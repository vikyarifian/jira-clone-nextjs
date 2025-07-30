import { getCurrent } from "@/features/auth/queries";
import { MemebersList } from "@/features/workspaces/components/members-list";
import { redirect } from "next/navigation";

const WorkspaceIdMembersPage = async () => {
    const user = getCurrent();
    if (!user) redirect("/sign-in");

    return (
        <div className="w-full lg:max-w-xl">
            <MemebersList />
        </div>
    );
}

export default WorkspaceIdMembersPage;