import React, { useState, useEffect } from "react";
import PostInput from "@/components/home/post-input";
import Post from "@/components/home/post";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Stories from "@/components/stories/index";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store";
import { Pencil2Icon } from "@radix-ui/react-icons";
import EnhancedFollowSuggestions from "../follow-suggestions";
import NoPosts from "@/components/home/no-post";
import PostLoading from "@/components/home/post-loading-card";

export default function Dashboard({ loading }) {
	const userInfo = useAppStore();
	const user = userInfo.userInfo;
	const [greeting, setGreeting] = useState("");
	// State to manage the visibility of the PostInput component
	const [isPostInputVisible, setPostInputVisible] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [token, setToken] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState([]);

	// const togglePostInput = () => {
	// 	setPostInputVisible(!isPostInputVisible);
	// };

	const getAllPosts = async () => {
		console.log("fetching posts...");
		try {
			setIsLoading(true);
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/posts/all-list`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status == 200) {
				setPosts(response.data);
				console.log("POSTS", response.data);
			}
		} catch (error) {
			console.error("An error occured while fetching the posts", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			// Handle token retrieval
			const storedToken = sessionStorage.getItem("token");
			if (storedToken) setToken(storedToken);
			else {
				setError("No token found. Please log in.");
				setIsLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		const getGreeting = () => {
			const currentHour = new Date().getHours();

			if (currentHour < 12) {
				return "Good Morning";
			} else if (currentHour >= 12 && currentHour < 17) {
				return "Good Afternoon";
			} else if (currentHour >= 17 && currentHour < 21) {
				return "Good Evening";
			} else {
				return "Good Night";
			}
		};

		setGreeting(getGreeting());

		if (token) {
			getAllPosts();
		}
	}, [token]);

	if (loading || !user) {
		return (
			<div className='flex flex-1 '>
				<div className='p-2 md:p-4 rounded border border-neutral-700 bg-blue-50 flex flex-col gap-2 flex-1 w-full h-full'>
					<div className='flex gap-2'>
						{[...new Array(4)].map((i) => (
							<div
								key={"first" + i}
								className='h-20 w-full rounded-lg bg-slate-400 animate-pulse'
							></div>
						))}
					</div>
					<div className='flex gap-2 flex-1'>
						{[...new Array(2)].map((i) => (
							<div
								key={"second" + i}
								className='h-full w-full rounded-lg bg-slate-400 animate-pulse'
							></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-blue-50 w-full p-4 h-auto overflow-scroll overflow-x-hidden'>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} className=''>
				<div className='flex h-10 px-4 items-center justify-between'>
					<h1 className='font-bold text-2xl mr-2'>
						{greeting},{" "}
						<span className='text-sky-500'>
							{user?.firstName?.charAt(0).toUpperCase() +
								user?.firstName?.slice(1).toLowerCase()}
						</span>
					</h1>
					<DialogTrigger>
						<Button
							onClick={() => setIsDialogOpen(true)}
							className='mx-2 bg-sky-500 hover:bg-sky-400'
						>
							<Pencil2Icon className='h-4 w-4 mr-2 font-semibold' />
							Create Post
						</Button>
					</DialogTrigger>
				</div>
				<DialogContent className='p-6 '>
					<DialogTitle className='text-2xl font-bold'>
						Create a <span className='text-sky-400'>Post</span>
					</DialogTitle>
					<DialogDescription>
						<PostInput
							onSuccess={() => {
								setIsDialogOpen(false);
								getAllPosts();
							}}
						/>
					</DialogDescription>
				</DialogContent>
			</Dialog>
			<Stories />

			<EnhancedFollowSuggestions />
			<ScrollArea className='my-6 w-full '>
				{isLoading ? (
					<PostLoading />
				) : posts.length === 0 ? (
					<NoPosts />
				) : (
					posts.map((post, index) => <Post key={index} post={post} />)
				)}
			</ScrollArea>
		</div>
	);
}
