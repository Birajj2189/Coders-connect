import React from "react";

export default function SinglePostContainer({ slug }) {
	return (
		<div className='bg-blue-50 w-full p-4 h-auto overflow-scroll overflow-x-hidden'>
			{slug}
		</div>
	); // Now this correctly accesses the slug
}
