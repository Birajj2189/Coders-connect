import React, { useEffect, useState } from "react";
import SidebarDemo from "@/components/ui/sidebar-demo-2";
import { cn } from "@/lib/utils";
import axios from "axios";
import ConversationContainer from "@/components/Dashboards/ConversationContainer";
import { SocketProvider } from "@/context/SocketContext";

export default function Notification() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [token, setToken] = useState("");
	const [user, setUser] = useState(null);

	const [chatList, setChatList] = useState(null);

	const handleAPIError = (err, msg) => {
		console.error(msg, err);
		setError(msg);
		setLoading(false);
	};

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
		const fetchChatList = async () => {
			if (!token) return; // Ensure token exists before making the request
			setLoading(true);
			console.log(token);
			try {
				const response = await axios.get("/api/chats/get-all-chats", {
					headers: {
						Authorization: `${token}`, // Ensure the token is used here
					},
				});
				setChatList(response.data); // Adjust according to the structure of your response
				console.log(chatList);
			} catch (err) {
				setError("Failed to fetch chats list");
				console.error("Error fetching chats list :", err);
			} finally {
				setLoading(false);
			}
		};

		if (token) {
			fetchChatList();
		}
		if (token) {
			axios
				.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/my-profile`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((response) => {
					setUser(response.data);
					setGithubLink(response.data.githubLink || "");
					setLoading(false);
				})
				.catch((err) => handleAPIError(err, "Failed to fetch user data"));
		}
	}, [token]);

	return (
		<div
			className={cn(
				"rounded-md flex flex-col md:flex-row bg-black flex-1 w-[100vw] h-[100vh] border border-neutral-700 overflow-hidden"
			)}
		>
			<SidebarDemo />
			<SocketProvider>
				<ConversationContainer chatList={chatList} user={user} token={token} />
			</SocketProvider>
		</div>
	);
}
