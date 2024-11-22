import { useState, useEffect } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { BreadcrumbResponsive } from "../breadcrumbs";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardIcon, InfoIcon } from "lucide-react";

const skills = [
	{
		name: "React",
		language: "jsx",
		code: `import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello, React!</h1>\n    </div>\n  );\n}\n\nexport default App;`,
	},
	{
		name: "Node.js",
		language: "javascript",
		code: `const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello, Node.js!');\n});\n\napp.listen(port, () => {\n  console.log(\`Server running at http://localhost:\${port}/\`);\n});`,
	},
	{
		name: "Python",
		language: "python",
		code: `def main():\n    print("Hello, Python!")\n\nif __name__ == "__main__":\n    main()`,
	},
	{
		name: "Vue.js",
		language: "html",
		code: `<template>\n  <div>\n    <h1>{{ message }}</h1>\n  </div>\n</template>\n\n<script>\nexport default {\n  data() {\n    return {\n      message: 'Hello, Vue!'\n    }\n  }\n}\n</script>`,
	},
	{
		name: "Ruby",
		language: "ruby",
		code: `class HelloWorld\n  def initialize(name)\n    @name = name\n  end\n\n  def say_hello\n    puts "Hello, #{@name}!"\n  end\nend\n\nhello = HelloWorld.new("Ruby")\nhello.say_hello`,
	},
];
const BreadcrumbItems = [{ href: "/", label: "Home" }, { label: "Templates" }];

export default function Dashboard() {
	const [selectedSkill, setSelectedSkill] = useState(skills[0]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredSkills, setFilteredSkills] = useState(skills);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const filtered = skills.filter((skill) =>
			skill.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredSkills(filtered);
		if (filtered.length > 0 && !filtered.includes(selectedSkill)) {
			setSelectedSkill(filtered[0]);
		}
	}, [searchTerm, selectedSkill]);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(selectedSkill.code);
		toast.success("Code copied to clipboard!", {
			position: "bottom-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	return (
		<TooltipProvider>
			<div className='container min-h-screen mx-auto p-4 bg-blue-50'>
				<BreadcrumbResponsive items={BreadcrumbItems} />
				<h1 className='text-3xl font-bold mb-6'>Boiler Plate Templates</h1>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Card className='col-span-1 md:col-span-1'>
						<CardHeader>
							<CardTitle>Select a Skill</CardTitle>
							<CardDescription>
								Search and choose a skill to view its boilerplate code
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										role='combobox'
										aria-expanded={open}
										className='w-full justify-between'
									>
										{selectedSkill.name}
										<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
									</Button>
								</PopoverTrigger>
								<PopoverContent className='p-0'>
									<Command>
										<CommandInput
											placeholder='Search skill...'
											className='h-9 -full'
											onValueChange={setSearchTerm}
										/>
										<CommandList>
											<CommandEmpty>No skill found.</CommandEmpty>
											<CommandGroup>
												{filteredSkills.map((skill) => (
													<CommandItem
														key={skill.name}
														value={skill.name}
														onSelect={() => {
															setSelectedSkill(skill);
															setOpen(false);
														}}
													>
														{skill.name}
														<CheckIcon
															className={
																selectedSkill.name === skill.name
																	? "ml-auto h-4 w-4 opacity-100"
																	: "ml-auto h-4 w-4 opacity-0"
															}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</CardContent>
					</Card>
					<Card className='col-span-2'>
						<CardHeader>
							<CardTitle>{selectedSkill.name}</CardTitle>
						</CardHeader>
						<CardContent>lorem50</CardContent>
					</Card>
					<Card className='col-span-1 md:col-span-3'>
						<CardHeader>
							<CardTitle className='flex justify-between items-center'>
								<span>{selectedSkill.name} Boilerplate</span>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='outline'
											size='icon'
											onClick={copyToClipboard}
										>
											<ClipboardIcon className='h-4 w-4 hover:animate-out' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Copy to clipboard</p>
									</TooltipContent>
								</Tooltip>
							</CardTitle>
							<CardDescription className='flex items-center'>
								Basic setup for {selectedSkill.name}
								<Tooltip>
									<TooltipTrigger asChild>
										<InfoIcon className='ml-2 h-4 w-4 cursor-help' />
									</TooltipTrigger>
									<TooltipContent>
										<p>
											This is a simple boilerplate for {selectedSkill.name}. You
											may need to customize it based on your specific
											requirements.
										</p>
									</TooltipContent>
								</Tooltip>
							</CardDescription>
						</CardHeader>
						<CardContent>
							<SyntaxHighlighter
								language={selectedSkill.language}
								style={tomorrow}
								className='rounded-md'
							>
								{selectedSkill.code}
							</SyntaxHighlighter>
						</CardContent>
					</Card>
				</div>
				<ToastContainer />
			</div>
		</TooltipProvider>
	);
}
