import React, { useEffect, useState } from "react";
import SidebarDemo from "@/components/ui/sidebar-demo-2";
import { cn } from "@/lib/utils";
import ProjectDashboard from "@/components/Dashboards/ProjectContainer2";
import { useAppStore } from "@/store";
export default function ProfilePage() {
	const userInfo = useAppStore();
	console.log("userrrrr123", userInfo.userInfo);
	return (
		<div
			className={cn(
				"rounded-md flex flex-col md:flex-row bg-black flex-1 w-[100vw] h-[100vh] border border-neutral-700 overflow-hidden"
			)}
		>
			<SidebarDemo />

			<ProjectDashboard />
		</div>
	);
}
