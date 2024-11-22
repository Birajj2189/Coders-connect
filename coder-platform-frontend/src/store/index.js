import { create } from "zustand";
import { createAuthSlice } from "@/store/slice/auth-slice"; // Adjust path as necessary
// import { createNavIndexSlice } from "./slice/nav-index-slice";

export const useAppStore = create((set) => {
	const authSlice = createAuthSlice(set);
	// const navIndexSlice = createNavIndexSlice(set);

	return authSlice;
});
