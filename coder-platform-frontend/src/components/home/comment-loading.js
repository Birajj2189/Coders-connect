import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function commentLoading() {
	return (
		<div className='space-y-4'>
			{Array.from({ length: 3 }).map((_, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
					className='flex items-start gap-2'
				>
					<Skeleton className='w-8 h-8 rounded-full' />
					<div className='flex-grow space-y-2'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-3 w-16' />
					</div>
				</motion.div>
			))}
		</div>
	);
}
