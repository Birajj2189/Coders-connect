import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Search,
	ExternalLink,
	Github,
	Clock,
	Star,
	Users,
	MoreVertical,
	ThumbsUp,
} from "lucide-react";
import { BreadcrumbResponsive } from "../breadcrumbs";

// Enhanced mock data
const projectsData = [
	{
		id: 1,
		author: {
			name: "John Doe",
			avatar: "https://github.com/shadcn.png",
			isFollowing: false,
		},
		title: "Awesome Project",
		description: "This is a really cool project that does amazing things.",
		url: "https://awesome-project.com",
		githubRepo: "https://github.com/johndoe/awesome-project",
		skills: ["React", "TypeScript", "Node.js"],
		timestamp: "2023-06-15T10:30:00Z",
		status: "In Progress",
		likes: 42,
		contributors: 5,
		lastUpdated: "2023-06-20T14:45:00Z",
		completionPercentage: 75,
		category: "Web Development",
		longDescription:
			"This project aims to revolutionize web development by introducing innovative concepts and cutting-edge technologies. It leverages the power of React and TypeScript to create a robust and scalable application, while Node.js powers the backend for seamless integration.",
	},
	{
		id: 2,
		author: {
			name: "John Doe",
			avatar: "https://github.com/shadcn.png",
			isFollowing: false,
		},
		title: "Awesome Project",
		description: "This is a really cool project that does amazing things.",
		url: "https://awesome-project.com",
		githubRepo: "https://github.com/johndoe/awesome-project",
		skills: ["React", "TypeScript", "Node.js"],
		timestamp: "2023-06-15T10:30:00Z",
		status: "In Progress",
		likes: 42,
		contributors: 5,
		lastUpdated: "2023-06-20T14:45:00Z",
		completionPercentage: 75,
		category: "Web Development",
		longDescription:
			"This project aims to revolutionize web development by introducing innovative concepts and cutting-edge technologies. It leverages the power of React and TypeScript to create a robust and scalable application, while Node.js powers the backend for seamless integration.",
	},
	{
		id: 3,
		author: {
			name: "John Doe",
			avatar: "https://github.com/shadcn.png",
			isFollowing: false,
		},
		title: "Awesome Project",
		description: "This is a really cool project that does amazing things.",
		url: "https://awesome-project.com",
		githubRepo: "https://github.com/johndoe/awesome-project",
		skills: ["React", "TypeScript", "Node.js"],
		timestamp: "2023-06-15T10:30:00Z",
		status: "Completed",
		likes: 42,
		contributors: 5,
		lastUpdated: "2023-06-20T14:45:00Z",
		completionPercentage: 75,
		category: "Web Development",
		longDescription:
			"This project aims to revolutionize web development by introducing innovative concepts and cutting-edge technologies. It leverages the power of React and TypeScript to create a robust and scalable application, while Node.js powers the backend for seamless integration.",
	},
	{
		id: 4,
		author: {
			name: "John Doe",
			avatar: "https://github.com/shadcn.png",
			isFollowing: false,
		},
		title: "Awesome Project",
		description: "This is a really cool project that does amazing things.",
		url: "https://awesome-project.com",
		githubRepo: "https://github.com/johndoe/awesome-project",
		skills: ["React", "TypeScript", "Node.js"],
		timestamp: "2023-06-15T10:30:00Z",
		status: "In Progress",
		likes: 42,
		contributors: 5,
		lastUpdated: "2023-06-20T14:45:00Z",
		completionPercentage: 75,
		category: "Web Development",
		longDescription:
			"This project aims to revolutionize web development by introducing innovative concepts and cutting-edge technologies. It leverages the power of React and TypeScript to create a robust and scalable application, while Node.js powers the backend for seamless integration.",
	},
	// Add more mock projects here...
];

export default function Component() {
	const [projects, setProjects] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		// Simulate API call
		setTimeout(() => {
			setProjects(projectsData);
			setLoading(false);
		}, 1500);
	}, []);

	const handleSearch = (query) => {
		setSearchQuery(query);
		const filteredProjects = projectsData.filter(
			(project) =>
				project.title.toLowerCase().includes(query.toLowerCase()) ||
				project.description.toLowerCase().includes(query.toLowerCase()) ||
				project.skills.some((skill) =>
					skill.toLowerCase().includes(query.toLowerCase())
				) ||
				project.category.toLowerCase().includes(query.toLowerCase())
		);
		setProjects(filteredProjects);
	};

	const handleFollow = (projectId) => {
		setProjects(
			projects.map((project) => {
				if (project.id === projectId) {
					const newFollowState = !project.author.isFollowing;
					toast({
						title: newFollowState ? "Followed" : "Unfollowed",
						description: `You have ${
							newFollowState ? "followed" : "unfollowed"
						} ${project.author.name}`,
					});
					return {
						...project,
						author: {
							...project.author,
							isFollowing: newFollowState,
						},
					};
				}
				return project;
			})
		);
	};

	const handleLike = (projectId) => {
		setProjects(
			projects.map((project) => {
				if (project.id === projectId) {
					const newLikes = project.likes + 1;
					toast({
						title: "Liked!",
						description: `You liked ${project.title}`,
					});
					return { ...project, likes: newLikes };
				}
				return project;
			})
		);
	};

	const ProjectCard = ({ project }) => (
		<Card className='flex flex-col'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<div className='flex items-center space-x-2'>
						<Avatar>
							<AvatarImage
								src={project.author.avatar}
								alt={project.author.name}
							/>
							<AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle>{project.title}</CardTitle>
							<p className='text-sm text-gray-500'>{project.author.name}</p>
						</div>
					</div>
					<div className='flex items-center space-x-2'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={
											project.author.isFollowing ? "secondary" : "default"
										}
										size='sm'
										onClick={() => handleFollow(project.id)}
									>
										{project.author.isFollowing ? "Following" : "Follow"}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										{project.author.isFollowing ? "Unfollow" : "Follow"}{" "}
										{project.author.name}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='sm'>
									<MoreVertical className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>Share</DropdownMenuItem>
								<DropdownMenuItem>Report</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardHeader>
			<CardContent className='flex-grow'>
				<p className='text-gray-600 mb-4'>{project.description}</p>
				<div className='flex flex-wrap gap-2 mb-4'>
					{project.skills.map((skill, index) => (
						<Badge key={index} variant='secondary'>
							{skill}
						</Badge>
					))}
				</div>
				<Badge className='mb-2'>{project.status}</Badge>
				<Badge variant='outline' className='mb-2 ml-2'>
					{project.category}
				</Badge>
				<div className='flex items-center justify-between text-sm text-gray-500 mb-2'>
					<div className='flex items-center'>
						<Clock className='mr-1 h-4 w-4' />
						{new Date(project.timestamp).toLocaleDateString()}
					</div>
					<div className='flex items-center'>
						<Users className='mr-1 h-4 w-4' />
						{project.contributors} contributors
					</div>
				</div>
				<div className='mb-4'>
					<div className='flex justify-between mb-1'>
						<span className='text-sm font-medium'>Progress</span>
						<span className='text-sm font-medium'>
							{project.completionPercentage}%
						</span>
					</div>
					<Progress value={project.completionPercentage} className='w-full' />
				</div>
			</CardContent>
			<CardFooter className='flex justify-between'>
				<div className='flex space-x-2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='outline'
									size='sm'
									onClick={() => handleLike(project.id)}
								>
									<ThumbsUp className='mr-1 h-4 w-4' /> {project.likes}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Like this project</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant='outline' size='sm' asChild>
									<a
										href={project.url}
										target='_blank'
										rel='noopener noreferrer'
									>
										<ExternalLink className='mr-1 h-4 w-4' /> Visit
									</a>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Visit project website</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant='outline' size='sm' asChild>
									<a
										href={project.githubRepo}
										target='_blank'
										rel='noopener noreferrer'
									>
										<Github className='mr-1 h-4 w-4' /> Repo
									</a>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>View GitHub repository</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='link' size='sm'>
							View Details
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>{project.title}</DialogTitle>
							<DialogDescription>By {project.author.name}</DialogDescription>
						</DialogHeader>
						<div className='grid gap-4 py-4'>
							<p>{project.longDescription}</p>
							<p>
								Last updated: {new Date(project.lastUpdated).toLocaleString()}
							</p>
						</div>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</Card>
	);

	const BreadcrumbItems = [{ href: "/", label: "Home" }, { label: "Projects" }];

	return (
		<div className='container mx-auto bg-blue-50'>
			<BreadcrumbResponsive items={BreadcrumbItems} />
			<div className='my-4 flex justify-between items-center'>
				<Input
					type='text'
					placeholder='Search projects...'
					value={searchQuery}
					onChange={(e) => handleSearch(e.target.value)}
				/>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{loading ? (
					Array.from({ length: 6 }, (_, i) => (
						<Skeleton key={i} className='w-full h-80' />
					))
				) : projects.length > 0 ? (
					projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))
				) : (
					<p>No projects found</p>
				)}
			</div>
		</div>
	);
}
