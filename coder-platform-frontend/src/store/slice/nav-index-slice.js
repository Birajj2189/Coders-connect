export const createNavIndexSlice = (set) => ({
	index: 0,
	setNavIndex: (index) => {
		set({ index });
	},
});
