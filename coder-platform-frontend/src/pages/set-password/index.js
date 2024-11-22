"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store";
import { useRouter } from "next/router";

export default function PasswordCard() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(false);

	const userInfo = useAppStore();
	const user = userInfo.userInfo;
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

	const calculatePasswordStrength = (password) => {
		let strength = 0;
		if (password.length >= 8) strength += 25;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
		if (password.match(/\d/)) strength += 25;
		if (password.match(/[^a-zA-Z\d]/)) strength += 25;
		return strength;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		setIsSubmitting(true);

		try {
			// Mock API call using Axios
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/set-password`,
				{
					password: password,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Include the Authorization header
					},
				}
			);
			console.log("Password set successfully");
			console.log("Redirecting....");
			// Check user's information and redirect
			const incompleteInfo =
				!user.firstName || !user.lastName || !user.bio || !user.skills;
			const redirectPath = incompleteInfo ? "/more-info" : "/";
			router.push(redirectPath);
		} catch (err) {
			setError("An error occurred while setting the password.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const passwordStrength = calculatePasswordStrength(password);

	return (
		<div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200'>
			<Card className='w-[350px] mx-auto my-auto'>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>Set Password</CardTitle>
					<CardDescription>
						Choose a strong password to secure your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className='grid w-full items-center gap-4'>
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='password'>Password</Label>
								<div className='relative'>
									<Input
										id='password'
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder='Enter your password'
									/>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
										<span className='sr-only'>
											{showPassword ? "Hide password" : "Show password"}
										</span>
									</Button>
								</div>
							</div>
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='confirm-password'>Confirm Password</Label>
								<Input
									id='confirm-password'
									type='password'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder='Confirm your password'
								/>
							</div>
							<div className='space-y-2'>
								<Label>Password Strength</Label>
								<Progress value={passwordStrength} className='w-full' />
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className='flex flex-col items-start'>
					{error && <p className='text-sm text-red-500 mb-2'>{error}</p>}
					{isSubmitting ? (
						<Button className='w-full bg-sky-500' disabled>
							<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
							Please wait
						</Button>
					) : (
						<Button
							className='mx-auto w-full bg-sky-500 hover:bg-sky-400'
							onClick={handleSubmit}
						>
							Set Password
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
