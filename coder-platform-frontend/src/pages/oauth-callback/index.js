import { useEffect } from "react";
import { useRouter } from "next/router";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { useAppStore } from "@/store";

const OAuthCallback = () => {
	const router = useRouter();
	const { token } = router.query; // Get the token from the URL

	const userInfo = useAppStore();

	useEffect(() => {
		if (token) {
			sessionStorage.setItem("token", token); // Store the token in sessionStorage
		}
		if (userInfo && !userInfo.isPassword) {
			router.push("/set-password"); // Redirect to the homepage or dashboard
		} else {
			router.push("/"); // Redirect to the homepage or dashboard
		}
	}, [token, router]);

	const loadingStates = [
		{ text: "Logging in...debugging the life!" },
		{ text: "Loading...code magic in progress" },
		{ text: "Fetching fresh code vibes" },
		{ text: "Syncing..hold tight coder!" },
		{ text: "Almost there..compiling awesomeness!" },
		{ text: "Boom! You're logged in!" },
	];

	return (
		<div className='h-[100vh] w-[100vw] text-blue-50 font-semibold text-4xl'>
			<MultiStepLoader loadingStates={loadingStates} />
		</div>
	);
};

export default OAuthCallback;
