import React, { useEffect, useState } from "react";
import SidebarDemo from "@/components/ui/sidebar-demo-2";
import { cn } from "@/lib/utils";
import NotificationContainer from "@/components/Dashboards/NotificationContainer";
import axios from "axios";

export default function Notification() {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [token, setToken] = useState("");
	const [totalCount, setTotalCount] = useState(0);

	console.log("notification container");

	// Fetch token from sessionStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedToken = sessionStorage.getItem("token");
			if (storedToken) {
				setToken(storedToken);
			} else {
				setError("No token found. Please log in.");
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		const fetchNotifications = async () => {
			if (!token) return; // Ensure token exists before making the request
			setLoading(true);
			console.log("fetching");
			try {
				const response = await axios.get(
					"/api/notifications/notification-all-list",
					{
						headers: {
							Authorization: `${token}`, // Ensure the token is used here
						},
					}
				);
				setNotifications(response.data.notifications); // Adjust according to the structure of your response
				setTotalCount(response.data.totalCount);
			} catch (err) {
				setError("Failed to fetch notifications");
				console.error("Error fetching notifications:", err);
			} finally {
				setLoading(false);
			}
		};

		if (token) {
			fetchNotifications();
		}
	}, [token]);

	return (
		<div
			className={cn(
				"rounded-md flex flex-col md:flex-row bg-black flex-1 w-[100vw] h-[100vh] border border-neutral-700 overflow-hidden"
			)}
		>
			<SidebarDemo />
			<NotificationContainer
				notifications={notifications}
				loading={loading}
				totalCount={totalCount}
			/>
		</div>
	);
}
