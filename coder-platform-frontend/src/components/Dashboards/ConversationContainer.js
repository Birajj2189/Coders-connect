import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Smile, Paperclip, Send, MoreVertical, Search } from "lucide-react";

const chats = [
	{
		id: "1",
		name: "Alice",
		avatar: "/placeholder.svg?height=32&width=32",
		lastMessage: "Hey, how are you?",
		lastMessageTime: "10:30 AM",
		unreadCount: 2,
		online: true,
		isGroup: false,
	},
	{
		id: "2",
		name: "Bob",
		avatar: "/placeholder.svg?height=32&width=32",
		lastMessage: "See you later!",
		lastMessageTime: "Yesterday",
		unreadCount: 0,
		online: false,
		isGroup: false,
	},
	{
		id: "3",
		name: "Project Team",
		avatar: "/placeholder.svg?height=32&width=32",
		lastMessage: "Meeting at 3 PM",
		lastMessageTime: "2 days ago",
		unreadCount: 5,
		online: true,
		isGroup: true,
	},
];

const messages = [
	{
		id: "1",
		sender: "Alice",
		senderAvatar: "/placeholder.svg?height=32&width=32",
		content: "Hey, how are you?",
		timestamp: "10:30 AM",
		isOwn: false,
	},
	{
		id: "2",
		sender: "You",
		senderAvatar: "/placeholder.svg?height=32&width=32",
		content: "I'm good, thanks! How about you?",
		timestamp: "10:31 AM",
		isOwn: true,
	},
	{
		id: "3",
		sender: "Alice",
		senderAvatar: "/placeholder.svg?height=32&width=32",
		content: "Doing great! Did you finish the report?",
		timestamp: "10:32 AM",
		isOwn: false,
	},
];

const ChatListItem = ({ selectedChat, chat, onClick }) => (
	<div
		className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-blue-50 ${
			selectedChat?.id === chat.id ? "bg-blue-50" : ""
		}`}
		onClick={onClick}
	>
		<Avatar>
			<AvatarImage src={chat.avatar} alt={chat.name} />
			<AvatarFallback>{chat.name[0]}</AvatarFallback>
		</Avatar>
		<div className='flex-1 min-w-0'>
			<div className='flex items-center justify-between'>
				<h4 className='text-sm font-semibold truncate'>{chat.name}</h4>
				<span className='text-xs text-muted-foreground whitespace-nowrap'>
					{chat.lastMessageTime}
				</span>
			</div>
			<div className='flex items-center justify-between mt-1'>
				<p className='text-sm text-muted-foreground truncate'>
					{chat.lastMessage}
				</p>
				<div className='flex items-center space-x-2'>
					<span
						className={`w-2 h-2 rounded-full ${
							chat.online ? "bg-green-500" : "bg-gray-300"
						}`}
					></span>
					{chat.unreadCount > 0 && (
						<Badge variant='destructive' className='rounded-full'>
							{chat.unreadCount}
						</Badge>
					)}
				</div>
			</div>
		</div>
	</div>
);

const MessageBubble = ({ message }) => (
	<div
		className={`flex ${
			message.isOwn ? "justify-end" : "justify-start"
		} my-2 py-1`}
	>
		{!message.isOwn && (
			<Avatar className='mr-2'>
				<AvatarImage src={message.senderAvatar} alt={message.sender} />
				<AvatarFallback>{message.sender[0]}</AvatarFallback>
			</Avatar>
		)}
		<div
			className={`max-w-[70%] shadow-md ${
				message.isOwn ? "bg-sky-500 text-blue-50" : "bg-white"
			} rounded-lg p-3`}
		>
			{!message.isOwn && (
				<p className='text-xs font-bold mb-1 '>{message.sender}</p>
			)}
			<p className='text-sm'>{message.content}</p>
			<span className='text-xs text-muted-foreground mt-1 block'>
				{message.timestamp}
			</span>
		</div>
		{message.isOwn && (
			<Avatar className='ml-2'>
				<AvatarImage src={message.senderAvatar} alt={message.sender} />
				<AvatarFallback>{message.sender[0]}</AvatarFallback>
			</Avatar>
		)}
	</div>
);

export default function AdvancedChat() {
	const [selectedChat, setSelectedChat] = useState(null);
	const [messageInput, setMessageInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredChats, setFilteredChats] = useState(chats);

	useEffect(() => {
		const filtered = chats.filter((chat) =>
			chat.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredChats(filtered);
	}, [searchQuery]);

	const handleSendMessage = () => {
		if (messageInput.trim()) {
			console.log("Sending message:", messageInput);
			setMessageInput("");
		}
	};

	return (
		<div className='flex h-screen bg-slate-50 w-full'>
			{/* Sidebar */}
			<div className='w-80 border-r'>
				<div className='p-4'>
					<h2 className='text-2xl font-bold mb-4'>Chats</h2>
					<div className='relative mb-4'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							type='text'
							placeholder='Search friends...'
							className='pl-8'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Tabs defaultValue='personal'>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='personal'>Personal</TabsTrigger>
							<TabsTrigger value='groups'>Groups</TabsTrigger>
						</TabsList>
						<TabsContent value='personal'>
							<ScrollArea className='h-[calc(100vh-250px)]'>
								{filteredChats
									.filter((chat) => !chat.isGroup)
									.map((chat) => (
										<ChatListItem
											key={chat.id}
											chat={chat}
											selectedChat={selectedChat}
											onClick={() => setSelectedChat(chat)}
										/>
									))}
							</ScrollArea>
						</TabsContent>
						<TabsContent value='groups'>
							<ScrollArea className='h-[calc(100vh-250px)]'>
								{filteredChats
									.filter((chat) => chat.isGroup)
									.map((chat) => (
										<ChatListItem
											key={chat.id}
											chat={chat}
											selectedChat={selectedChat}
											onClick={() => setSelectedChat(chat)}
										/>
									))}
							</ScrollArea>
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* Main Chat Area */}
			<div className='flex-1 flex flex-col '>
				{selectedChat ? (
					<>
						{/* Chat Header */}
						<div className='p-4 border-b flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<Avatar>
									<AvatarImage
										src={selectedChat.avatar}
										alt={selectedChat.name}
									/>
									<AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
								</Avatar>
								<div>
									<h3 className='font-semibold'>{selectedChat.name}</h3>
									<div className='flex items-center space-x-2'>
										<span
											className={`w-2 h-2 rounded-full ${
												selectedChat.online ? "bg-green-500" : "bg-gray-300"
											}`}
										></span>
										<p className='text-sm text-muted-foreground'>
											{selectedChat.online ? "Online" : "Offline"}
										</p>
									</div>
								</div>
							</div>
							<Button variant='ghost' size='icon'>
								<MoreVertical className='h-5 w-5' />
							</Button>
						</div>

						{/* Messages */}
						<ScrollArea className='flex-1 p-4 bg-blue-50'>
							{messages.map((message) => (
								<MessageBubble key={message.id} message={message} />
							))}
						</ScrollArea>

						{/* Message Input */}
						<div className='p-4 border-t'>
							<div className='flex items-center space-x-2'>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant='ghost' size='icon'>
											<Smile className='h-5 w-5' />
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div className='grid grid-cols-8 gap-2'>
											{["😀", "😂", "😍", "🤔", "😎", "👍", "❤️", "🎉"].map(
												(emoji) => (
													<button
														key={emoji}
														className='text-2xl hover:bg-accent rounded'
														onClick={() =>
															setMessageInput((prev) => prev + emoji)
														}
													>
														{emoji}
													</button>
												)
											)}
										</div>
									</PopoverContent>
								</Popover>
								<Button variant='ghost' size='icon'>
									<Paperclip className='h-5 w-5' />
								</Button>
								<Textarea
									value={messageInput}
									onChange={(e) => setMessageInput(e.target.value)}
									placeholder='Type a message...'
									className='flex-1'
									rows={1}
								/>
								<Button onClick={handleSendMessage}>
									<Send className='h-5 w-5' />
								</Button>
							</div>
						</div>
					</>
				) : (
					<div className='flex items-center justify-center h-full'>
						<p className='text-muted-foreground'>
							Select a chat to start messaging
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
