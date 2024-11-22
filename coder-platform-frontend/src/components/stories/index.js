"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	Heart,
	MessageCircle,
	Send,
	MoreHorizontal,
	X,
	ChevronLeft,
	ChevronRight,
	PlusCircle,
	Image as ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dummyImages = [
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
	"/bg-default-cover.jpg",
];

const initialUsers = [
	{
		id: 1,
		username: "johndoe",
		stories: [
			{ id: 1, image: "/bg-default-cover.jpg", viewed: false },
			{ id: 2, image: "/bg-default-cover.jpg", viewed: false },
		],
	},
	{
		id: 2,
		username: "janedoe",
		stories: [{ id: 3, image: dummyImages[2], viewed: true }],
	},
	{
		id: 3,
		username: "bobsmith",
		stories: [
			{ id: 4, image: dummyImages[3], viewed: false },
			{ id: 5, image: dummyImages[4], viewed: false },
		],
	},
	{
		id: 4,
		username: "alicejones",
		stories: [{ id: 6, image: dummyImages[5], viewed: false }],
	},
	{
		id: 5,
		username: "charliegreen",
		stories: [
			{ id: 7, image: dummyImages[6], viewed: false },
			{ id: 8, image: dummyImages[7], viewed: false },
		],
	},
	{
		id: 6,
		username: "emmadavis",
		stories: [
			{ id: 9, image: dummyImages[8], viewed: true },
			{ id: 10, image: dummyImages[9], viewed: false },
		],
	},
	{
		id: 7,
		username: "frankwhite",
		stories: [
			{
				id: 11,
				image: "https://i.pravatar.cc/150?u=gracemiller",
				viewed: false,
			},
		],
	},
	{
		id: 8,
		username: "gracemiller",
		stories: [
			{
				id: 12,
				image: "https://i.pravatar.cc/150?u=gracemiller",
				viewed: false,
			},
			{ id: 13, image: dummyImages[2], viewed: false },
		],
	},
	{
		id: 9,
		username: "henrybrown",
		stories: [
			{
				id: 14,
				image: "https://i.pravatar.cc/150?u=gracemiller",
				viewed: true,
			},
		],
	},
	{
		id: 10,
		username: "isabelclark",
		stories: [
			{
				id: 15,
				image: "https://i.pravatar.cc/150?u=gracemiller",
				viewed: false,
			},
		],
	},
];

export default function EnhancedStoryCarousel() {
	const [users, setUsers] = useState(initialUsers);
	const [selectedUser, setSelectedUser] = useState(null);
	const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
	const [isPostingStory, setIsPostingStory] = useState(false);
	const [newStoryImage, setNewStoryImage] = useState("");
	const carouselRef = useRef(null);

	const openStory = (user) => {
		setSelectedUser(user);
		setCurrentStoryIndex(0);
	};

	const closeStory = () => {
		setSelectedUser(null);
		setCurrentStoryIndex(0);
	};

	const navigateStory = (direction) => {
		const newIndex = currentStoryIndex + direction;
		if (newIndex >= 0 && newIndex < selectedUser.stories.length) {
			setCurrentStoryIndex(newIndex);
			markStoryAsViewed(selectedUser.id, selectedUser.stories[newIndex].id);
		} else if (newIndex === selectedUser.stories.length) {
			const currentUserIndex = users.findIndex(
				(user) => user.id === selectedUser.id
			);
			if (currentUserIndex < users.length - 1) {
				setSelectedUser(users[currentUserIndex + 1]);
				setCurrentStoryIndex(0);
			} else {
				closeStory();
			}
		}
	};

	const markStoryAsViewed = (userId, storyId) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId
					? {
							...user,
							stories: user.stories.map((story) =>
								story.id === storyId ? { ...story, viewed: true } : story
							),
					  }
					: user
			)
		);
	};

	const handlePostStory = () => {
		setIsPostingStory(true);
	};

	const submitNewStory = () => {
		if (newStoryImage) {
			const newStory = {
				id: Date.now(),
				image: newStoryImage,
				viewed: false,
			};
			setUsers((prevUsers) => [
				{
					id: 0,
					username: "You",
					stories: [newStory],
				},
				...prevUsers,
			]);
			setNewStoryImage("");
			setIsPostingStory(false);
		}
	};

	return (
		<div className='p-4'>
			<div className='relative'>
				<div
					ref={carouselRef}
					className='flex space-x-4 overflow-x-auto scrollbar-hide'
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					<button
						className='flex-shrink-0 flex flex-col items-center space-y-1 p-2'
						onClick={handlePostStory}
					>
						<div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
							<PlusCircle className='w-8 h-8 text-gray-600' />
						</div>
						<span className='text-sm'>Post Story</span>
					</button>
					{users.map((user) => (
						<button
							key={user.id}
							className='flex-shrink-0 flex flex-col items-center p-2 '
							onClick={() => openStory(user)}
						>
							<Avatar
								className={`w-16 h-16 ring-2 mb-1 ${
									user.stories.some((story) => !story.viewed)
										? "ring-sky-500"
										: "ring-gray-300"
								} ring-offset-2`}
							>
								<AvatarImage
									src={`https://i.pravatar.cc/150?u=${user.username}`}
								/>
								<AvatarFallback>
									{user.username[0].toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span className='text-sm'>{user.username}</span>
						</button>
					))}
				</div>
			</div>

			<Dialog open={selectedUser !== null} onOpenChange={closeStory}>
				<DialogContent className='max-w-md p-0 overflow-hidden'>
					<div className='relative h-[600px]'>
						<AnimatePresence initial={false}>
							{selectedUser && (
								<motion.img
									key={`${selectedUser.id}-${currentStoryIndex}`}
									src={selectedUser.stories[currentStoryIndex].image}
									alt={`Story by ${selectedUser.username}`}
									className='absolute inset-0 w-full h-full object-cover object-center'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
								/>
							)}
						</AnimatePresence>
						<div className='absolute top-0 left-0 right-0 flex p-1'>
							{selectedUser?.stories.map((story, index) => (
								<div key={story.id} className='flex-1 h-1 bg-gray-500 mx-0.5'>
									<div
										className='h-full bg-white transition-all duration-100 ease-linear'
										style={{
											width:
												index < currentStoryIndex
													? "100%"
													: index === currentStoryIndex
													? "50%"
													: "0%",
										}}
									/>
								</div>
							))}
						</div>
						<div className='absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20'>
							<div className='flex items-center'>
								<Avatar className='w-8 h-8 border-2 border-pink-500'>
									<AvatarImage
										src={`https://i.pravatar.cc/150?u=${selectedUser?.username}`}
									/>
									<AvatarFallback>
										{selectedUser?.username[0].toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className='ml-2 font-semibold'>
									{selectedUser?.username}
								</span>
							</div>
							<Button variant='ghost' size='icon' onClick={closeStory}>
								<X className='h-6 w-6' />
							</Button>
						</div>
						<Button
							variant='ghost'
							size='icon'
							className='absolute top-1/2 left-4 transform -translate-y-1/2 text-white'
							onClick={() => navigateStory(-1)}
							disabled={currentStoryIndex === 0}
						>
							<ChevronLeft className='h-8 w-8' />
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='absolute top-1/2 right-4 transform -translate-y-1/2 text-white'
							onClick={() => navigateStory(1)}
						>
							<ChevronRight className='h-8 w-8' />
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={isPostingStory} onOpenChange={setIsPostingStory}>
				<DialogContent>
					<h2 className='text-lg font-semibold mb-4'>Post a New Story</h2>
					<div className='space-y-4'>
						<div>
							<Label htmlFor='story-image'>Story Image URL</Label>
							<Input
								id='story-image'
								placeholder='Enter image URL'
								value={newStoryImage}
								onChange={(e) => setNewStoryImage(e.target.value)}
							/>
						</div>
						<Button onClick={submitNewStory} className='w-full'>
							<ImageIcon className='w-4 h-4 mr-2' />
							Post Story
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
