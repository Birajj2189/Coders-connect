import "@/styles/globals.css";
import { Toaster } from "sonner";
import { useAppStore } from "@/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogAction,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangleIcon } from "lucide-react";
import axios from "axios";
import MultiStepLoaderDemo from "@/components/ui/multi-loader";

export default function App({ Component, pageProps }) {
	const { userInfo, setUserInfo } = useAppStore();
	const isAuthenticated = !!userInfo; // Get auth status from Zustand
	const router = useRouter();
	const [loading, setLoading] = useState(true); // Use only one loading state
	const [showAlert, setShowAlert] = useState(false);

	useEffect(() => {
		const checkAuthentication = async () => {
			const token = sessionStorage.getItem("token");
			console.log(token);
			if (!token) {
				// If there's no token and the user is not authenticated, show the alert
				if (!isAuthenticated && router.pathname !== "/auth") {
					setShowAlert(true);
				}
				setTimeout(() => {
					setLoading(false); // Set loading to false after a delay
				}, 6000); // Example delay of 6 seconds
				return;
			} else {
				if (!isAuthenticated && router.pathname !== "/auth") {
					// If userInfo is missing but token is present, attempt to fetch userInfo
					try {
						const response = await axios.get(
							`${process.env.NEXT_PUBLIC_API_URL}/api/users/my-profile`,
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						);

						setUserInfo(response.data); // Update Zustand store directly with fetched data
						setShowAlert(false); // Close alert if data fetched successfully
					} catch (error) {
						console.error("Failed to fetch user info:", error);
						setShowAlert(true); // Show alert if fetching user info fails
					}
				}
			}

			setTimeout(() => {
				setLoading(false); // Set loading to false after a delay
			}, 6000); // Delay for 6 seconds
		};

		// Only check authentication if not on the /auth page
		if (router.pathname !== "/auth") {
			checkAuthentication();
		} else {
			setLoading(false); // Skip loading when on the auth page
		}
	}, [isAuthenticated, router.pathname, userInfo]);

	const handleRedirectToAuth = () => {
		setShowAlert(false); // Close the alert
		router.push("/auth"); // Redirect to auth page
	};

	const loadingStates = [
		{ text: "Refreshing...debugging the life!" },
		{ text: "Loading...code magic in progress" },
		{ text: "Fetching fresh code vibes" },
		{ text: "Syncing..hold tight coder!" },
		{ text: "Almost there..compiling awesomeness!" },
		{ text: "Boom! You're refreshed!" },
	];

	if (loading) {
		return (
			<MultiStepLoaderDemo loading={loading} loadingStates={loadingStates} />
		);
	}

	return (
		<div className='h-full w-full'>
			<Component {...pageProps} />
			<Toaster duration={2000} theme='dark' reverseOrder position='top-right' />

			{/* Show alert dialog if user is not authenticated */}
			{showAlert && (
				<AlertDialog open={true}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertTriangleIcon className='text-red-500 h-20 w-20 animate-shake mx-auto' />
							<AlertDialogTitle className='text-xl text-center font-bold'>
								Uh-oh! <br />
								🚨Login Alert!🚨
							</AlertDialogTitle>
							<AlertDialogDescription className='text-center'>
								Hold up, adventurer! You’ve entered the secret vault of the
								platform, but your login credentials didn’t make it through
								customs. No worries, we’ll get you sorted! Just login and you’ll
								be back to unlocking the good stuff in no time.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter className='flex items-center'>
							<AlertDialogAction
								onClick={handleRedirectToAuth}
								className='mx-auto'
								variant='outline'
							>
								Go to Login
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
