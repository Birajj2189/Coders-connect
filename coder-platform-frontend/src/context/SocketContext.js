import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const newSocket = io("http://localhost:4000"); // Your server URL
		setSocket(newSocket);

		return () => newSocket.close();
	}, [setSocket]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
