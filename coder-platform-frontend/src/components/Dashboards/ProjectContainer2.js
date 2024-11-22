import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
	Plus,
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
		completionPercentage: 75,
		category: "Web Development",
	},
	// Add more mock projects here...
];

const userProjectsData = [
	{
		id: 101,
		title: "My Cool Project",
		description: "A project I'm working on to learn new technologies.",
		skills: ["Vue.js", "Firebase"],
		status: "In Progress",
		completionPercentage: 60,
	},
	// Add more user projects here...
];

export default function Component() {
	const [projects, setProjects] = useState([]);
	const [userProjects, setUserProjects] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
	const [newProject, setNewProject] = useState({
		title: "",
		description: "",
		skills: "",
		url: "",
		githubRepo: "",
	});
	const { toast } = useToast();

	useEffect(() => {
		// Simulate API call
		setTimeout(() => {
			setProjects(projectsData);
			setUserProjects(userProjectsData);
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

	const handleCreateProject = (e) => {
		e.preventDefault();
		// Here you would typically send this data to your backend
		const createdProject = {
			...newProject,
			id: Date.now(),
			skills: newProject.skills.split(",").map((skill) => skill.trim()),
			status: "Not Started",
			completionPercentage: 0,
		};
		setUserProjects([createdProject, ...userProjects]);
		setIsCreateProjectOpen(false);
		setNewProject({
			title: "",
			description: "",
			skills: "",
			url: "",
			githubRepo: "",
		});
		toast({
			title: "Project Created",
			description: "Your new project has been successfully created.",
		});
	};

	const ProjectCard = ({ project, isUserProject = false }) => (
		<Card className='flex flex-col'>
			<CardHeader>
				{!isUserProject && (
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
				)}
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
				{!userProjects && (
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
				)}
			</CardFooter>
		</Card>
	);

	const BreadcrumbItems = [{ href: "/", label: "Home" }, { label: "Projects" }];
	return (
		<div className='container mx-auto p-4 bg-blue-50'>
			<BreadcrumbResponsive items={BreadcrumbItems} />
			<h1 className='text-3xl font-bold mb-4 pb-2'>Projects</h1>
			<Tabs defaultValue='all-projects'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='all-projects'>All Projects</TabsTrigger>
					<TabsTrigger value='my-projects'>My Projects</TabsTrigger>
				</TabsList>
				<TabsContent value='all-projects'>
					<div className='relative mb-4'>
						<Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
						<Input
							className='pl-8 bg-white border-2 rounded-xl focus:border-2 focus:border-ring-none'
							placeholder='Search projects...'
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{loading
							? Array(6)
									.fill(0)
									.map((_, index) => (
										<Card key={index} className='flex flex-col'>
											<CardHeader>
												<Skeleton className='h-12 w-12 rounded-full' />
												<Skeleton className='h-4 w-[250px]' />
											</CardHeader>
											<CardContent>
												<Skeleton className='h-4 w-[300px] mb-4' />
												<Skeleton className='h-4 w-[250px] mb-4' />
												<Skeleton className='h-4 w-[200px]' />
											</CardContent>
											<CardFooter>
												<Skeleton className='h-10 w-[100px]' />
											</CardFooter>
										</Card>
									))
							: projects.map((project) => (
									<ProjectCard key={project.id} project={project} />
							  ))}
					</div>
				</TabsContent>
				<TabsContent value='my-projects'>
					<Button
						onClick={() => setIsCreateProjectOpen(true)}
						variant='outline'
						className='mb-4'
					>
						<Plus className='mr-2 h-4 w-4' /> Create New Project
					</Button>
					<div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
						{userProjects.map((project) => (
							<ProjectCard key={project.id} project={project} isUserProject />
						))}
					</div>
				</TabsContent>
			</Tabs>

			<Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
				{/* <DialogTrigger asChild>
					<Button variant='outline'>Create Project</Button>
				</DialogTrigger> */}
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Project</DialogTitle>
						<DialogDescription>
							Fill out the details for your new project.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreateProject} className='space-y-4'>
						<Label htmlFor='title'>Title</Label>
						<Input
							id='title'
							value={newProject.title}
							onChange={(e) =>
								setNewProject({ ...newProject, title: e.target.value })
							}
							required
						/>
						<Label htmlFor='description'>Description</Label>
						<Textarea
							id='description'
							value={newProject.description}
							onChange={(e) =>
								setNewProject({ ...newProject, description: e.target.value })
							}
							required
						/>
						<Label htmlFor='skills'>Skills (comma-separated)</Label>
						<Input
							id='skills'
							value={newProject.skills}
							onChange={(e) =>
								setNewProject({ ...newProject, skills: e.target.value })
							}
						/>
						<Label htmlFor='url'>Project URL</Label>
						<Input
							id='url'
							value={newProject.url}
							onChange={(e) =>
								setNewProject({ ...newProject, url: e.target.value })
							}
						/>
						<Label htmlFor='githubRepo'>GitHub Repository</Label>
						<Input
							id='githubRepo'
							value={newProject.githubRepo}
							onChange={(e) =>
								setNewProject({ ...newProject, githubRepo: e.target.value })
							}
						/>
						<DialogFooter>
							<Button type='submit'>Create Project</Button>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsCreateProjectOpen(false)}
							>
								Cancel
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
