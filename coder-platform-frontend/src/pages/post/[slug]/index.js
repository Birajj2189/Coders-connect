import React, { useState, useEffect } from "react";
import SidebarDemo from "@/components/ui/sidebar-demo-2";
import { cn } from "@/lib/utils";
import SinglePost from "@/components/home/single-post";
import axios from "axios";

export default function PostSlug({ slug }) {
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [post, setPost] = useState(null); // Change to null for better checks

	useEffect(() => {
		const storedToken = sessionStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		} else {
			setError("No token found. Please log in.");
			setLoading(false);
		}
	}, []);

	const getPostBySlug = async () => {
		if (!token) return; // Avoid fetching if token is not set

		try {
			setLoading(true);
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status === 200) {
				setPost(response.data);
			}
		} catch (error) {
			console.error("An error occurred while fetching the post", error);
			setError("Failed to fetch post. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			getPostBySlug();
		}
	}, [token, slug]); // Trigger fetch when token or slug changes

	return (
		<div
			className={cn(
				"rounded-md flex flex-col md:flex-row bg-black flex-1 w-[100vw] h-[100vh] border border-neutral-700 overflow-hidden"
			)}
		>
			<SidebarDemo />
			{loading ? (
				<div className='flex flex-1'>
					<div className='p-2 md:p-4 rounded border border-neutral-700 bg-blue-50 flex flex-col gap-2 flex-1 w-full h-full'>
						{/* Loading Skeleton */}
						<div className='flex gap-2'>
							{[...new Array(4)].map((_, i) => (
								<div
									key={i}
									className='h-20 w-full rounded-lg bg-slate-400 animate-pulse'
								></div>
							))}
						</div>
						<div className='flex gap-2 flex-1'>
							{[...new Array(2)].map((_, i) => (
								<div
									key={i}
									className='h-full w-full rounded-lg bg-slate-400 animate-pulse'
								></div>
							))}
						</div>
					</div>
				</div>
			) : error ? (
				<div className='p-4 text-red-500'>{error}</div>
			) : (
				post && <SinglePost post={post} />
			)}
		</div>
	);
}

export async function getServerSideProps(context) {
	const { slug } = context.params; // Accessing the slug from URL params

	return {
		props: { slug }, // Passing slug as a prop to the component
	};
}
