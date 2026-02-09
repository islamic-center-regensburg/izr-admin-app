import { Link } from "@tanstack/react-router";
import {
	Building2,
	Calendar,
	ChevronDown,
	Clock,
	ListTodo,
	Plus,
	TestTube2,
	Upload,
} from "lucide-react";
import { Collapsible } from "radix-ui";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-2">
					<Building2 className="h-6 w-6" />
					<span className="font-semibold text-lg">IZR Admin</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarMenu>
						{/* Mosque */}
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<Link to="/mosque">
									<Building2 />
									<span>Mosque</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						{/* Prayer Times with Children */}
						<Collapsible.Root defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<Collapsible.Trigger asChild>
									<SidebarMenuButton>
										<Clock />
										<span>Prayer Times</span>
										<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
									</SidebarMenuButton>
								</Collapsible.Trigger>
								<Collapsible.Content>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link to="/prayer-times/upload-prayer-times">
													<Upload />
													<span>Prayer Times Upload</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link to="/prayer-times/test-prayer-times">
													<TestTube2 />
													<span>Prayer Times Test</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</Collapsible.Content>
							</SidebarMenuItem>
						</Collapsible.Root>

						{/* Events with Children */}
						<Collapsible.Root defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<Collapsible.Trigger asChild>
									<SidebarMenuButton>
										<Calendar />
										<span>Events</span>
										<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
									</SidebarMenuButton>
								</Collapsible.Trigger>
								<Collapsible.Content>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link to="/events/list-events">
													<ListTodo />
													<span>Show Events</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton asChild>
												<Link to="/events/create-event">
													<Plus />
													<span>Create Event</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</Collapsible.Content>
							</SidebarMenuItem>
						</Collapsible.Root>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
