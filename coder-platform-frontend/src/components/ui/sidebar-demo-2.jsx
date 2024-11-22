import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import {
	IconArrowLeft,
	IconHome2,
	IconSettings,
	IconNotification,
	IconMessage2,
	IconCode,
	IconCategory,
	IconFile3d,
	IconAward,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRouteCheck } from "@/hooks/useRouteCheck";
import { Code, Code2Icon } from "lucide-react";
import { useAppStore } from "@/store";

export default function SidebarDemo() {
	const { userInfo, resetUserInfo } = useAppStore();
	const user = userInfo;
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [updateError, setUpdateError] = useState(null);
	const [notificationUnseenCount, setNotificationUnseenCount] = useState(0);
	const [messageUnreadCount, setMessageUnreadCount] = useState(0);
	const [token, setToken] = useState(null);
	const [open, setOpen] = useState(false);

	const handleAPIError = (err, msg) => {
		setError(msg);
		setLoading(false);
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Handle token retrieval
			const storedToken = sessionStorage.getItem("token");
			if (storedToken) {
				setToken(storedToken);
				console.log(token);
			} else {
				setError("No token found. Please log in.");
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		async function fetchNotificationUnseenCount() {
			try {
				const res = await fetch("/api/notification-unseen-count", {
					headers: { Authorization: `${token}` },
					method: "GET",
				});
				const data = await res.json();
				setNotificationUnseenCount(data.unseenCount || 0);
			} catch (err) {
				handleAPIError(err, "Error fetching unseen notifications");
			}
		}

		if (token) fetchNotificationUnseenCount();
	}, [token]);

	const handleLogout = () => {
		// Check if token exists before proceeding
		if (!token) {
			console.error("No token found. User may already be logged out.");
			return;
		}
		// Set loading state if necessary
		setLoading(true);
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
				headers: {
					Authorization: `Bearer ${token}`, // Include the token in the Authorization header
				},
			})
			.then(() => {
				// If API call succeeds, remove the token and clear the Zustand state
				sessionStorage.removeItem("token");
				resetUser();
				setLoading(false);
			})
			.catch((err) => {
				handleAPIError(err, "Failed to log out");
				setLoading(false);
			});
	};

	const containsNavbar = useRouteCheck("/navbar");
	const containsNotifications = useRouteCheck("/notifications");
	const containsConversations = useRouteCheck("/conversations");
	const containsThreads = useRouteCheck("/threads");
	const containsTemplates = useRouteCheck("/templates");
	const containsProjects = useRouteCheck("/projects");
	const containsHackathons = useRouteCheck("/hackathons");

	const links = [
		{
			label: "Home",
			href: "/",
			icon:
				(router && router.pathname === "/") ||
				(router && router.pathname.includes("post")) ? (
					<IconHome2 className='text-sky-500 h-5 w-5 flex-shrink-0' />
				) : (
					<IconHome2 className='text-neutral-200 h-5 w-5 flex-shrink-0' />
				),
			linkNo: 0,
		},
		{
			label: "Notifications",
			href: "/notifications",
			icon: containsNotifications ? (
				<IconNotification className='text-sky-500 h-5 w-5 flex-shrink-0' />
			) : (
				<IconNotification className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 1,
			notificationUnseenCount,
		},
		{
			label: "Conversations",
			href: "/conversations",
			icon: containsConversations ? (
				<IconMessage2 className='text-sky-500 h-5 w-5 flex-shrink-0' />
			) : (
				<IconMessage2 className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 2,
			messageUnreadCount,
		},
		{
			label: "Threads",
			href: "/threads",
			icon: containsThreads ? (
				<IconCategory className='text-sky-500 h-5 w-5 flex-shrink-0' />
			) : (
				<IconCategory className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 3,
		},
		{
			label: "Templates",
			href: "/templates",
			icon: containsTemplates ? (
				<IconCode className='text-sky-500 h-5 w-5 flex-shrink-0' />
			) : (
				<IconCode className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 4,
		},
		{
			label: "Projects",
			href: "/projects",
			icon: containsProjects ? (
				<IconFile3d className='text-sky-500 h-5 w-5 flex-shrink-0' />
			) : (
				<IconFile3d className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 5,
		},
		{
			label: "Hackathons",
			href: "/hackathons",
			icon: containsHackathons ? (
				<IconAward className='text-sky-500 h-5 w-5 flex-shrink-0' />
			) : (
				<IconAward className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 5,
		},
		{
			label: "Settings",
			href: "/settings",
			icon: containsHackathons ? (
				<IconSettings className='text-sky-500 h-5 w-5 flex-shrink-0' />
			) : (
				<IconSettings className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 6,
		},
		{
			label: "Logout",
			href: "/logout",
			icon: (
				<IconArrowLeft className='text-neutral-200 h-5 w-5 flex-shrink-0' />
			),
			linkNo: 7,
		},
	];

	return (
		<Sidebar open={open} setOpen={setOpen} animate={false}>
			<SidebarBody className='justify-between gap-10 bg-black'>
				<div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
					<Logo />
					<div className='mt-8 flex flex-col gap-2'>
						{links.map((link, idx) => {
							if (!link) {
								console.warn(`Link at index ${idx} is undefined`); // Debugging line
								return null;
							}
							return <SidebarLink key={idx} link={link} />;
						})}
					</div>
				</div>
				<div>
					{console.log("mainnnn", user?.profilePicture)}
					<SidebarLink
						className='bg-sky-500 rounded-lg px-4'
						user={user}
						link={{
							href: "/my-profile",
							icon: (
								<Image
									src={
										user && user.profilePicture
											? `http://localhost:4000/${user.profilePicture}`
											: "/default-avatar.png"
									}
									className='h-7 w-7 flex-shrink-0 rounded-full'
									width={50}
									height={50}
									alt='Avatar'
								/>
							),
						}}
					/>
				</div>
			</SidebarBody>
		</Sidebar>
	);
}

// Placeholder component for Logo
const Logo = () => (
	<Link href='/' className='flex items-center gap-x-3'>
		<motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
			<Code className='text-sky-500 h-12 w-12' />
		</motion.div>
		<h2 className='text-xl font-bold text-sky-500'>Coders Connect</h2>
	</Link>
);
