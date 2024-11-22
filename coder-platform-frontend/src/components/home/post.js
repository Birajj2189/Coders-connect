"use client";

import { useState, useEffect, useRef } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	HeartIcon,
	MessageCircleIcon,
	RepeatIcon,
	ShareIcon,
	SendIcon,
	TagIcon,
	CopyIcon,
	CheckIcon,
} from "lucide-react";
import { IconHeartFilled } from "@tabler/icons-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { UsersIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import CommentLoading from "@/components/home/comment-loading";
import NoComments from "./no-comments";
import { Label } from "@/components/ui/label";

const timeAgo = (timestamp) => {
	const now = new Date();
	const seconds = Math.floor((now - new Date(timestamp)) / 1000);
	let interval = Math.floor(seconds / 31536000);

	if (interval > 1) return `${interval} years ago`;
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) return `${interval} months ago`;
	interval = Math.floor(seconds / 86400);
	if (interval > 1) return `${interval} days ago`;
	interval = Math.floor(seconds / 3600);
	if (interval > 1) return `${interval} hours ago`;
	interval = Math.floor(seconds / 60);
	if (interval > 1) return `${interval} minutes ago`;
	return "Just now";
};

export default function PostCard({ index, post }) {
	console.log();
	const [token, setToken] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [formattedTime, setFormattedTime] = useState("");
	const [likeCount, setLikeCount] = useState(post.likeCount || 0);
	const [isLiked, setIsLiked] = useState(post.isLiked);
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [showCopyLinkModal, setShowCopyLinkModal] = useState(false);
	const [isMentionExpanded, setIsMentionExpanded] = useState(false);
	const [comments, setComments] = useState(null);
	const [isCommentLoading, setIsCommentLoading] = useState(false);
	const [isCommentPosting, setIsCommentPosting] = useState(false);
	const [commentCount, setCommentCount] = useState(post.commentCount);
	const [copySuccess, setCopySuccess] = useState(false);

	const link = process.env.NEXT_PUBLIC_SITE_URL + "/post/" + post.slug;

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
		setFormattedTime(timeAgo(post.createdAt));
	}, [post.createdAt]);

	const handleLike = async () => {
		try {
			console.log(token);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/posts/toggle-like/${post._id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				setIsLiked(!isLiked);
				console.log("Post liked successfully");
				if (isLiked) {
					setLikeCount(likeCount - 1);
				} else {
					setLikeCount(likeCount + 1);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		const data = {
			postId: post._id,
			content: newComment.trim(),
		};

		try {
			setIsCommentPosting(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/comments/create/`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`, // Include the Authorization header
					},
				}
			);
			if (response.status === 201) {
				console.log("Comment posted successfully");
				setNewComment("");
				setCommentCount(commentCount + 1);
			}
		} catch (error) {
			console.error("Error while posting comment", error);
		} finally {
			setIsCommentPosting(false);
			listThreeComments();
		}
	};

	const listThreeComments = async () => {
		try {
			setIsCommentLoading(true);
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/comments/list-three/${post._id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.status === 200) {
				console.log("Fetched comments successfully", response.data);
				setComments(response.data);
			}
		} catch (error) {
			console.error("Error while fetching comments", error);
		} finally {
			setIsCommentLoading(false);
		}
	};

	const handleCommentLike = async (commentId, index) => {
		const updatedComments = [...comments];
		const comment = updatedComments[index];

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/comments/toggle-like/${commentId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				comment.isLiked = !comment.isLiked;
				comment.likeCount += comment.isLiked ? 1 : -1;
				setComments(updatedComments);
			}
		} catch (error) {
			console.error("Error while liking comment", error);
		}
	};

	const handleCopyLink = () => {
		const linkToCopy = `http://localhost:3000/post/${post.slug}`; // Assuming your base URL is stored in an environment variable
		navigator.clipboard
			.writeText(linkToCopy)
			.then(() => {
				setCopySuccess(true);
				setTimeout(() => setCopySuccess(false), 2000);
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
			});
	};

	return (
		<Card className='w-full max-w-4xl mx-auto mb-6'>
			<CardHeader className='flex flex-row items-center space-x-4 pb-4'>
				<Avatar>
					<AvatarImage
						src={
							`${process.env.NEXT_PUBLIC_API_URL}/${post.author.profilePicture}` ||
							"/placeholder.svg?height=50&width=50"
						}
						alt={post.author.firstName || "User"}
					/>
					<AvatarFallback>
						{post.author.firstName
							? post.author.firstName.charAt(0).toUpperCase()
							: "U"}
					</AvatarFallback>
				</Avatar>
				<div className='flex-1'>
					<h3 className='text-lg font-semibold'>
						{post.author.firstName.charAt(0).toUpperCase() +
							post.author.firstName.slice(1).toLowerCase() +
							" " +
							post.author.lastName.charAt(0).toUpperCase() +
							post.author.lastName?.slice(1).toLowerCase() || "Anonymous"}
					</h3>
					<p className='text-sm text-gray-500'>
						@{post.author.username || "unknown"} ·{" "}
						{formattedTime || "unknown time"}
					</p>
				</div>
			</CardHeader>
			<Link href={link} className='cursor-pointer'>
				<CardContent>
					<ScrollArea className='h-auto rounded-md'>
						<div key={index} className='mb-4'>
							{post.content && (
								<p className='whitespace-pre-wrap'>
									{post.content.split(/([@#\[][\w]+)/g).map((part, i) => {
										if (part.startsWith("@")) {
											return (
												<span key={i} className='text-blue-600 font-semibold'>
													{part}
												</span>
											);
										} else if (part.startsWith("#")) {
											return (
												<span key={i} className='text-green-600 font-semibold'>
													{part}
												</span>
											);
										} else if (part.startsWith("[") && part.endsWith("]")) {
											return (
												<span key={i} className='text-purple-600 font-semibold'>
													{part}
												</span>
											);
										}
										return part;
									})}
								</p>
							)}
							{post.code && (
								<SyntaxHighlighter language='javascript' style={tomorrow}>
									{post.code}
								</SyntaxHighlighter>
							)}

							{post.image && (
								<Image
									src={`${process.env.NEXT_PUBLIC_API_URL}/${post.image}`}
									alt='Post content'
									className='h-auto w-full object-cover rounded-md max-w-md mx-auto'
									width={800} // Use appropriate values
									height={600}
									quality={100}
								/>
							)}
						</div>
						{post.mentions.length > 0 && (
							<div className='justify-end w-full flex-col'>
								<TooltipProvider>
									<Button
										variant='outline'
										size='sm'
										className='flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200'
										onClick={() => setIsMentionExpanded(!isMentionExpanded)}
										aria-expanded={isMentionExpanded}
										aria-controls='tagged-people-list'
									>
										<UsersIcon className='w-4 h-4' />
										<span className='sr-only'>
											{isMentionExpanded ? "Hide" : "Show"} Tagged People
										</span>
										<span className='text-sm font-medium'>
											{post.mentions.length}
										</span>
										{isMentionExpanded ? (
											<ChevronUpIcon className='w-4 h-4 ml-2' />
										) : (
											<ChevronDownIcon className='w-4 h-4 ml-2' />
										)}
									</Button>
								</TooltipProvider>
								<AnimatePresence>
									{isMentionExpanded && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.3 }}
											id='tagged-people-list'
											className='overflow-hidden'
											role='region'
											aria-label='Tagged people'
										>
											<div className='flex flex-wrap gap-2 mt-2'>
												{post.mentions.map((person) => (
													<motion.div
														key={person._id}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.8 }}
														transition={{ duration: 0.2 }}
													>
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Avatar className='w-8 h-8 border-2 border-primary cursor-pointer'>
																		<AvatarImage
																			src={person.profilePicture}
																			alt={person.username}
																		/>
																		<AvatarFallback>
																			{person.firstName
																				? person.firstName
																						.charAt(0)
																						.toUpperCase()
																				: "U"}
																		</AvatarFallback>
																	</Avatar>
																</TooltipTrigger>
																<TooltipContent>
																	<p>
																		{person.firstName + " " + person.lastName}
																	</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</motion.div>
												))}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
					</ScrollArea>
				</CardContent>
			</Link>

			<CardFooter className='flex-col justify-between items-center pt-4 border-t'>
				<div className='flex justify-between items-center w-full mb-4'>
					<Button variant='ghost' size='sm' onClick={handleLike} className={""}>
						{isLiked ? (
							<IconHeartFilled className='text-sky-500 h-5 w-5 mr-1 ' />
						) : (
							<HeartIcon className='text-sky-500 h-5 w-5 mr-1 ' />
						)}
						{likeCount}
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => {
							setShowComments(!showComments);
							listThreeComments();
						}}
					>
						<MessageCircleIcon className='h-5 w-5 mr-1' />
						{commentCount || "0"}
					</Button>
					<Button variant='ghost' size='sm'>
						<RepeatIcon className='h-5 w-5 mr-1' />
						Share
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => {
							console.log("Opening copy link modal");
							setShowCopyLinkModal(true);
							console.log("Link to copy:", link);
						}}
					>
						<ShareIcon className='h-5 w-5 mr-1' />
						Copy Link
					</Button>
				</div>
				<AnimatePresence>
					{showComments && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className='w-full overflow-hidden'
						>
							<form onSubmit={handleCommentSubmit} className='flex gap-2 mb-4'>
								<Input
									type='text'
									placeholder='Add a comment...'
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									className='flex-grow'
								/>
								{!isCommentPosting ? (
									<Button
										type='submit'
										size='sm'
										className='bg-sky-500 hover:bg-sky-400'
									>
										<SendIcon className='h-4 w-4 ' />
									</Button>
								) : (
									<Button
										type='submit'
										size='sm'
										className='bg-sky-500 hover:bg-sky-400 flex justify-center items-center'
										disabled
									>
										<ReloadIcon className=' h-4 w-4 animate-spin' />
									</Button>
								)}
							</form>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className='space-y-0'
							>
								{isCommentLoading ? (
									<CommentLoading />
								) : comments && comments.length > 0 ? (
									comments.map((comment, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											className='flex items-start gap-1 bg-sky-50 rounded-md p-2 border'
										>
											<Avatar className='w-10 h-10  m-1 mr-4'>
												<AvatarFallback className='bg-sky-400 text-sky-50'>
													{comment.author.firstName
														? comment.author.firstName.charAt(0).toUpperCase()
														: "U"}
												</AvatarFallback>
											</Avatar>
											<div className='flex-grow'>
												<p className='text-sm font-semibold'>
													{comment.author.firstName.charAt(0).toUpperCase() +
														comment.author.firstName.slice(1).toLowerCase() +
														" " +
														comment.author.lastName.charAt(0).toUpperCase() +
														comment.author.lastName.slice(1).toLowerCase()}
													<span className='text-xs text-gray-500'>
														{" • " + timeAgo(comment.createdAt)}
													</span>
												</p>
												<p className='text-sm'>{comment.content}</p>
												<div className='flex space-x-2 text-xs text-gray-500 my-2 items-center'>
													<Button
														variant='ghost'
														size='xs'
														className='text-xs font-bold cursor-pointer'
														onClick={() =>
															handleCommentLike(comment._id, index)
														}
													>
														{!comment.isLiked ? "Like" : "Unlike"}
													</Button>
													<span> • </span>
													{!comment.isLiked ? (
														<>
															<HeartIcon className='h-4 w-4 text-sky-400' />
															<span className='font-bold text-sky-400'>
																{comment.likeCount}
															</span>
														</>
													) : (
														<>
															<IconHeartFilled className='h-4 w-4 text-sky-400' />
															<span className='font-bold text-sky-400'>
																{comment.likeCount}
															</span>
														</>
													)}
												</div>
											</div>
										</motion.div>
									))
								) : (
									<NoComments />
								)}
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
				<Dialog open={showCopyLinkModal} onOpenChange={setShowCopyLinkModal}>
					<DialogContent className='sm:max-w-md'>
						<DialogHeader>
							<DialogTitle>Share link</DialogTitle>
							<DialogDescription>
								Anyone who has this link will be able to view this post.
							</DialogDescription>
						</DialogHeader>
						<div className='flex items-center space-x-2'>
							<div className='grid flex-1 gap-2'>
								<Label htmlFor='link' className='sr-only'>
									Link
								</Label>
								<Input id='link' defaultValue={link} readOnly />
							</div>
							<Button
								type='submit'
								size='sm'
								className='px-3 bg-sky-500 hover:bg-sky-400'
								onClick={handleCopyLink}
							>
								<span className='sr-only'>Copy</span>
								{copySuccess ? (
									<CheckIcon className='h-4 w-4' />
								) : (
									<CopyIcon className='h-4 w-4' />
								)}
							</Button>
						</div>
						{/* <div className='flex justify-end'>
							<Button
								variant='secondary'
								onClick={() => setShowCopyLinkModal(false)}
							>
								Close
							</Button>
						</div> */}
					</DialogContent>
				</Dialog>
			</CardFooter>
		</Card>
	);
}
