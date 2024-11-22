"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

export default function Component() {
	return (
		<div className='flex flex-col items-center justify-center p-8 bg-background/50 '>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<motion.div
					animate={{
						y: [0, -10, 0],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						repeatType: "reverse",
						ease: "easeInOut",
					}}
					className='text-muted-foreground/30 p-2'
				>
					<Newspaper size={64} className='text-gray-600' />
				</motion.div>
			</motion.div>
			<motion.h2
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className='mt-4 text-4xl font-bold text-center text-foreground text-gray-600'
			>
				No Posts Yet
			</motion.h2>
			<motion.p
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.3 }}
				className='mt-2 text-sm text-muted-foreground text-center'
			>
				When new posts arrive, you'll see them here.
			</motion.p>
		</div>
	);
}
