import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
	"fixed w-[56] top-10 right-10 rounded-lg border border-gray-200 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950 [&>svg~*]:pl-7 dark:border-gray-800 dark:[&>svg]:text-gray-50",
	{
		variants: {
			variant: {
				default: "bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50",
				destructive:
					"border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

const Alert = React.forwardRef(
	({ className, variant, onClose, ...props }, ref) => (
		<div
			ref={ref}
			role='alert'
			className={cn(alertVariants({ variant }), className)}
			{...props}
		>
			<button
				className='absolute top-0 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
				onClick={onClose}
				aria-label='Close'
			>
				&times;
			</button>
			{props.children}
		</div>
	)
);

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("text-sm [&_p]:leading-relaxed", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };