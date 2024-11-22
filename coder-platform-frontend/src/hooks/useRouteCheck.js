// hooks/useRouteCheck.js
import { useRouter } from "next/router";

export function useRouteCheck(substring) {
	const router = useRouter();
	return router.pathname.includes(substring);
}
