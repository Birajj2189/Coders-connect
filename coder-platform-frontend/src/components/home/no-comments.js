"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircleIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoComments({ onAddComment }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col items-center justify-center p-8 bg-secondary/30 rounded-lg shadow-inner'
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
			>
				<MessageCircleIcon className='w-12 h-12 text-secondary-foreground/50 text-gray-500' />
			</motion.div>
			<motion.h3
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className='mt-2 text-lg font-semibold text-secondary-foreground text-gray-500'
			>
				No comments yet
			</motion.h3>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6 }}
				className='mt-1 text-xs text-secondary-foreground/70 text-center max-w-sm text-gray-400'
			>
				Be the first to share your thoughts on this post. Your insights could
				spark an interesting discussion!
			</motion.p>
		</motion.div>
	);
}
