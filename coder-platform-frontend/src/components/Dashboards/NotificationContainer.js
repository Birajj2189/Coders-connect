"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
	Bell,
	Check,
	CheckCheck,
	User,
	Mail,
	AlertCircle,
	Home,
	ChevronRight,
	MoreVertical,
	Search,
	Settings,
	Archive,
	Reply,
	Volume2,
	VolumeX,
	CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { BreadcrumbResponsive } from "../breadcrumbs";

// DatePickerWithRange component
const DatePickerWithRange = ({ date, setDate }) => {
	return (
		<div className={cn("grid gap-2")}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

// Mock WebSocket for real-time updates
const mockWebSocket = {
	onmessage: null,
	send: (data) => {
		console.log("WebSocket message sent:", data);
	},
};

// Mock function to request notification permission
const requestNotificationPermission = async () => {
	if (!("Notification" in window)) {
		console.log("This browser does not support desktop notification");
		return false;
	}
	let permission = await Notification.requestPermission();
	return permission === "granted";
};

// Mock function to show a desktop notification
const showDesktopNotification = (title, body) => {
	new Notification(title, { body });
};

const initialNotifications = [
	{
		id: 1,
		type: "mention",
		content: "John Doe mentioned you in a comment",
		time: new Date(Date.now() - 5 * 60000).toISOString(),
		read: false,
	},
	{
		id: 2,
		type: "alert",
		content: "Your subscription is expiring soon",
		time: new Date(Date.now() - 60 * 60000).toISOString(),
		read: false,
	},
	{
		id: 3,
		type: "message",
		content: "You have a new message from Jane Smith",
		time: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
		read: false,
	},
	{
		id: 4,
		type: "mention",
		content: "Alice Johnson mentioned you in a task",
		time: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
		read: true,
	},
	{
		id: 5,
		type: "alert",
		content: "System maintenance scheduled for tomorrow",
		time: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
		read: true,
	},
];

export default function AdvancedNotificationPage() {
	const [notifications, setNotifications] = useState(initialNotifications);
	const [filter, setFilter] = useState("all");
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [dateRange, setDateRange] = useState({
		from: undefined,
		to: undefined,
	});
	const [selectedTypes, setSelectedTypes] = useState([
		"mention",
		"alert",
		"message",
	]);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] =
		useState(false);
	const [page, setPage] = useState(1);
	const observerTarget = useRef(null);
	const { toast } = useToast();

	useEffect(() => {
		mockWebSocket.onmessage = (event) => {
			const newNotification = JSON.parse(event.data);
			setNotifications((prev) => [newNotification, ...prev]);
			if (soundEnabled) {
				// Play notification sound
				new Audio("/notification-sound.mp3").play();
			}
			if (desktopNotificationsEnabled) {
				showDesktopNotification("New Notification", newNotification.content);
			}
		};

		// Simulate receiving a new notification every 10 seconds
		const interval = setInterval(() => {
			const newNotification = {
				id: Date.now(),
				type: ["mention", "alert", "message"][Math.floor(Math.random() * 3)],
				content: `New notification ${Date.now()}`,
				time: new Date().toISOString(),
				read: false,
			};
			mockWebSocket.onmessage({ data: JSON.stringify(newNotification) });
		}, 10000);

		return () => clearInterval(interval);
	}, [soundEnabled, desktopNotificationsEnabled]);

	const filteredNotifications = notifications.filter((n) => {
		const matchesFilter =
			filter === "all" || (filter === "unread" && !n.read) || n.type === filter;
		const matchesSearch = n.content
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesDateRange =
			(!dateRange?.from || new Date(n.time) >= dateRange.from) &&
			(!dateRange?.to || new Date(n.time) <= dateRange.to);
		const matchesType = selectedTypes.includes(n.type);
		return matchesFilter && matchesSearch && matchesDateRange && matchesType;
	});

	const groupedNotifications = filteredNotifications.reduce(
		(groups, notification) => {
			const date = format(new Date(notification.time), "PP");
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(notification);
			return groups;
		},
		{}
	);

	const markAsRead = (id) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
		);
	};

	const markAllAsRead = () => {
		setLoading(true);
		setTimeout(() => {
			setNotifications(notifications.map((n) => ({ ...n, read: true })));
			setLoading(false);
			toast({
				title: "All notifications marked as read",
				description: "You've successfully marked all notifications as read.",
			});
		}, 1000);
	};

	const undoMarkAsRead = (id) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: false } : n))
		);
	};

	const archiveNotification = (id) => {
		setNotifications(notifications.filter((n) => n.id !== id));
		toast({
			title: "Notification archived",
			description: "The notification has been archived.",
		});
	};

	const replyToNotification = (id) => {
		toast({
			title: "Reply sent",
			description: "Your reply has been sent.",
		});
	};

	const getIcon = (type) => {
		switch (type) {
			case "mention":
				return <User className='h-4 w-4' />;
			case "message":
				return <Mail className='h-4 w-4' />;
			case "alert":
				return <AlertCircle className='h-4 w-4' />;
			default:
				return <Bell className='h-4 w-4' />;
		}
	};

	const loadMore = useCallback(() => {
		setPage((prevPage) => prevPage + 1);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			},
			{ threshold: 1 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [loadMore]);

	const BreadcrumbItems = [
		{ href: "/", label: "Home" },
		{ label: "Notifications" },
	];

	return (
		<div className='w-full mx-auto bg-blue-50 p-4'>
			<BreadcrumbResponsive items={BreadcrumbItems} />
			<div className='flex flex-row items-center justify-between space-y-0'>
				<CardTitle className='text-3xl font-bold mb-4 pb-2'>
					Manage Your Notifications
				</CardTitle>
			</div>
			<div>
				<div className='space-y-4'>
					<div className='flex gap-2'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Button
										variant='outline'
										onClick={markAllAsRead}
										disabled={loading}
									>
										{loading ? (
											<Skeleton className='w-24 h-4' />
										) : (
											"Mark All As Read"
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Mark all notifications as read</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Button
							variant='outline'
							onClick={() => setDateRange({ from: undefined, to: undefined })}
						>
							Clear Date Range
						</Button>
						<Button
							variant='outline'
							onClick={() => setFilter(filter === "all" ? "unread" : "all")}
						>
							{filter === "all" ? "Show Unread" : "Show All"}
						</Button>
					</div>
					<div className='flex flex-col gap-2'>
						<Input
							placeholder='Search notifications'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Select value={filter} onValueChange={(value) => setFilter(value)}>
							<SelectTrigger>
								<SelectValue placeholder='Filter by type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Types</SelectItem>
								<SelectItem value='mention'>Mentions</SelectItem>
								<SelectItem value='message'>Messages</SelectItem>
								<SelectItem value='alert'>Alerts</SelectItem>
							</SelectContent>
						</Select>
						<DatePickerWithRange date={dateRange} setDate={setDateRange} />
					</div>
					<ScrollArea className='h-[480px] border-2 rounded-lg p-4 py-4 bg-white'>
						<div className='space-y-4'>
							{Object.entries(groupedNotifications).map(
								([date, notifications]) => (
									<div key={date}>
										<h3 className='text-lg font-semibold'>{date}</h3>
										<div className='space-y-2'>
											{notifications.map((notification) => (
												<div
													key={notification.id}
													className={cn(
														"flex items-center space-x-4 p-4 hover:bg-slate-300  cursor-pointer rounded",
														{
															"bg-white": notification.read,
															"bg-slate-200": !notification.read,
														}
													)}
												>
													<div className='flex-shrink-0'>
														{getIcon(notification.type)}
													</div>
													<div className='flex-1'>
														<div className='font-semibold'>
															{notification.content}
														</div>
														<div className='text-sm text-muted-foreground'>
															{format(new Date(notification.time), "PPpp")}
														</div>
													</div>
													<div className='flex space-x-2'>
														{!notification.read && (
															<Button
																variant='outline'
																onClick={() => markAsRead(notification.id)}
															>
																<Check className='h-4 w-4' />
															</Button>
														)}
														<Button
															variant='outline'
															onClick={() =>
																replyToNotification(notification.id)
															}
														>
															<Reply className='h-4 w-4' />
														</Button>
														<Button
															variant='outline'
															onClick={() =>
																archiveNotification(notification.id)
															}
														>
															<Archive className='h-4 w-4' />
														</Button>
													</div>
												</div>
											))}
										</div>
									</div>
								)
							)}
						</div>
						<div ref={observerTarget} className='h-2 w-full'></div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
