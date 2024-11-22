// "use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { ToastAction, ToastProvider } from "@/components/ui/toast";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	ImageIcon,
	Code2Icon,
	FileTextIcon,
	AtSign,
	Hash,
	Tag,
	SendHorizontal,
	EyeIcon,
	PlusIcon,
	ReloadIcon,
	XIcon,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useAppStore } from "@/store";

const MAX_CHARS = 1000;

const AdvancedPostCard = ({ onSuccess }) => {
	const { userInfo } = useAppStore();
	const [postContents, setPostContents] = useState([
		{ type: "text", content: "" },
	]);
	const [tags, setTags] = useState([]);
	const [mentions, setMentions] = useState([]);
	const [mentionedUserIds, setMentionedUserIds] = useState([]);
	const [hashtags, setHashtags] = useState([]);
	const [showPreview, setShowPreview] = useState(false);
	const [openMentions, setOpenMentions] = useState(false);
	const textareaRef = useRef(null);
	const [token, setToken] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [Image, setImage] = useState(null);
	const { toast } = useToast();
	const [mentionSuggestions, setMentionSuggestions] = useState([]);

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
		const getFollowSuggestions = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/api/users/mention-list`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (response.status === 200) {
					console.log("Successfully fetchhed the mention list");
					setMentionSuggestions(response.data);
				}
			} catch (err) {
				console.log("Failed to fetch the mention list", err);
				throw err;
			}
		};
		if (token) {
			getFollowSuggestions();
		}
	}, [token]);

	const handleContentChange = (index, newContent) => {
		const updatedContents = [...postContents];
		updatedContents[index].content = newContent;

		if (updatedContents[index].type === "text") {
			const mentionRegex = /@(\w+)/g;
			const hashtagRegex = /#(\w+)/g;

			setMentions(Array.from(newContent.matchAll(mentionRegex), (m) => m[1]));
			setHashtags(Array.from(newContent.matchAll(hashtagRegex), (m) => m[1]));

			if (newContent.endsWith("@") && !openMentions) {
				setOpenMentions(true);
			}
		}

		setPostContents(updatedContents);
	};

	const handleImageUpload = (index, e) => {
		if (e.target.files && e.target.files[0]) {
			const reader = new FileReader();
			setImage(e.target.files[0]);
			reader.onload = (e) => {
				const dataUrl = e.target?.result;

				if (dataUrl && dataUrl.startsWith("data:image")) {
					const updatedContents = [...postContents];
					updatedContents[index].content = dataUrl;
					setPostContents(updatedContents);
				} else {
					console.error("Invalid image format.");
				}
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const handleDrop = (index, e) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const dataUrl = e.target?.result;

				if (dataUrl && dataUrl.startsWith("data:image")) {
					const updatedContents = [...postContents];
					updatedContents[index].content = dataUrl;
					setPostContents(updatedContents);
				} else {
					console.error("Invalid image format.");
				}
			};
			reader.readAsDataURL(e.dataTransfer.files[0]);
		}
	};

	const handlePost = async () => {
		const formData = new FormData();

		postContents.forEach((content, index) => {
			if (content.type === "text") {
				formData.append(`content`, content.content);
			} else if (content.type === "code") {
				formData.append(`code`, content.content);
			} else if (content.type === "image") {
				formData.append(`image`, Image);
			}
		});

		// console.log("mentions", { mentions });
		const userIds = mentions
			.map((username) => {
				const user = mentionSuggestions.find(
					(user) => user.username === username
				);
				return user ? user._id : null;
			})
			.filter((id) => id !== null);
		setMentionedUserIds(userIds);
		console.log("mentioned ids", { userIds });

		// Ensure mentions is an array
		formData.append("mentions", Array.isArray({ userIds }) ? { userIds } : []);
		formData.append("hashtags", Array.isArray(hashtags) ? hashtags : []);

		try {
			setLoading(true);

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/posts/create`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 201) {
				console.log("Post created successfully", postContents, { formData });

				setPostContents([{ type: "text", content: "" }]);
				setMentions([]);
				setHashtags([]);
				setShowPreview(false);
				onSuccess?.();
				toast({
					title: "Post created successfully",
					description: ` ${formatDate(new Date())}`,
					action: (
						<ToastAction altText='Goto schedule to undo'>Undo</ToastAction>
					),
				});
			} else {
				console.error("Error creating post", response);
				toast({
					title: "Failed to create post. Please try again.",
					description: `Error occurred at: ${formatDate(new Date())}`,
					action: (
						<ToastAction altText='Goto schedule to undo'>Undo</ToastAction>
					),
				});
			}
		} catch (error) {
			console.error("Error creating post", error);
			setError("Failed to create post. Please try again.");
			toast({
				title: "Failed to create post. Please try again.",
				description: `Error occurred at: ${formatDate(new Date())}`,
				action: <ToastAction altText='Goto schedule to undo'>Undo</ToastAction>,
			});
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (date) => {
		return date.toLocaleString(); // You can customize this format as needed
	};

	const insertMention = (mention) => {
		const textarea = textareaRef.current;
		if (textarea) {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const textContent =
				postContents.find((content) => content.type === "text")?.content || "";
			const newContent =
				textContent.substring(0, start - 1) +
				`@${mention} ` +
				textContent.substring(end);
			handleContentChange(
				postContents.findIndex((content) => content.type === "text"),
				newContent
			);
			setOpenMentions(false);
			textarea.focus();
			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd =
					start + mention.length + 2;
			}, 0);
		}
	};

	// Utility function to check if a block of a specific type exists
	const contentExists = (type) => {
		return postContents.some((content) => content.type === type);
	};

	const addContentBlock = (type) => {
		if (!contentExists(type)) {
			setPostContents([...postContents, { type, content: "" }]);
		}
	};

	const removeContentBlock = (index) => {
		const updatedContents = postContents.filter((_, i) => i !== index);
		setPostContents(updatedContents);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (openMentions && !event.target?.closest(".mentions-popover")) {
				setOpenMentions(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [openMentions]);

	const totalChars = postContents.reduce(
		(sum, content) => sum + content.content.length,
		0
	);

	return (
		<ToastProvider>
			<Card className='w-full mx-auto'>
				<CardContent className='p-6 max-h-[60vh] overflow-y-scroll'>
					{postContents.map((content, index) => (
						<div key={index} className='mb-4 relative'>
							{content.type === "text" && (
								<div className='relative'>
									<Textarea
										ref={index === 0 ? textareaRef : null}
										placeholder="What's on your mind? Use @ for mentions, # for hashtags, and [] for tags"
										value={content.content}
										onChange={(e) => handleContentChange(index, e.target.value)}
										className='max-h-[50px]  pr-8'
									/>
									<Popover open={openMentions} onOpenChange={setOpenMentions}>
										<PopoverTrigger asChild>
											<Button
												variant='ghost'
												size='sm'
												className='absolute right-8 top-2 my-auto'
											>
												<AtSign className='h-4 w-4' />
											</Button>
										</PopoverTrigger>
										<PopoverContent className='w-64 p-0 mentions-popover'>
											<Command>
												<CommandInput placeholder='Search people...' />
												<CommandList>
													<CommandEmpty>No people found.</CommandEmpty>
													<CommandGroup heading='Suggestions'>
														{mentionSuggestions &&
															mentionSuggestions.map((user) => (
																<CommandItem
																	key={user._id}
																	onSelect={() => insertMention(user.username)}
																>
																	{user.username}
																</CommandItem>
															))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</div>
							)}
							{content.type === "code" && (
								<Textarea
									placeholder='Paste your code snippet here'
									value={content.content}
									onChange={(e) => handleContentChange(index, e.target.value)}
									className='min-h-[100px] font-mono'
								/>
							)}
							{content.type === "image" && (
								<div
									className='border-2 border-dashed rounded-md p-2 text-center cursor-pointer'
									onDragOver={(e) => e.preventDefault()}
									onDrop={(e) => handleDrop(index, e)}
								>
									<Input
										type='file'
										accept='image/*'
										onChange={(e) => handleImageUpload(index, e)}
										className='hidden'
										id={`image-upload-${index}`}
									/>
									<label
										htmlFor={`image-upload-${index}`}
										className='cursor-pointer'
									>
										{content.content ? (
											<img
												src={content.content}
												alt='Uploaded preview'
												className='max-h-48 mx-auto'
											/>
										) : (
											<div className='text-gray-500'>
												<ImageIcon className='w-12 h-12 mx-auto mb-2' />
												<p>Click or drag and drop to upload an image</p>
											</div>
										)}
									</label>
								</div>
							)}
							<Button
								variant='ghost'
								size='icon'
								className='absolute top-2 right-2'
								onClick={() => removeContentBlock(index)}
							>
								<XIcon className='h-4 w-4' />
							</Button>
						</div>
					))}
					<div className='flex justify-between items-center mt-4'>
						<div className='flex space-x-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => addContentBlock("text")}
							>
								<FileTextIcon className='h-4 w-4 mr-2' />
								Add Text
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => addContentBlock("code")}
							>
								<Code2Icon className='h-4 w-4 mr-2' />
								Add Code
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => addContentBlock("image")}
							>
								<ImageIcon className='h-4 w-4 mr-2' />
								Add Image
							</Button>
						</div>
					</div>
					<div className='flex-col items-center py-4'>
						<Progress
							value={(totalChars / MAX_CHARS) * 100}
							className='w-full mr-2 '
						/>
						<span className='text-sm text-gray-500'>
							{totalChars}/{MAX_CHARS}
						</span>
					</div>
					<AnimatePresence>
						{(mentions.length > 0 ||
							hashtags.length > 0 ||
							tags.length > 0) && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className='flex flex-wrap gap-2 mt-4'
							>
								{mentions.map((mention, i) => (
									<motion.div
										key={`mention-${i}`}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className='flex items-center bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-sm'
									>
										<AtSign className='h-3 w-3 mr-1' />
										{mention}
									</motion.div>
								))}
								{hashtags.map((hashtag, i) => (
									<motion.div
										key={`hashtag-${i}`}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className='flex items-center bg-green-100 text-green-800 rounded-full px-2 py-1 text-sm'
									>
										<Hash className='h-3 w-3 mr-1' />
										{hashtag}
									</motion.div>
								))}
								{tags.map((tag, i) => (
									<motion.div
										key={`tag-${i}`}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className='flex items-center bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-sm'
									>
										<Tag className='h-3 w-3 mr-1' />
										{tag}
									</motion.div>
								))}
							</motion.div>
						)}
					</AnimatePresence>

					{showPreview && (
						<div className='p-4 border-t'>
							<h3 className='text-lg font-semibold mb-4'>Preview</h3>
							<div className='bg-sky-50 p-4 rounded-md border'>
								{postContents.map((content, index) => (
									<div key={index} className='mb-4'>
										{content.type === "text" && (
											<p className='whitespace-pre-wrap'>
												{content.content
													.split(/([@#\[][\w]+)/g)
													.map((part, i) => {
														if (part.startsWith("@")) {
															return (
																<span
																	key={i}
																	className='text-blue-600 font-semibold'
																>
																	{part}
																</span>
															);
														} else if (part.startsWith("#")) {
															return (
																<span
																	key={i}
																	className='text-green-600 font-semibold'
																>
																	{part}
																</span>
															);
														} else if (
															part.startsWith("[") &&
															part.endsWith("]")
														) {
															return (
																<span
																	key={i}
																	className='text-purple-600 font-semibold'
																>
																	{part}
																</span>
															);
														}
														return part;
													})}
											</p>
										)}
										{content.type === "code" && (
											<SyntaxHighlighter language='javascript' style={tomorrow}>
												{content.content}
											</SyntaxHighlighter>
										)}
										{content.type === "image" && content.content && (
											<img
												src={content.content}
												alt='User uploaded'
												className='max-h-64 mx-auto'
											/>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className='flex justify-between items-center p-4 bg-sky-50 border'>
					<div className='flex items-center space-x-2'>
						<Avatar>
							{/* {console.log(userInfo)} */}
							<AvatarImage
								src={`http://localhost:4000/${userInfo?.profilePicture}`}
								alt='User'
							/>
							<AvatarFallback className='bg-sky-400 text-sky-50'>
								{userInfo?.firstName?.charAt(0).toUpperCase() +
									userInfo?.lastName?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className='text-sm font-medium'>
							{userInfo?.firstName?.charAt(0).toUpperCase() +
								userInfo?.firstName?.slice(1).toLowerCase() +
								" " +
								userInfo?.lastName?.charAt(0).toUpperCase() +
								userInfo?.lastName?.slice(1).toLowerCase()}
						</span>
					</div>
					<div className='flex space-x-2'>
						<Button
							variant='outline'
							onClick={() => setShowPreview(!showPreview)}
						>
							<EyeIcon className='h-4 w-4 mr-2' />
							{showPreview ? "Edit" : "Preview"}
						</Button>

						<Button
							onClick={handlePost}
							className='bg-sky-500 hover:bg-sky-400'
							disabled={loading}
						>
							{loading ? "Please Wait..." : "Post"}
							<SendHorizontal className='ml-2 h-4 w-4' />
						</Button>
					</div>
				</CardFooter>
			</Card>
		</ToastProvider>
	);
};

export default AdvancedPostCard;
