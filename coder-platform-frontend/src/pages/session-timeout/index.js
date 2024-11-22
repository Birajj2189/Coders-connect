"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { ArrowRight, LogOut, Clock, Lock } from "lucide-react";

const useCountdown = (initialCount) => {
	const [count, setCount] = useState(initialCount);

	useEffect(() => {
		if (count > 0) {
			const timer = setTimeout(() => setCount(count - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [count]);

	return count;
};

const useTheme = () => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
	}, [isDark]);

	return [isDark, setIsDark];
};

const AnimatedIcon = ({ icon: Icon, delay = 0 }) => (
	<motion.div
		initial={{ scale: 0, rotate: -180 }}
		animate={{ scale: 1, rotate: 0 }}
		transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
	>
		<Icon className='w-12 h-12' />
	</motion.div>
);

export default function AdvancedSessionEnd() {
	const router = useRouter();
	const countdown = useCountdown(10);
	const [isDark, setIsDark] = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		if (countdown === 0) {
			handleRedirect();
		}
	}, [countdown]);

	const handleRedirect = () => {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
		});
		setTimeout(() => router.push("/auth"), 1500);
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
				isDark ? "bg-gray-900" : "bg-gray-100"
			}`}
		>
			<Card
				className={`w-full max-w-4xl overflow-hidden ${
					isDark ? "bg-gray-800 text-white" : "bg-white"
				}`}
			>
				<div className='flex flex-col md:flex-row'>
					<div className='md:w-1/2 p-6 flex flex-col justify-between'>
						<div>
							<CardHeader>
								<CardTitle className='text-3xl font-bold'>
									Session Ended
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p
									className={`${
										isDark ? "text-gray-300" : "text-gray-600"
									} mb-4`}
								>
									Your session has expired. Please log in again to continue.
								</p>
								<AnimatePresence>
									{isExpanded && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
								    			exit={{ opacity: 0, height: 0 }}
											className={`text-sm ${
												isDark ? "text-gray-400" : "text-gray-500"
											} mt-2`}
										>
											<p>
												Your session may have ended due to inactivity or for
												security reasons. If you continue to experience issues,
												please contact our support team.
											</p>
										</motion.div>
									)}
								</AnimatePresence>
								<Button
									variant='link'
									onClick={() => setIsExpanded(!isExpanded)}
									className={`mt-2 ${
										isDark ? "text-blue-400" : "text-blue-600"
									} p-0`}
								>
									{isExpanded ? "Show Less" : "Learn More"}
								</Button>
							</CardContent>
						</div>
						<CardFooter className='flex justify-between items-center mt-4'>
							<Button
								onClick={handleRedirect}
								className='flex items-center space-x-2'
							>
								<span>Go to Login</span>
								<ArrowRight className='h-4 w-4' />
							</Button>
						</CardFooter>
					</div>
					<div
						className={`md:w-1/2 ${
							isDark ? "bg-gray-700" : "bg-gray-100"
						} p-6 flex flex-col items-center justify-center`}
					>
						<div className='flex justify-center space-x-4 mb-6'>
							<AnimatedIcon icon={LogOut} delay={0.2} />
							<AnimatedIcon icon={Clock} delay={0.4} />
							<AnimatedIcon icon={Lock} delay={0.6} />
						</div>
						<div className='text-center'>
							<motion.div
								key={countdown}
								initial={{ scale: 1.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.5, opacity: 0 }}
								transition={{ duration: 0.5 }}
								className={`text-6xl font-bold mb-4 ${
									isDark ? "text-blue-400" : "text-blue-600"
								}`}
							>
								{countdown}
							</motion.div>
							<p
								className={`text-xl ${
									isDark ? "text-gray-300" : "text-gray-600"
								}`}
							>
								Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
							</p>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
