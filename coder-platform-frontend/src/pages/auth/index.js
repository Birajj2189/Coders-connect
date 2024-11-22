import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { IconBrandGoogle, IconBrandGit } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Adjust the import path as needed
import { useAppStore } from "@/store";
import axios from "axios";

// Your custom TabsTrigger component
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50",
			className
		)}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export default function TabsDemo() {
	const [activeTab, setActiveTab] = useState("account"); // State to control the active tab
	const router = useRouter(); // Initialize useRouter
	const [alert, setAlert] = useState(null);

	// Login states
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Registrations states
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	// Zustand setup
	const { setUserInfo, userInfo } = useAppStore();

	const validateLogin = () => {
		if (!email.length) {
			toast(
				<div className='flex items-center justify-center'>
					<ExclamationTriangleIcon className='mx-2 mt-1 animate-shake' />
					<div className='text-blue-50 text-md'>
						Email is required for login
					</div>
				</div>
			);
			return false;
		}
		if (!password.length) {
			toast(
				<div className='flex items-center justify-center'>
					<ExclamationTriangleIcon className='mx-2 mt-1 animate-shake' />
					<div className='text-blue-50 text-md'>
						Password is required for login
					</div>
				</div>
			);
			return false;
		}
		return true;
	};

	const validateSignup = () => {
		if (!firstName.length) {
			toast(
				<div className='flex items-center justify-center'>
					<ExclamationTriangleIcon className='mx-2 mt-1 animate-shake' />
					<div className='text-blue-50 text-md'>
						First Name is required for Singup
					</div>
				</div>
			);
			return false;
		}
		if (!lastName.length) {
			toast(
				<div className='flex items-center justify-center'>
					<ExclamationTriangleIcon className='mx-2 mt-1 animate-shake' />
					<div className='text-blue-50 text-md'>
						Last Name is required for Signup
					</div>
				</div>
			);
			return false;
		}
		if (!email.length) {
			toast(
				<div className='flex items-center justify-center'>
					<ExclamationTriangleIcon className='mx-2 mt-1 animate-shake' />
					<div className='text-blue-50 text-md'>
						Email is required for Signup
					</div>
				</div>
			);
			return false;
		}
		if (!password.length) {
			toast(
				<div className='flex items-center justify-center'>
					<ExclamationTriangleIcon className='mx-2 mt-1 animate-shake' />
					<div className='text-blue-50 text-md'>
						Password is required for Signup
					</div>
				</div>
			);
			return false;
		}
		return true;
	};

	const handleLogin = async () => {
		if (validateLogin()) {
			console.log("validated input");
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password }),
					}
				);

				const data = await response.json();

				if (response.ok) {
					setAlert({
						variant: "default",
						title: "Success",
						description: "Logged in successfully",
					});
					// Handle successful login

					console.log("Login successful", data);
					// Store the token in sessionStorage
					sessionStorage.setItem("token", data.token); // Assuming the token is in data.token
					console.log("token", data.token);
					setUserInfo(data.user);
					// Check user details for redirect
					if (
						!data.user.firstName ||
						!data.user.lastName ||
						!data.user.bio ||
						!data.user.skills
					) {
						router.push("/more-info");
					} else {
						router.push("/");
					}
				} else {
					// Handle error from server
					setError(data.message || "Login failed");
					toast(
						<div className='flex items-center justify-center'>
							<ExclamationTriangleIcon className='mx-2 mt-1 animate-shake' />
							<div className='text-blue-50 text-md'>
								An error occurred. Please try again.
							</div>
						</div>
					);
				}
			} catch (err) {
				// Handle network or other errors
				setError("An error occurred. Please try again.");
			} finally {
				setLoading(false);
			}
		}
	};

	const handleSignup = async (event) => {
		if (validateSignup()) {
			console.log("validated input");
			event.preventDefault();
			const userData = { firstName, lastName, email, password };
			console.log("User data being sent:", userData); // Debugging
			setError(null);
			try {
				setLoading(true);
				const response = await axios.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
					userData
				);

				const data = response.data;

				if (response.status === 200 || response.status === 201) {
					setAlert({
						variant: "default",
						title: "Success",
						description: "Created a new account successfully",
					});
					console.log("Signup successful", data);

					sessionStorage.setItem("token", data.token);

					setActiveTab("account");
				} else {
					setError(data.message || "Signup failed");
					console.log("Server error details:", data); // Log server error details
				}
			} catch (err) {
				if (err.response) {
					console.log("Error details from server:", err.response.data); // Log detailed error
					setError(err.response.data.message || "An error occurred.");
				} else {
					setError("An error occurred. Please try again.");
					console.error("Network or other error:", err);
				}
			} finally {
				setLoading(false);
			}
		}
	};

	const handleGoogleSignup = () => {
		router.push("http://localhost:4000/api/auth/google"); // Replace with your Google signup route
	};

	const handleGithubSignup = () => {
		router.push("http://localhost:4000/api/auth/github"); // Replace with your GitHub signup route
	};

	return (
		<div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200'>
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-[400px] h-auto'
			>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='account' onClick={() => setActiveTab("account")}>
						Login
					</TabsTrigger>
					<TabsTrigger
						value='password'
						onClick={() => setActiveTab("password")}
					>
						Signup
					</TabsTrigger>
				</TabsList>
				<TabsContent value='account'>
					<Card>
						<CardHeader>
							<CardTitle className='text-xl font-bold'>Login</CardTitle>
							<CardDescription>
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div className='space-y-1'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									placeholder='test@mail.com'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className='space-y-1'>
								<Label htmlFor='password'>Password</Label>
								<Input
									id='password'
									type='password'
									placeholder='*********'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<small className='text-sm font-medium leading-none text-gray-800 hover:text-gray-600 underline'>
									<Link href='/'>Forgot password?</Link>
								</small>
							</div>
						</CardContent>
						<CardFooter className='flex-col'>
							{loading ? (
								<Button className='w-full bg-sky-500' disabled>
									<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
									Please wait
								</Button>
							) : (
								<Button
									className='mx-auto w-full bg-sky-500 hover:bg-sky-400'
									onClick={() => handleLogin()}
								>
									Login
								</Button>
							)}
							<Separator className='my-2' />
							<Button
								variant='outline'
								className='w-full flex items-center justify-center gap-2 my-1'
								onClick={() => handleGoogleSignup()}
							>
								<IconBrandGoogle className='h-5 w-5' />
								<span className='sr-only sm:not-sr-only'>
									Login with Google
								</span>
							</Button>
							<Button
								variant='outline'
								className='w-full flex items-center justify-center gap-2 my-1'
								onClick={() => handleGithubSignup()}
							>
								<IconBrandGit className='h-5 w-5' />
								<span className='sr-only sm:not-sr-only'>
									Login with GitHub
								</span>
							</Button>
							<div className='mt-4 text-center text-sm'>
								Don&apos;t have an account?{" "}
								<Button
									onClick={() => setActiveTab("password")}
									className='underline bg-transparent shadow-none text-sky-500 p-0 hover:bg-transparent hover:text-sky-400'
								>
									Sign up
								</Button>
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value='password'>
					<Card>
						<CardHeader>
							<CardTitle className='text-xl font-bold'>Signup</CardTitle>
							<CardDescription>
								Create your account by filling in the details below
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='grid gap-2'>
										<Label htmlFor='first-name'>First name</Label>
										<Input
											id='first-name'
											placeholder='Max'
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
										/>
									</div>
									<div className='grid gap-2'>
										<Label htmlFor='last-name'>Last name</Label>
										<Input
											id='last-name'
											placeholder='Robinson'
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
										/>
									</div>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										placeholder='m@example.com'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='password'>Password</Label>
									<Input
										id='password'
										type='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter className='flex-col'>
							{loading ? (
								<Button className='w-full ' disabled>
									<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
									Please wait
								</Button>
							) : (
								<Button
									className='mx-auto w-full bg-sky-500 hover:bg-sky-400'
									onClick={handleSignup}
								>
									Create a new account
								</Button>
							)}

							<Separator className='my-2' />
							<Button
								variant='outline'
								className='w-full flex items-center justify-center gap-2 my-1'
								onClick={() => handleGoogleSignup()}
							>
								<IconBrandGoogle className='h-5 w-5' />
								<span className='sr-only sm:not-sr-only'>
									Signup with Google
								</span>
							</Button>
							<Button
								variant='outline'
								className='w-full flex items-center justify-center gap-2 my-1'
								onClick={() => handleGithubSignup()}
							>
								<IconBrandGit className='h-5 w-5' />
								<span className='sr-only sm:not-sr-only'>
									Singup with GitHub
								</span>
							</Button>
							<div className='mt-4 text-center text-sm'>
								Already have an account?{" "}
								<Button
									onClick={() => setActiveTab("account")}
									className='underline bg-transparent shadow-none text-sky-500 p-0 hover:bg-transparent hover:text-sky-400'
								>
									Login
								</Button>
							</div>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
			{alert && (
				<Alert variant={alert.variant} onClose={() => setAlert(null)}>
					<AlertTitle>{alert.title}</AlertTitle>
					<AlertDescription>{alert.description}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
