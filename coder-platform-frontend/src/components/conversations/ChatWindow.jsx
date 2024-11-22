import { useState } from "react";
import {
	Input,
	Button,
	ScrollArea,
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@shadcn/ui";
import { Send, Menu } from "lucide-react";

const mockFriends = [
	{
		id: "1",
		name: "Alice Johnson",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "online",
	},
	{
		id: "2",
		name: "Bob Smith",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "offline",
	},
	{
		id: "3",
		name: "Charlie Brown",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "online",
	},
	// Add more mock friends as needed
];

const mockMessages = [
	{
		id: "1",
		senderId: "1",
		text: "Hey there!",
		timestamp: "2024-09-08T10:00:00Z",
	},
	{
		id: "2",
		senderId: "me",
		text: "Hi Alice! How are you?",
		timestamp: "2024-09-08T10:01:00Z",
	},
	{
		id: "3",
		senderId: "1",
		text: "I'm doing great, thanks for asking!",
		timestamp: "2024-09-08T10:02:00Z",
	},
	// Add more mock messages as needed
];

export default function Component() {
	const [friends] = useState(mockFriends);
	const [messages] = useState(mockMessages);
	const [newMessage, setNewMessage] = useState("");
	const [selectedFriend, setSelectedFriend] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const handleSendMessage = () => {
		if (newMessage.trim() !== "") {
			// In a real app, you'd send this message to your backend
			console.log("Sending message:", newMessage);
			setNewMessage("");
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className='flex h-screen bg-gray-100'>
			{/* Sidebar */}
			<div
				className={`bg-white w-64 flex-shrink-0 ${
					isSidebarOpen ? "" : "hidden"
				} md:block`}
			>
				<div className='p-4 border-b'>
					<h2 className='text-xl font-semibold'>Friends</h2>
				</div>
				<ScrollArea className='h-[calc(100vh-64px)]'>
					{friends.map((friend) => (
						<div
							key={friend.id}
							className={`p-4 flex items-center space-x-3 hover:bg-gray-100 cursor-pointer ${
								selectedFriend?.id === friend.id ? "bg-gray-200" : ""
							}`}
							onClick={() => setSelectedFriend(friend)}
						>
							<Avatar>
								<AvatarImage src={friend.avatar} alt={friend.name} />
								<AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<p className='font-medium'>{friend.name}</p>
								<p
									className={`text-sm ${
										friend.status === "online"
											? "text-green-500"
											: "text-gray-500"
									}`}
								>
									{friend.status}
								</p>
							</div>
						</div>
					))}
				</ScrollArea>
			</div>

			{/* Main Chat Area */}
			<div className='flex-1 flex flex-col'>
				{/* Chat Header */}
				<div className='bg-white p-4 flex items-center justify-between border-b'>
					<Button
						variant='ghost'
						size='icon'
						className='md:hidden'
						onClick={toggleSidebar}
					>
						<Menu />
					</Button>
					<h2 className='text-xl font-semibold'>
						{selectedFriend ? selectedFriend.name : "Select a friend to chat"}
					</h2>
				</div>

				{/* Messages */}
				<ScrollArea className='flex-1 p-4'>
					{messages.map((message) => (
						<div
							key={message.id}
							className={`mb-4 ${
								message.senderId === "me" ? "text-right" : "text-left"
							}`}
						>
							<div
								className={`inline-block p-2 rounded-lg ${
									message.senderId === "me"
										? "bg-sky-500 text-white"
										: "bg-gray-300"
								}`}
							>
								{message.text}
							</div>
							<p className='text-xs text-gray-500 mt-1'>
								{new Date(message.timestamp).toLocaleTimeString()}
							</p>
						</div>
					))}
				</ScrollArea>

				{/* Message Input */}
				<div className='bg-white p-4 border-t'>
					<div className='flex space-x-2'>
						<Input
							type='text'
							placeholder='Type a message...'
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
						/>
						<Button onClick={handleSendMessage}>
							<Send className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
