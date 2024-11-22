"use client";

import { useState } from "react";
import {
	Calendar,
	Users,
	Send,
	Trophy,
	Plus,
	Clock,
	Bell,
	Code,
	Zap,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { BreadcrumbResponsive } from "../breadcrumbs";

export default function EnhancedHackathonPage() {
	const [hackathons, setHackathons] = useState([
		{
			id: "1",
			name: "AI Innovation Challenge",
			startDate: "2023-08-15",
			endDate: "2023-08-17",
			description: "Create AI-powered solutions for real-world problems",
			registered: false,
			skills: [
				"Machine Learning",
				"Natural Language Processing",
				"Computer Vision",
			],
			prizes: [
				"$10,000 Grand Prize",
				"Cloud Credits",
				"Mentorship Opportunities",
			],
		},
		{
			id: "2",
			name: "Blockchain Bonanza",
			startDate: "2023-09-01",
			endDate: "2023-09-03",
			description: "Build decentralized applications on the blockchain",
			registered: true,
			skills: ["Smart Contracts", "Cryptography", "Web3"],
			prizes: ["$15,000 Grand Prize", "Startup Incubation", "Hardware Wallets"],
		},
		{
			id: "3",
			name: "Green Tech Hackathon",
			startDate: "2023-09-20",
			endDate: "2023-09-22",
			description: "Develop sustainable technology solutions",
			registered: false,
			skills: ["IoT", "Data Analytics", "Renewable Energy"],
			prizes: [
				"$12,000 Grand Prize",
				"Sustainability Certification",
				"Networking Event",
			],
		},
	]);

	const [teams, setTeams] = useState([
		{
			id: "1",
			name: "Code Crusaders",
			members: ["Alice", "Bob", "Charlie"],
			hackathonId: "2",
		},
		{
			id: "2",
			name: "Data Dynamos",
			members: ["David", "Eve"],
			hackathonId: "2",
		},
	]);

	const [projects, setProjects] = useState([
		{
			id: "1",
			name: "EcoTrack",
			description: "An app to track and reduce carbon footprint",
			teamId: "1",
			score: 85,
		},
		{
			id: "2",
			name: "CryptoHealth",
			description: "Blockchain-based health record system",
			teamId: "2",
			score: 92,
		},
	]);

	const [invitations, setInvitations] = useState([
		{ id: "1", teamId: "1", teamName: "Code Crusaders" },
		{ id: "2", teamId: "2", teamName: "Data Dynamos" },
	]);

	const [selectedHackathon, setSelectedHackathon] = useState(null);
	const [newTeam, setNewTeam] = useState({ name: "", hackathonId: "" });
	const [newProject, setNewProject] = useState({
		name: "",
		description: "",
		teamId: "",
	});
	const [userSkills, setUserSkills] = useState([
		"JavaScript",
		"React",
		"Node.js",
	]);

	const toggleRegistration = (hackathon) => {
		setHackathons(
			hackathons.map((h) =>
				h.id === hackathon.id ? { ...h, registered: !h.registered } : h
			)
		);
		toast({
			title: hackathon.registered
				? "Unregistered from hackathon"
				: "Registered for hackathon",
			description: `You have ${
				hackathon.registered ? "unregistered from" : "registered for"
			} ${hackathon.name}`,
		});
	};

	const createTeam = () => {
		if (newTeam.name && newTeam.hackathonId) {
			const newTeamObj = {
				id: Date.now().toString(),
				name: newTeam.name,
				members: ["You"],
				hackathonId: newTeam.hackathonId,
			};
			setTeams([...teams, newTeamObj]);
			setNewTeam({ name: "", hackathonId: "" });
			toast({
				title: "Team created",
				description: `You have created the team ${newTeam.name}`,
			});
		}
	};

	const acceptInvitation = (invitation) => {
		setTeams(
			teams.map((t) =>
				t.id === invitation.teamId
					? { ...t, members: [...t.members, "You"] }
					: t
			)
		);
		setInvitations(invitations.filter((i) => i.id !== invitation.id));
		toast({
			title: "Invitation accepted",
			description: `You have joined the team ${invitation.teamName}`,
		});
	};

	const submitProject = () => {
		if (newProject.name && newProject.description && newProject.teamId) {
			setProjects([
				...projects,
				{ ...newProject, id: Date.now().toString(), score: 0 },
			]);
			setNewProject({ name: "", description: "", teamId: "" });
			toast({
				title: "Project submitted",
				description: `Your project ${newProject.name} has been submitted for evaluation`,
			});
		}
	};

	const getCountdown = (date) => {
		const now = new Date();
		const eventDate = new Date(date);
		const difference = eventDate.getTime() - now.getTime();
		const days = Math.ceil(difference / (1000 * 3600 * 24));
		return `${days} days`;
	};

	const getProgress = (startDate, endDate) => {
		const now = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);
		const total = end.getTime() - start.getTime();
		const elapsed = now.getTime() - start.getTime();
		return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
	};

	const BreadcrumbItems = [
		{ href: "/", label: "Home" },
		{ label: "Hackathons" },
	];

	return (
		<div className='container mx-auto p-4 bg-blue-50'>
			<BreadcrumbResponsive items={BreadcrumbItems} />
			<h1 className='text-3xl font-bold mb-6'>Virtual Hackathon Hub</h1>

			<Tabs defaultValue='upcoming' className='w-full'>
				<TabsList>
					<TabsTrigger value='upcoming'>Upcoming Hackathons</TabsTrigger>
					<TabsTrigger value='registered'>My Hackathons</TabsTrigger>
					<TabsTrigger value='teams'>Teams</TabsTrigger>
					<TabsTrigger value='submit'>Submit Project</TabsTrigger>
					<TabsTrigger value='leaderboard'>Leaderboard</TabsTrigger>
				</TabsList>

				<TabsContent value='upcoming'>
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Hackathons</CardTitle>
							<CardDescription>
								Discover and register for exciting hackathons
							</CardDescription>
						</CardHeader>
						<CardContent>
							{hackathons.map((hackathon) => (
								<div key={hackathon.id} className='mb-4 p-4 border rounded-lg'>
									<div className='flex justify-between items-start'>
										<div>
											<h3 className='text-lg font-semibold'>
												{hackathon.name}
											</h3>
											<p className='text-sm text-gray-600'>
												{hackathon.description}
											</p>
											<div className='mt-2 flex items-center'>
												<Calendar className='mr-2 h-4 w-4' />
												<span className='text-sm'>
													{hackathon.startDate} - {hackathon.endDate}
												</span>
											</div>
											<div className='mt-2 flex items-center'>
												<Clock className='mr-2 h-4 w-4' />
												<span className='text-sm'>
													Starts in: {getCountdown(hackathon.startDate)}
												</span>
											</div>
										</div>
										<div className='flex flex-col items-end'>
											<Dialog>
												<DialogTrigger asChild>
													<Button variant='outline' className='mb-2'>
														View Details
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>{hackathon.name}</DialogTitle>
														<DialogDescription>
															{hackathon.description}
														</DialogDescription>
													</DialogHeader>
													<div className='mt-4'>
														<h4 className='font-semibold'>Date</h4>
														<p>
															{hackathon.startDate} - {hackathon.endDate}
														</p>
														<h4 className='font-semibold mt-2'>
															Required Skills
														</h4>
														<div className='flex flex-wrap gap-2 mt-1'>
															{hackathon.skills.map((skill) => (
																<Badge key={skill} variant='secondary'>
																	{skill}
																</Badge>
															))}
														</div>
														<h4 className='font-semibold mt-2'>Prizes</h4>
														<ul className='list-disc list-inside'>
															{hackathon.prizes.map((prize) => (
																<li key={prize}>{prize}</li>
															))}
														</ul>
													</div>
													<DialogFooter>
														<Button
															variant='outline'
															onClick={() => toggleRegistration(hackathon)}
														>
															{hackathon.registered ? "Unregister" : "Register"}
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
											<Button onClick={() => toggleRegistration(hackathon)}>
												{hackathon.registered ? "Unregister" : "Register"}
											</Button>
											<Progress
												value={getProgress(
													hackathon.startDate,
													hackathon.endDate
												)}
												className='mt-2 w-full'
											/>
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='registered'>
					<Card>
						<CardHeader>
							<CardTitle>Registered Hackathons</CardTitle>
							<CardDescription>
								View and manage your hackathon registrations
							</CardDescription>
						</CardHeader>
						<CardContent>
							{hackathons
								.filter((h) => h.registered)
								.map((hackathon) => (
									<div
										key={hackathon.id}
										className='mb-4 p-4 border rounded-lg'
									>
										<div className='flex justify-between items-start'>
											<div>
												<h3 className='text-lg font-semibold'>
													{hackathon.name}
												</h3>
												<p className='text-sm text-gray-600'>
													{hackathon.description}
												</p>
												<div className='mt-2 flex items-center'>
													<Calendar className='mr-2 h-4 w-4' />
													<span className='text-sm'>
														{hackathon.startDate} - {hackathon.endDate}
													</span>
												</div>
												<div className='mt-2 flex items-center'>
													<Clock className='mr-2 h-4 w-4' />
													<span className='text-sm'>
														Starts in: {getCountdown(hackathon.startDate)}
													</span>
												</div>
											</div>
											<div className='flex flex-col items-end'>
												<Button onClick={() => toggleRegistration(hackathon)}>
													{hackathon.registered ? "Unregister" : "Register"}
												</Button>
											</div>
										</div>
									</div>
								))}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='teams'>
					<Card>
						<CardHeader>
							<CardTitle>Teams</CardTitle>
							<CardDescription>Manage your hackathon teams</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center mb-4'>
								<Input
									placeholder='Team Name'
									value={newTeam.name}
									onChange={(e) =>
										setNewTeam({ ...newTeam, name: e.target.value })
									}
									className='mr-2'
								/>
								<Select
									value={newTeam.hackathonId}
									onValueChange={(value) =>
										setNewTeam({ ...newTeam, hackathonId: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder='Select Hackathon' />
									</SelectTrigger>
									<SelectContent>
										{hackathons.map((hackathon) => (
											<SelectItem key={hackathon.id} value={hackathon.id}>
												{hackathon.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button onClick={createTeam}>
									<Plus className='mr-2 h-4 w-4' /> Create Team
								</Button>
							</div>

							<ScrollArea className='h-64'>
								{teams.map((team) => (
									<div key={team.id} className='p-4 border rounded-lg mb-4'>
										<div className='flex justify-between items-start'>
											<div>
												<h3 className='text-lg font-semibold'>{team.name}</h3>
												<p className='text-sm'>
													Members: {team.members.join(", ")}
												</p>
											</div>
											<Button onClick={() => inviteMembers(team.id)}>
												Invite
											</Button>
										</div>
									</div>
								))}
							</ScrollArea>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='submit'>
					<Card>
						<CardHeader>
							<CardTitle>Submit Project</CardTitle>
							<CardDescription>
								Submit your hackathon project for evaluation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Input
								placeholder='Project Name'
								value={newProject.name}
								onChange={(e) =>
									setNewProject({ ...newProject, name: e.target.value })
								}
								className='mb-4'
							/>
							<Textarea
								placeholder='Project Description'
								value={newProject.description}
								onChange={(e) =>
									setNewProject({ ...newProject, description: e.target.value })
								}
								className='mb-4'
							/>
							<Select
								value={newProject.teamId}
								onValueChange={(value) =>
									setNewProject({ ...newProject, teamId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select Team' />
								</SelectTrigger>
								<SelectContent>
									{teams.map((team) => (
										<SelectItem key={team.id} value={team.id}>
											{team.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button onClick={submitProject} className='mt-4'>
								<Send className='mr-2 h-4 w-4' /> Submit Project
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='leaderboard'>
					<Card>
						<CardHeader>
							<CardTitle>Leaderboard</CardTitle>
							<CardDescription>
								See the top-scoring projects in the hackathon
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='overflow-x-auto'>
								<table className='table-auto w-full'>
									<thead>
										<tr>
											<th className='px-4 py-2'>Project Name</th>
											<th className='px-4 py-2'>Team</th>
											<th className='px-4 py-2'>Score</th>
										</tr>
									</thead>
									<tbody>
										{projects.map((project) => (
											<tr key={project.id}>
												<td className='border px-4 py-2'>{project.name}</td>
												<td className='border px-4 py-2'>
													{teams.find((team) => team.id === project.teamId)
														?.name || "Unknown"}
												</td>
												<td className='border px-4 py-2'>{project.score}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
