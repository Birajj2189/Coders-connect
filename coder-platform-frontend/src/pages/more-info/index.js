"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Command,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAppStore } from "@/store";
import { useRouter } from "next/router";

export default function UserInfoForm() {
	const [selectedSkills, setSelectedSkills] = useState([]);
	const [open, setOpen] = useState(false);
	const [skills, setSkills] = useState([]);
	const [loading, setLoading] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [bio, setBio] = useState("");
	const [gender, setGender] = useState("male");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [degree, setDegree] = useState("");
	const [institution, setInstitution] = useState("");
	const [graduationYear, setGraduationYear] = useState("");
	const [fieldOfStudy, setFieldOfStudy] = useState("");
	const [linkedinLink, setLinkedinLink] = useState("");
	const [websiteLink, setWebsiteLink] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [token, setToken] = useState(null);

	const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
	const [redirectCountdown, setRedirectCountdown] = useState(3);

	const { setUserInfo, userInfo } = useAppStore();
	const user = userInfo;
	console.log("11111111", userInfo);
	const router = useRouter();

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
		const fetchAllSkills = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/api/skills/all-list/?page=1`
				);
				if (response.status === 200) {
					const result = response.data;
					setSkills(result.skills);
				} else {
					console.error("Failed to fetch the skills");
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchAllSkills();
	}, []);

	const handleSkillSelection = (skill) => {
		if (selectedSkills.some((item) => item._id === skill._id)) {
			setSelectedSkills((prev) => prev.filter((s) => s._id !== skill._id));
		} else {
			setSelectedSkills((prev) => [...prev, skill]);
		}
		setOpen(false);
	};

	const removeSkill = (skill) => {
		setSelectedSkills((prev) => prev.filter((s) => s._id !== skill._id));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		console.log(user.firstName ? user.firstName : firstName);

		const userData = {
			firstName: firstName || user.firstName, // Use form state or fallback to user info
			lastName: lastName || user.lastName,
			bio,
			gender,
			skills: selectedSkills.map((skill) => skill._id),
			country,
			city,
			degree,
			institution,
			graduationYear,
			fieldOfStudy,
			linkedinLink,
			websiteLink,
		};

		console.log(userData);

		try {
			setIsSubmitting(true);
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/update-profile`,
				userData,
				{
					headers: {
						Authorization: `Bearer ${token}`, // Include the Authorization header
					},
				}
			);
			if (response.status === 200) {
				console.log("Profile updated successfully");
				// Update userInfo by appending new data
				setUserInfo((prev) => ({
					...prev,
					...userData, // Append the new user data to the existing userInfo
					skills: [...prev.skills, ...userData.skills], // Merge the new skills with existing ones
				}));

				setIsSubmitSuccessful(true);

				// Start countdown
				let count = 3;
				const countdownInterval = setInterval(() => {
					count--;
					setRedirectCountdown(count);
					if (count === 0) {
						clearInterval(countdownInterval);
						router.push("/").then(() => {
							window.location.reload(); // Reload the page after navigation
						});
					}
				}, 1000);
				// Optionally trigger a success toast or redirect
			} else {
				console.error("Failed to update profile");
			}
		} catch (error) {
			console.error("Error while updating profile", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitSuccessful) {
		return (
			<div className='fixed inset-0 flex items-center justify-center bg-sky-100'>
				<div className='text-center p-8 bg-white rounded-lg shadow-xl transform transition-all duration-500 ease-in-out scale-100 opacity-100'>
					<CheckIcon className='w-16 h-16 mx-auto text-sky-500 mb-4' />
					<h2 className='text-2xl font-bold mb-2'>Account Setup Successful!</h2>
					<p className='text-gray-600 mb-4'>
						You will be redirected to the home screen in {redirectCountdown}{" "}
						seconds.
					</p>
					<div className='w-full bg-gray-200 rounded-full h-2.5'>
						<div
							className='bg-sky-600 h-2.5 rounded-full transition-all duration-1000 ease-in-out'
							style={{ width: `${((3 - redirectCountdown) / 3) * 100}%` }}
						></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<ScrollArea className='w-[100vw] h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200'>
			<Card className='max-w-xl h-auto mx-auto my-6'>
				<CardHeader className='border'>
					<CardTitle className='text-3xl font-bold'>User Information</CardTitle>
					<CardDescription>
						Please provide your additional information to complete your profile
						setup.
					</CardDescription>
				</CardHeader>
				<CardContent className='my-2'>
					<form onSubmit={handleSubmit} className='space-y-8'>
						<div className='space-y-4'>
							<h2 className='text-xl font-semibold'>Personal Information</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='firstName'>First Name</Label>

									{user.firstName ? (
										<Input
											id='firstName'
											name='firstName'
											value={user.firstName}
											disabled
										/>
									) : (
										<Input
											id='firstName'
											name='firstName'
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
										/>
									)}
								</div>
								<div className='space-y-2'>
									<Label htmlFor='lastName'>Last Name</Label>
									{user.lastName ? (
										<Input
											id='lastName'
											name='lastName'
											value={user.lastName}
											disabled
										/>
									) : (
										<Input
											id='lastName'
											name='lastName'
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
										/>
									)}
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='bio'>Bio</Label>
								<Textarea
									id='bio'
									name='bio'
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									placeholder='Tell us about yourself...'
									className='min-h-[100px]'
								/>
							</div>
							<div className='space-y-2'>
								<Label>Gender</Label>
								<RadioGroup
									value={gender}
									onValueChange={setGender}
									name='gender'
									className='flex space-x-4'
								>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='Male' id='male' />
										<Label htmlFor='male'>Male</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='Female' id='female' />
										<Label htmlFor='female'>Female</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='Other' id='other' />
										<Label htmlFor='other'>Other</Label>
									</div>
								</RadioGroup>
							</div>
						</div>

						<div className='space-y-4'>
							<h2 className='text-xl font-semibold'>Skills</h2>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										role='combobox'
										aria-expanded={open}
										className='w-full justify-between'
									>
										{selectedSkills.length > 0
											? `${selectedSkills.length} skills selected`
											: "Select skill..."}
										<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-full p-0'>
									<Command>
										<CommandInput
											placeholder='Search skill...'
											className='h-9'
										/>
										<CommandList>
											<CommandEmpty>No skill found.</CommandEmpty>
											<CommandGroup>
												{loading && <div>Loading...</div>}
												{!loading &&
													skills.map((skill) => (
														<CommandItem
															key={skill._id}
															value={skill.name}
															onSelect={() => {
																handleSkillSelection(skill);
																setOpen(false);
															}}
															className={cn(
																selectedSkills.some(
																	(item) => item._id === skill._id
																)
																	? " bg-sky-50"
																	: "bg-white"
															)}
														>
															{skill.name}
															<CheckIcon
																className={cn(
																	"ml-auto h-4 w-4",
																	selectedSkills.some(
																		(item) => item._id === skill._id
																	)
																		? "opacity-100"
																		: "opacity-0"
																)}
															/>
														</CommandItem>
													))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<div className='flex flex-wrap gap-2'>
								{selectedSkills.map((skill, index) => (
									<Badge
										key={index}
										variant='secondary'
										className='text-sm py-1 px-2'
									>
										{skill.name}
										<Button
											variant='ghost'
											size='sm'
											className='ml-2 h-4 w-4 p-0'
											onClick={() => removeSkill(skill)}
										>
											<X className='h-3 w-3' />
										</Button>
									</Badge>
								))}
							</div>
						</div>

						<div className='space-y-4'>
							<h2 className='text-xl font-semibold'>Location</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='country'>Country</Label>
									<Select
										value={country}
										onValueChange={setCountry}
										name='country'
									>
										<SelectTrigger id='country'>
											<SelectValue placeholder='Select country' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='us'>United States</SelectItem>
											<SelectItem value='uk'>United Kingdom</SelectItem>
											<SelectItem value='ca'>Canada</SelectItem>
											<SelectItem value='au'>Australia</SelectItem>
											{/* Add more countries as needed */}
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='city'>City</Label>
									<Input
										id='city'
										name='city'
										value={city}
										onChange={(e) => setCity(e.target.value)}
									/>
								</div>
							</div>
						</div>

						<div className='space-y-4'>
							<h2 className='text-xl font-semibold'>Education</h2>
							<div className='space-y-2'>
								<Label htmlFor='degree'>Highest Degree</Label>
								<Select value={degree} onValueChange={setDegree} name='degree'>
									<SelectTrigger id='degree'>
										<SelectValue placeholder='Select degree' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='highschool'>High School</SelectItem>
										<SelectItem value='bachelor'>Bachelor's</SelectItem>
										<SelectItem value='master'>Master's</SelectItem>
										<SelectItem value='phd'>Ph.D.</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='institution'>Institution</Label>
								<Input
									id='institution'
									name='institution'
									value={institution}
									onChange={(e) => setInstitution(e.target.value)}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='graduationYear'>Graduation Year</Label>
									<Input
										id='graduationYear'
										name='graduationYear'
										type='number'
										min='1900'
										max='2099'
										step='1'
										value={graduationYear}
										onChange={(e) => setGraduationYear(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='fieldOfStudy'>Field of Study</Label>
									<Input
										id='fieldOfStudy'
										name='fieldOfStudy'
										value={fieldOfStudy}
										onChange={(e) => setFieldOfStudy(e.target.value)}
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='linkedinLink'>Linkedin Link</Label>
									<Input
										id='linkedinLink'
										name='linkedinLink'
										type='text'
										value={linkedinLink}
										onChange={(e) => setLinkedinLink(e.target.value)}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='websiteLink'>Website Link</Label>
									<Input
										id='websiteLink'
										name='websiteLink'
										value={websiteLink}
										onChange={(e) => setWebsiteLink(e.target.value)}
									/>
								</div>
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter>
					{isSubmitting ? (
						<Button className='w-full bg-sky-500' disabled>
							<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
							Please wait
						</Button>
					) : (
						<Button
							type='submit'
							onClick={handleSubmit}
							className='bg-sky-500 hover:bg-sky-400 w-full'
						>
							Save Information
						</Button>
					)}
				</CardFooter>
			</Card>
		</ScrollArea>
	);
}
