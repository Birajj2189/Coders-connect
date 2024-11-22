import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import MultiStepLoaderDemo from "../ui/multi-loader";
import {
	ChevronLeft,
	ChevronRight,
	Copy,
	CreditCard,
	File,
	Home,
	LineChart,
	ListFilter,
	MoreVertical,
	Package,
	Package2,
	PanelLeft,
	Search,
	Settings,
	ShoppingCart,
	Trash2Icon,
	Truck,
	Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Camera, Pencil } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

export const description =
	"An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export default function Dashboard() {
	const { userInfo, setUserInfo } = useAppStore();
	const user = userInfo;
	const profileImageInput = useRef(null);
	const coverImageInput = useRef(null);
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);

	const defaultName = "John Doe";
	const defaultTitle = "Software Developer";
	const defaultProfileImage = "/default-avatar.png";
	const defaultBio =
		"Passionate about creating innovative solutions and pushing the boundaries of technology.";

	const [profileImage, setProfileImage] = useState(user?.profilePicture);
	console.log("pp", profileImage);
	const [coverImage, setCoverImage] = useState(user?.coverPicture);

	const [name, setName] = useState(user?.name || defaultName);
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	const [title, setTitle] = useState(user?.title || defaultTitle);
	const [bio, setBio] = useState(user?.bio || defaultBio);
	const [isUploading, setIsUploading] = useState(false);

	const capitalizeFirstLetter = (string) => {
		if (string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		} else {
			return null;
		}
	};

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

	const handleProfilePictureInputClick = () => {
		profileImageInput.current.click();
	};

	const handleCoverPictureInputClick = () => {
		coverImageInput.current.click();
	};

	const handleEditCoverImage = async (e) => {
		e.preventDefault();
		if (!coverImageInput.current.files.length) return;

		setLoading(true);
		const file = coverImageInput.current.files[0];
		const formData = new FormData();
		formData.append("coverPicture", file);

		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/update/cover-picture`, // Correct endpoint
				formData, // Send the formData directly
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				const result = response.data;
				// Update cover image URL
				setCoverImage(result.coverPicture);
				setUserInfo((prev) => ({
					...prev,
					coverPicture: [...prev.coverPicture, result.coverPicture],
				}));
			} else {
				console.error("Failed to upload cover image");
			}
		} catch (error) {
			console.error(
				"An error occurred while uploading the cover image:",
				response.statusText
			);
		} finally {
			setLoading(false);
		}
	};

	const handleEditProfileImage = async (e) => {
		e.preventDefault();
		if (!profileImageInput.current.files.length) {
			console.log("No file selected for upload.");
			return;
		}

		setLoading(true);
		const file = profileImageInput.current.files[0];
		const formData = new FormData();
		formData.append("profilePicture", file);

		try {
			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/update/profile-picture`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
					timeout: 6000,
				}
			);

			if (response.status === 200) {
				const result = response.data;
				setProfileImage(result.profilePicture); // Update profile image URL
				setUserInfo((prev) => ({
					...prev,
					profilePicture: [...prev.profilePicture, result.profilePicture],
				}));
			} else {
				console.error("Failed to upload profile image:", response.statusText);
			}
		} catch (error) {
			console.error(
				"An error occurred while uploading the profile image:",
				error
			);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveProfilePicture = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/delete/profile-picture`, // Use correct endpoint for profile picture
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				toast("Profile Picture removed successfully");
				const result = response.data;
				setProfileImage(null); // Update profile image URL
				setUserInfo((prev) => ({
					...prev,
					profilePicture: [...prev.profilePicture, null],
				}));
			} else {
				console.error("Failed to delete profile image");
			}
		} catch (error) {
			console.error(
				"An error occurred while deleting the profile image:",
				error
			);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveCoverPicture = async () => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/delete/cover-picture`, // Use correct endpoint for profile picture
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				toast("Cover Picture removed successfully");
				const result = response.data;
				setCoverImage(null); // Update profile image URL
				setUserInfo((prev) => ({
					...prev,
					coverPicture: [...prev.coverPicture, null],
				}));
			} else {
				console.error("Failed to delete cover image");
			}
		} catch (error) {
			console.error(
				"An error occurred while deleting the profile image:",
				error
			);
		} finally {
			setLoading(false);
		}
	};
	const loadingStates = [
		{ text: "Refreshing...debugging the life!" },
		{ text: "Loading...code magic in progress" },
		{ text: "Fetching fresh code vibes" },
		{ text: "Syncing..hold tight coder!" },
		{ text: "Almost there..compiling awesomeness!" },
		{ text: "Boom! You're refreshed!" },
	];

	// if (loading) {
	// 	return (
	// 		<MultiStepLoaderDemo loading={loading} loadingStates={loadingStates} />
	// 	);
	// }
	return (
		<div className='flex flex-col w-full h-auto'>
			<div className='grid flex-1 items-start gap-4 md:gap-8 xl:grid-cols-3 overflow-x-hidden overflow-y-scroll pt-4 px-4'>
				<div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
					<div className='grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'>
						<Card className='w-full max-w-3xl mx-auto overflow-hidden col-span-2'>
							<div className='relative h-48 sm:h-64'>
								{coverImage ? (
									<Image
										src={`http://localhost:4000/${coverImage}`}
										alt='Cover'
										className='w-full h-full object-cover bg-cover bg-center'
										width={100}
										height={50}
									/>
								) : (
									<div className='w-full h-full bg-gradient-to-r from-blue-400 to-blue-600' />
								)}
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											{!coverImage ? (
												<Button
													size='icon'
													variant='secondary'
													className='absolute top-4 right-4 rounded-full'
													aria-label='Edit cover image'
													onClick={handleCoverPictureInputClick}
												>
													<Camera className='h-4 w-4' />
												</Button>
											) : (
												<Button
													size='icon'
													variant='secondary'
													className='absolute top-4 right-4 rounded-full'
													aria-label='Edit cover image'
													onClick={handleRemoveCoverPicture}
												>
													<Trash2Icon className='h-4 w-4' />
												</Button>
											)}
										</TooltipTrigger>
										<TooltipContent side='top'>Edit cover image</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<Input
									id='coverPicture'
									type='file'
									ref={coverImageInput}
									onChange={handleEditCoverImage}
									className='hidden'
								/>
							</div>
							<CardContent className='relative px-4 pb-4 -mt-16 sm:-mt-24'>
								<div className='flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4'>
									<div className='relative'>
										<Avatar className='w-32 h-32 border-4 border-background'>
											{profileImage ? (
												<Image
													src={`http://localhost:4000/${profileImage}`}
													alt={name}
													width={50}
													height={50}
													className=' bg-cover bg-center h-full w-full'
												/>
											) : (
												<AvatarImage
													src={defaultProfileImage}
													alt={name}
													className='bg-cover scale-125'
												/>
											)}
										</Avatar>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													{!profileImage ? (
														<Button
															size='icon'
															variant='secondary'
															className='absolute bottom-0 right-0 rounded-full'
															aria-label='Edit profile image'
															onClick={handleProfilePictureInputClick}
														>
															<Pencil className='h-4 w-4' />
														</Button>
													) : (
														<Button
															size='icon'
															variant='secondary'
															className='absolute bottom-0 right-0 rounded-full'
															aria-label='Edit profile image'
															onClick={handleRemoveProfilePicture}
														>
															<Trash2Icon className='h-4 w-4' />
														</Button>
													)}
												</TooltipTrigger>
												<TooltipContent>Edit profile image</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<Input
											id='profilePicture'
											type='file'
											ref={profileImageInput}
											onChange={handleEditProfileImage}
											className='hidden'
										/>
									</div>
								</div>
								<div className='text-center sm:text-left flex-1'>
									<h1 className='text-2xl font-bold'>
										{capitalizeFirstLetter(user?.firstName) &&
										capitalizeFirstLetter(user?.lastName)
											? capitalizeFirstLetter(user?.firstName) +
											  " " +
											  capitalizeFirstLetter(user?.lastName)
											: name}
									</h1>
									<p className='text-muted-foreground'>{title}</p>
									<p className='mt-2 text-sm text-muted-foreground'>{bio}</p>
								</div>
							</CardContent>
						</Card>
						<Card x-chunk='dashboard-05-chunk-1'>
							<CardHeader className='pb-2'>
								<CardDescription>This Week</CardDescription>
								<CardTitle className='text-4xl'>$1,329</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-xs text-muted-foreground'>
									+25% from last week
								</div>
							</CardContent>
							<CardFooter>
								<Progress value={25} aria-label='25% increase' />
							</CardFooter>
						</Card>
						<Card x-chunk='dashboard-05-chunk-2'>
							<CardHeader className='pb-2'>
								<CardDescription>This Month</CardDescription>
								<CardTitle className='text-4xl'>$5,329</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-xs text-muted-foreground'>
									+10% from last month
								</div>
							</CardContent>
							<CardFooter>
								<Progress value={12} aria-label='12% increase' />
							</CardFooter>
						</Card>
					</div>
					<div>
						<Card className='' x-chunk='dashboard-05-chunk-4'>
							<CardHeader className='flex flex-row items-start bg-muted/50'>
								<div className='grid gap-0.5'>
									<CardTitle className='group flex items-center gap-2 text-lg'>
										Order Oe31b70H
										<Button
											size='icon'
											variant='outline'
											className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
										>
											<Copy className='h-3 w-3' />
											<span className='sr-only'>Copy Order ID</span>
										</Button>
									</CardTitle>
									<CardDescription>Date: November 23, 2023</CardDescription>
								</div>
								<div className='ml-auto flex items-center gap-1'>
									<Button size='sm' variant='outline' className='h-8 gap-1'>
										<Truck className='h-3.5 w-3.5' />
										<span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
											Track Order
										</span>
									</Button>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size='icon' variant='outline' className='h-8 w-8'>
												<MoreVertical className='h-3.5 w-3.5' />
												<span className='sr-only'>More</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuItem>Edit</DropdownMenuItem>
											<DropdownMenuItem>Export</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem>Trash</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>
							<CardContent className='p-6 text-sm'>
								<div className='grid gap-3'>
									<div className='font-semibold'>Order Details</div>
									<ul className='grid gap-3'>
										<li className='flex items-center justify-between'>
											<span className='text-muted-foreground'>
												Glimmer Lamps x <span>2</span>
											</span>
											<span>$250.00</span>
										</li>
										<li className='flex items-center justify-between'>
											<span className='text-muted-foreground'>
												Aqua Filters x <span>1</span>
											</span>
											<span>$49.00</span>
										</li>
									</ul>
									<Separator className='my-2' />
									<ul className='grid gap-3'>
										<li className='flex items-center justify-between'>
											<span className='text-muted-foreground'>Subtotal</span>
											<span>$299.00</span>
										</li>
										<li className='flex items-center justify-between'>
											<span className='text-muted-foreground'>Shipping</span>
											<span>$5.00</span>
										</li>
										<li className='flex items-center justify-between'>
											<span className='text-muted-foreground'>Tax</span>
											<span>$25.00</span>
										</li>
										<li className='flex items-center justify-between font-semibold'>
											<span className='text-muted-foreground'>Total</span>
											<span>$329.00</span>
										</li>
									</ul>
								</div>
								<Separator className='my-4' />
								<div className='grid grid-cols-2 gap-4'>
									<div className='grid gap-3'>
										<div className='font-semibold'>Shipping Information</div>
										<address className='grid gap-0.5 not-italic text-muted-foreground'>
											<span>Liam Johnson</span>
											<span>1234 Main St.</span>
											<span>Anytown, CA 12345</span>
										</address>
									</div>
									<div className='grid auto-rows-max gap-3'>
										<div className='font-semibold'>Billing Information</div>
										<div className='text-muted-foreground'>
											Same as shipping address
										</div>
									</div>
								</div>
								<Separator className='my-4' />
								<div className='grid gap-3'>
									<div className='font-semibold'>Customer Information</div>
									<dl className='grid gap-3'>
										<div className='flex items-center justify-between'>
											<dt className='text-muted-foreground'>Customer</dt>
											<dd>Liam Johnson</dd>
										</div>
										<div className='flex items-center justify-between'>
											<dt className='text-muted-foreground'>Email</dt>
											<dd>
												<a href='mailto:'>liam@acme.com</a>
											</dd>
										</div>
										<div className='flex items-center justify-between'>
											<dt className='text-muted-foreground'>Phone</dt>
											<dd>
												<a href='tel:'>+1 234 567 890</a>
											</dd>
										</div>
									</dl>
								</div>
								<Separator className='my-4' />
								<div className='grid gap-3'>
									<div className='font-semibold'>Payment Information</div>
									<dl className='grid gap-3'>
										<div className='flex items-center justify-between'>
											<dt className='flex items-center gap-1 text-muted-foreground'>
												<CreditCard className='h-4 w-4' />
												Visa
											</dt>
											<dd>**** **** **** 4532</dd>
										</div>
									</dl>
								</div>
							</CardContent>
							<CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
								<div className='text-xs text-muted-foreground'>
									Updated <time dateTime='2023-11-23'>November 23, 2023</time>
								</div>
								<Pagination className='ml-auto mr-0 w-auto'>
									<PaginationContent>
										<PaginationItem>
											<Button size='icon' variant='outline' className='h-6 w-6'>
												<ChevronLeft className='h-3.5 w-3.5' />
												<span className='sr-only'>Previous Order</span>
											</Button>
										</PaginationItem>
										<PaginationItem>
											<Button size='icon' variant='outline' className='h-6 w-6'>
												<ChevronRight className='h-3.5 w-3.5' />
												<span className='sr-only'>Next Order</span>
											</Button>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</CardFooter>
						</Card>
					</div>
					<Tabs defaultValue='week'>
						<div className='flex items-center'>
							<TabsList>
								<TabsTrigger value='week'>Week</TabsTrigger>
								<TabsTrigger value='month'>Month</TabsTrigger>
								<TabsTrigger value='year'>Year</TabsTrigger>
							</TabsList>
							<div className='ml-auto flex items-center gap-2'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											className='h-7 gap-1 text-sm'
										>
											<ListFilter className='h-3.5 w-3.5' />
											<span className='sr-only sm:not-sr-only'>Filter</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>Filter by</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem checked>
											Fulfilled
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>
											Declined
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>
											Refunded
										</DropdownMenuCheckboxItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Button
									size='sm'
									variant='outline'
									className='h-7 gap-1 text-sm'
								>
									<File className='h-3.5 w-3.5' />
									<span className='sr-only sm:not-sr-only'>Export</span>
								</Button>
							</div>
						</div>
						<TabsContent value='week'>
							<Card x-chunk='dashboard-05-chunk-3'>
								<CardHeader className='px-7'>
									<CardTitle>Orders</CardTitle>
									<CardDescription>
										Recent orders from your store.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Customer</TableHead>
												<TableHead className='hidden sm:table-cell'>
													Type
												</TableHead>
												<TableHead className='hidden sm:table-cell'>
													Status
												</TableHead>
												<TableHead className='hidden md:table-cell'>
													Date
												</TableHead>
												<TableHead className='text-right'>Amount</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow className='bg-accent'>
												<TableCell>
													<div className='font-medium'>Liam Johnson</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														liam@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Sale
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='secondary'>
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-23
												</TableCell>
												<TableCell className='text-right'>$250.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className='font-medium'>Olivia Smith</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														olivia@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Refund
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='outline'>
														Declined
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-24
												</TableCell>
												<TableCell className='text-right'>$150.00</TableCell>
											</TableRow>
											{/* <TableRow>
												<TableCell>
													<div className='font-medium'>Liam Johnson</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														liam@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Sale
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='secondary'>
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-23
												</TableCell>
												<TableCell className='text-right'>$250.00</TableCell>
											</TableRow> */}
											<TableRow>
												<TableCell>
													<div className='font-medium'>Noah Williams</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														noah@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Subscription
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='secondary'>
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-25
												</TableCell>
												<TableCell className='text-right'>$350.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className='font-medium'>Emma Brown</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														emma@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Sale
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='secondary'>
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-26
												</TableCell>
												<TableCell className='text-right'>$450.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className='font-medium'>Liam Johnson</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														liam@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Sale
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='secondary'>
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-23
												</TableCell>
												<TableCell className='text-right'>$250.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className='font-medium'>Olivia Smith</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														olivia@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Refund
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='outline'>
														Declined
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-24
												</TableCell>
												<TableCell className='text-right'>$150.00</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<div className='font-medium'>Emma Brown</div>
													<div className='hidden text-sm text-muted-foreground md:inline'>
														emma@example.com
													</div>
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													Sale
												</TableCell>
												<TableCell className='hidden sm:table-cell'>
													<Badge className='text-xs' variant='secondary'>
														Fulfilled
													</Badge>
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-06-26
												</TableCell>
												<TableCell className='text-right'>$450.00</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
