// context/SidebarContext.js
import { createContext, useState, useContext } from "react";

// Create context
const SidebarContext = createContext();

// Sidebar Provider
export const SidebarProvider = ({ children }) => {
	const [activeLink, setActiveLink] = useState(0);
	const [notificationUnseenCount, setNotificationUnseenCount] = useState(0);

	return (
		<SidebarContext.Provider
			value={{
				activeLink,
				setActiveLink,
				notificationUnseenCount,
				setNotificationUnseenCount,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};

// Hook to use the Sidebar context
export const useSidebar = () => useContext(SidebarContext);
