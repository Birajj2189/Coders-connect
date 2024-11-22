"use client";

import * as React from "react";
import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_TO_DISPLAY = 3;

export function BreadcrumbResponsive({ items }) {
	const [open, setOpen] = React.useState(false);

	const shouldShowDropdownOrDrawer = items.length > ITEMS_TO_DISPLAY;

	const renderBreadcrumbItems = () => {
		if (items.length === 2) {
			return (
				<>
					<BreadcrumbItem>
						<BreadcrumbLink href={items[0].href}>
							{items[0].label}
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage className='max-w-20 truncate md:max-w-none text-sky-500'>
							{items[1].label}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</>
			);
		}

		return (
			<>
				<BreadcrumbItem>
					<BreadcrumbLink href={items[0].href}>{items[0].label}</BreadcrumbLink>
				</BreadcrumbItem>
				{items.length > 1 && <BreadcrumbSeparator />}

				{shouldShowDropdownOrDrawer && (
					<>
						{items.length > ITEMS_TO_DISPLAY ? (
							<BreadcrumbItem>
								{/* DropdownMenu for larger screens */}
								<DropdownMenu open={open} onOpenChange={setOpen}>
									<DropdownMenuTrigger
										className='flex items-center gap-1'
										aria-label='Toggle menu'
									>
										<BreadcrumbEllipsis className='h-4 w-4' />
									</DropdownMenuTrigger>
									<DropdownMenuContent align='start'>
										{items.slice(1, -1).map((item, index) => (
											<DropdownMenuItem key={index}>
												<Link href={item.href ? item.href : "#"}>
													{item.label}
												</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</BreadcrumbItem>
						) : (
							<BreadcrumbItem>
								{/* Drawer for mobile screens */}
								<Drawer open={open} onOpenChange={setOpen}>
									<DrawerTrigger aria-label='Toggle Menu'>
										<BreadcrumbEllipsis className='h-4 w-4' />
									</DrawerTrigger>
									<DrawerContent>
										<DrawerHeader className='text-left'>
											<DrawerTitle>Navigate to</DrawerTitle>
											<DrawerDescription>
												Select a page to navigate to.
											</DrawerDescription>
										</DrawerHeader>
										<div className='grid gap-1 px-4'>
											{items.slice(1, -1).map((item, index) => (
												<Link
													key={index}
													href={item.href ? item.href : "#"}
													className='py-1 text-sm'
												>
													{item.label}
												</Link>
											))}
										</div>
										<DrawerFooter className='pt-4'>
											<DrawerClose asChild>
												<Button variant='outline'>Close</Button>
											</DrawerClose>
										</DrawerFooter>
									</DrawerContent>
								</Drawer>
							</BreadcrumbItem>
						)}
					</>
				)}

				{items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
					<BreadcrumbItem key={index}>
						{item.href ? (
							<>
								<BreadcrumbLink
									asChild
									className='max-w-20 truncate md:max-w-none'
								>
									<Link href={item.href}>{item.label}</Link>
								</BreadcrumbLink>
								{index < items.length - 1 && <BreadcrumbSeparator />}
							</>
						) : (
							<BreadcrumbPage className='max-w-20 truncate md:max-w-none text-sky-500'>
								{item.label}
							</BreadcrumbPage>
						)}
					</BreadcrumbItem>
				))}
			</>
		);
	};

	return (
		<Breadcrumb className='mb-2'>
			<BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
		</Breadcrumb>
	);
}
