import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
	HeartIcon,
	MessageCircleIcon,
	RepeatIcon,
	ShareIcon,
} from "lucide-react";

export default function PostCardSkeleton() {
	return (
		<Card className='w-full max-w-4xl mx-auto mb-6'>
			<CardHeader className='flex flex-row items-center space-x-4 pb-4'>
				<Skeleton className='h-12 w-12 rounded-full' />
				<div className='flex-1 space-y-2'>
					<Skeleton className='h-4 w-1/4' />
					<Skeleton className='h-3 w-1/3' />
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-5/6' />
					<Skeleton className='h-4 w-4/6' />
					<Skeleton className='h-32 w-full' />
					<Skeleton className='h-64 w-full' />
				</div>
			</CardContent>
			<CardFooter className='flex justify-between items-center pt-4 border-t'>
				<Button variant='ghost' size='sm' disabled>
					<HeartIcon className='h-5 w-5 mr-1 text-muted-foreground' />
					<Skeleton className='h-4 w-8' />
				</Button>
				<Button variant='ghost' size='sm' disabled>
					<MessageCircleIcon className='h-5 w-5 mr-1 text-muted-foreground' />
					<Skeleton className='h-4 w-8' />
				</Button>
				<Button variant='ghost' size='sm' disabled>
					<RepeatIcon className='h-5 w-5 mr-1 text-muted-foreground' />
					<Skeleton className='h-4 w-12' />
				</Button>
				<Button variant='ghost' size='sm' disabled>
					<ShareIcon className='h-5 w-5 mr-1 text-muted-foreground' />
					<Skeleton className='h-4 w-16' />
				</Button>
			</CardFooter>
		</Card>
	);
}
