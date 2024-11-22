"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BreadcrumbResponsive } from "../breadcrumbs";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Search,
	Heart,
	MessageCircle,
	Share2,
	Filter,
	ChevronDown,
	Clock,
	Eye,
	Bookmark,
	ThumbsUp,
	Plus,
	X,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";

const allSkills1 = [
	{ id: 1, name: "React", color: "bg-blue-500", icon: "⚛️" },
	{ id: 2, name: "Node.js", color: "bg-green-500", icon: "🟢" },
	{ id: 3, name: "Python", color: "bg-yellow-500", icon: "🐍" },
	{ id: 4, name: "Machine Learning", color: "bg-purple-500", icon: "🧠" },
	{ id: 5, name: "UI/UX Design", color: "bg-pink-500", icon: "🎨" },
	{ id: 6, name: "JavaScript", color: "bg-yellow-400", icon: "🟨" },
	{ id: 7, name: "TypeScript", color: "bg-blue-600", icon: "🔷" },
	{ id: 8, name: "GraphQL", color: "bg-pink-600", icon: "◼️" },
	{ id: 9, name: "Docker", color: "bg-blue-400", icon: "🐳" },
	{ id: 10, name: "Kubernetes", color: "bg-blue-700", icon: "☸️" },
];

const initialThreads = [
	{
		id: 1,
		user: {
			id: 1,
			name: "Alice Johnson",
			username: "alice_dev",
			reputation: 1250,
		},
		content:
			"What's the best way to manage state in a large React application? I've been using Redux, but I'm curious about other options like MobX or Recoil.",
		image: "/placeholder.svg?height=300&width=400",
		likes: 15,
		replies: 7,
		views: 230,
		skills: ["React"],
		createdAt: "2023-06-15T10:30:00Z",
	},
	{
		id: 2,
		user: {
			id: 2,
			name: "Bob Smith",
			username: "bob_coder",
			reputation: 980,
		},
		content:
			"How do you handle authentication in a Node.js API? I'm building a RESTful API and I'm not sure whether to use JWT or session-based auth.",
		image: "/placeholder.svg?height=300&width=400",
		likes: 10,
		replies: 5,
		views: 180,
		skills: ["Node.js"],
		createdAt: "2023-06-14T14:45:00Z",
	},
	{
		id: 3,
		user: {
			id: 3,
			name: "Charlie Brown",
			username: "charlie_ml",
			reputation: 1500,
		},
		content:
			"What are some good resources for learning machine learning? I'm a Python developer looking to transition into AI and ML.",
		image: "/placeholder.svg?height=300&width=400",
		likes: 20,
		replies: 12,
		views: 350,
		skills: ["Python", "Machine Learning"],
		createdAt: "2023-06-13T09:15:00Z",
	},
];

export default function ThreadsAndSkillsPage() {
	const [followedSkills, setFollowedSkills] = useState(allSkills1.slice(0, 5));
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [skillSearchQuery, setSkillSearchQuery] = useState("");
	const [threads, setThreads] = useState(initialThreads);
	const [newThreadTitle, setNewThreadTitle] = useState("");
	const [newThreadContent, setNewThreadContent] = useState("");
	const [newThreadSkills, setNewThreadSkills] = useState([]);
	const [isNewThreadModalOpen, setIsNewThreadModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);
	const [allSkills, setAllSkills] = useState(null);

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
		if (!token) return;

		const fetchAllSkills = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/api/skills/all-list/?page=1` // Use correct endpoint for profile picture
				);
				if (response.status === 200) {
					const result = response.data;
					setAllSkills(result.skills); // Update cover image URL
				} else {
					console.error("Failed to fetch the skills");
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchAllSkills();
		console.log(allSkills?.skills);
	}, [token]);

	const handleFollowSkill = (skill) => {
		if (!followedSkills.find((s) => s.id === skill.id)) {
			setFollowedSkills([...followedSkills, skill]);
		}
	};

	const handleUnfollowSkill = (skillId) => {
		setFollowedSkills(followedSkills.filter((s) => s.id !== skillId));
	};

	const handleSelectSkill = (skill) => {
		if (selectedSkills.includes(skill)) {
			setSelectedSkills(selectedSkills.filter((s) => s !== skill));
		} else {
			setSelectedSkills([...selectedSkills, skill]);
		}
	};

	const handleNewThreadSkillToggle = (skill) => {
		if (newThreadSkills.includes(skill)) {
			setNewThreadSkills(newThreadSkills.filter((s) => s !== skill));
		} else {
			setNewThreadSkills([...newThreadSkills, skill]);
		}
	};

	const handleCreateNewThread = () => {
		const newThread = {
			id: threads.length + 1,
			user: {
				id: 1,
				name: "Current User",
				username: "current_user",
				reputation: 100,
			},
			content: newThreadContent,
			image: "/placeholder.svg?height=300&width=400",
			likes: 0,
			replies: 0,
			views: 0,
			skills: newThreadSkills,
			createdAt: new Date().toISOString(),
			title: newThreadTitle,
		};
		setThreads([newThread, ...threads]);
		setNewThreadTitle("");
		setNewThreadContent("");
		setNewThreadSkills([]);
		setIsNewThreadModalOpen(false);
	};

	const filteredThreads = threads.filter((thread) =>
		selectedSkills.length === 0
			? true
			: thread.skills.some((skill) => selectedSkills.includes(skill))
	);

	const filteredSkills = allSkills?.filter(
		(skill) =>
			!followedSkills.find((s) => s.id === skill.id) &&
			skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
	);

	const BreadcrumbItems = [{ href: "/", label: "Home" }, { label: "Threads" }];

	return (
		<div className='container mx-auto p-4 max-w-full max-h-screen bg-blue-50'>
			<BreadcrumbResponsive items={BreadcrumbItems} />
			<nav className='flex items-center justify-between mb-8 '>
				<h1 className='text-3xl font-bold  my-auto'>Threads</h1>
				<div className='flex items-center space-x-4'>
					<div className='relative w-64'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
						<Input
							type='search'
							placeholder='Search threads...'
							className='pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Dialog
						open={isNewThreadModalOpen}
						onOpenChange={setIsNewThreadModalOpen}
					>
						<DialogTrigger asChild>
							<Button variant='default'>New Thread</Button>
						</DialogTrigger>
						<DialogContent className='sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle>Create New Thread</DialogTitle>
								<DialogDescription>
									Share your thoughts or questions with the community.
								</DialogDescription>
							</DialogHeader>
							<div className='grid gap-4 py-4'>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor='title' className='text-right'>
										Title
									</Label>
									<Input
										id='title'
										value={newThreadTitle}
										onChange={(e) => setNewThreadTitle(e.target.value)}
										className='col-span-3'
									/>
								</div>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor='content' className='text-right'>
										Content
									</Label>
									<Textarea
										id='content'
										value={newThreadContent}
										onChange={(e) => setNewThreadContent(e.target.value)}
										className='col-span-3'
									/>
								</div>
								<div className='grid grid-cols-4 items-start gap-4'>
									<Label htmlFor='skills' className='text-right'>
										Skills
									</Label>
									<div className='col-span-3'>
										{allSkills?.map((skill) => (
											<div
												key={skill.id}
												className='flex items-center space-x-2'
											>
												<input
													type='checkbox'
													id={`skill-${skill.id}`}
													checked={newThreadSkills.includes(skill.name)}
													onChange={() =>
														handleNewThreadSkillToggle(skill.name)
													}
												/>
												<Label htmlFor={`skill-${skill.id}`}>
													{skill.image} {skill.name}
												</Label>
											</div>
										))}
									</div>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={handleCreateNewThread}>Create</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</nav>
			<ScrollArea className='h-full'>
				<div className='flex space-x-4'>
					<div className='flex-shrink-0 w-1/4'>
						<Card className='mb-8'>
							<CardHeader>
								<CardTitle>Followed Skills</CardTitle>
							</CardHeader>
							<CardContent>
								{followedSkills.map((skill) => (
									<Badge
										key={skill.id}
										className='flex items-center justify-between p-2 mb-2'
									>
										<span>
											{skill.icon} {skill.name}
										</span>
										<X
											className='cursor-pointer'
											onClick={() => handleUnfollowSkill(skill.id)}
										/>
									</Badge>
								))}
							</CardContent>
						</Card>
						<Card className='mb-8'>
							<CardHeader>
								<CardTitle>Discover Skills</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='relative mb-4'>
									<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
									<Input
										type='search'
										placeholder='Search skills...'
										className='pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
										value={skillSearchQuery}
										onChange={(e) => setSkillSearchQuery(e.target.value)}
									/>
								</div>
								{filteredSkills?.map((skill) => (
									<div
										key={skill.id}
										className='flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100'
										onClick={() => handleFollowSkill(skill)}
									>
										<span>
											{skill.icon} {skill.name}
										</span>
										<Plus />
									</div>
								))}
							</CardContent>
						</Card>
					</div>
					<div className='flex-grow'>
						{filteredThreads.length > 0 ? (
							filteredThreads.map((thread) => (
								<Card key={thread.id} className='mb-8'>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<div className='flex items-center space-x-4'>
												<Avatar>
													<AvatarImage src={thread.image} />
													<AvatarFallback>
														{thread.user.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<CardTitle>{thread.user.name}</CardTitle>
													<CardDescription>
														@{thread.user.username} · {thread.createdAt}
													</CardDescription>
												</div>
											</div>
											<div className='text-gray-400'>
												<Clock className='mr-1' />
												{new Date(thread.createdAt).toLocaleString()}
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<p>{thread.content}</p>
									</CardContent>
									<CardFooter className='flex items-center justify-between'>
										<div className='flex items-center space-x-4'>
											<ThumbsUp className='cursor-pointer' />
											<span>{thread.likes}</span>
											<MessageCircle className='cursor-pointer' />
											<span>{thread.replies}</span>
										</div>
										<div className='text-gray-400'>
											<Eye className='mr-1' />
											{thread.views}
										</div>
									</CardFooter>
								</Card>
							))
						) : (
							<p>No threads found for selected skills.</p>
						)}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
