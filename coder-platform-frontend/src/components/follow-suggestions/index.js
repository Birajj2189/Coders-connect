"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export default function EnhancedFollowSuggestions() {
	const [followedUsers, setFollowedUsers] = useState(new Set());
	const [hoveredUser, setHoveredUser] = useState(null);
	const scrollContainerRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [accounts, setAccounts] = useState([]);
	const [token, setToken] = useState(null);
	const [followLoading, setFollowLoading] = useState({}); // Track loading for individual follows

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Handle token retrieval
			const storedToken = sessionStorage.getItem("token");
			if (storedToken) setToken(storedToken);
			else {
				setError("No token found. Please log in.");
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		if (!token) return;
		const fetchFollowSuggestions = async () => {
			setLoading(true);
			console.log("Fetching follow suggestions with token:", token);
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/api/users/all-users`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.status === 200) {
					setAccounts(response.data);
					console.log("Follow suggestions fetched:", response.data);
				} else {
					console.error("Failed to get follow suggestions", response.status);
				}
			} catch (error) {
				console.error(
					"An error occurred while getting follow suggestions",
					error.response || error.message || error
				);
			} finally {
				setLoading(false);
			}
		};

		fetchFollowSuggestions();
	}, [token]);

	const handleFollow = async (id) => {
		console.log(id);
		setFollowLoading((prev) => ({ ...prev, [id]: true })); // Set individual follow loading state
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/toggle-follow`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				// Update followed status locally
				setAccounts((prevAccounts) =>
					prevAccounts.map((account) =>
						account._id === id
							? { ...account, isFollowing: !account.isFollowing }
							: account
					)
				);
				console.log("Toggled follow status for user:", id);
			} else {
				console.error("Failed to toggle follow", response.status);
			}
		} catch (error) {
			console.error(
				"An error occurred while toggling follow",
				error.response || error.message || error
			);
		} finally {
			setFollowLoading((prev) => ({ ...prev, [id]: false })); // Reset loading state for the button
		}
	};

	const scroll = (direction) => {
		if (scrollContainerRef.current) {
			const scrollAmount = 300; // Adjust this value to change scroll distance
			const currentScroll = scrollContainerRef.current.scrollLeft;
			const targetScroll =
				direction === "left"
					? currentScroll - scrollAmount
					: currentScroll + scrollAmount;

			scrollContainerRef.current.scrollTo({
				left: targetScroll,
				behavior: "smooth",
			});
		}
	};

	const LoadingSuggestionCard = () => (
		<div className='w-[280px] flex-none'>
			<Card className='h-full bg-white dark:bg-gray-800 shadow-lg'>
				<CardContent className='p-6'>
					<div className='flex flex-col items-center space-y-4'>
						<Skeleton className='w-20 h-20 rounded-full' />
						<div className='text-center space-y-2'>
							<Skeleton className='h-6 w-32 mx-auto' />
							<Skeleton className='h-4 w-24 mx-auto' />
						</div>
					</div>
					<div className='mt-4 space-y-2'>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-3/4' />
					</div>
					<div className='mt-4 flex flex-wrap justify-center gap-2'>
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className='h-6 w-16 rounded-full' />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);

	return (
		<Card className='w-full bg-sky-300 shadow-xl border-none inset-0'>
			<CardContent className='p-6'>
				<h2 className='text-2xl font-bold mb-4 text-center text-sky-50'>
					Discover Coders
				</h2>
				<ScrollArea className='w-full whitespace-nowrap rounded-lg'>
					<div
						ref={scrollContainerRef}
						className='flex space-x-4 p-4 overflow-x-auto'
					>
						{loading &&
							[1, 2, 3, 4, 5].map((i) => <LoadingSuggestionCard key={i} />)}
						{!loading &&
							accounts &&
							accounts.map((suggestion) => (
								<motion.div
									key={suggestion._id}
									className='w-[280px] flex-none'
									whileHover={{ scale: 1.05 }}
									onHoverStart={() => setHoveredUser(suggestion?.id)}
									onHoverEnd={() => setHoveredUser(null)}
								>
									<Card className='h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
										<CardContent className='p-6'>
											<div className='flex flex-col items-center space-y-4'>
												<Avatar className='w-20 h-20'>
													<AvatarImage
														src={suggestion?.avatar}
														alt={suggestion?.firstName}
													/>
													<AvatarFallback className='bg-sky-50'>
														{suggestion?.firstName?.charAt(0).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div className='text-center'>
													<h3 className='font-semibold text-lg'>
														{suggestion?.firstName}
													</h3>
													<p className='text-sm text-gray-500 dark:text-gray-400'>
														@{suggestion?.username}
													</p>
												</div>
											</div>
											<p className='mt-4 text-sm text-gray-600 dark:text-gray-300 text-center line-clamp-2'>
												{suggestion?.bio}
											</p>
											<div className='mt-4 grid grid-cols-2 justify-center items-center gap-2'>
												{suggestion?.skills.map((tag, index) => (
													<Badge
														key={index}
														variant='secondary'
														className='flex items-center justify-center text-xs col-span-1'
													>
														{tag}
													</Badge>
												))}
											</div>

											<Button
												className={
													suggestion.isFollowing
														? `w-full my-2`
														: `w-full my-2 bg-sky-500 hover:bg-sky-400`
												}
												variant={suggestion.isFollowing ? "outline" : "default"}
												onClick={() => handleFollow(suggestion?._id)}
												disabled={followLoading[suggestion?._id]} // Disable button while loading
											>
												{followLoading[suggestion?._id] ? (
													<Loader2 className='animate-spin h-4 w-4 mr-2' />
												) : suggestion.isFollowing ? (
													"Unfollow"
												) : (
													"Follow"
												)}
											</Button>
										</CardContent>
									</Card>
								</motion.div>
							))}
					</div>
					<ScrollBar orientation='horizontal' />
				</ScrollArea>
				<div className='flex justify-center mt-4 space-x-2'>
					<Button
						variant='outline'
						size='icon'
						className='rounded-full'
						onClick={() => scroll("left")}
					>
						<ChevronLeftIcon className='h-4 w-4' />
						<span className='sr-only'>Scroll left</span>
					</Button>
					<Button
						variant='outline'
						size='icon'
						className='rounded-full'
						onClick={() => scroll("right")}
					>
						<ChevronRightIcon className='h-4 w-4' />
						<span className='sr-only'>Scroll right</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
