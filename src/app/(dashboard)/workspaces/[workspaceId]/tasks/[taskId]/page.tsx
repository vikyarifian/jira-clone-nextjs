import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { TaskIdClient } from "./client";

const TaskIdPage = () => {
    const user = getCurrent();
    if (!user) redirect("/sign-in");

    return (
        <TaskIdClient />
    );
};

export default TaskIdPage;