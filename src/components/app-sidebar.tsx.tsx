import { Link } from "@tanstack/react-router";
import { Building2, ChevronDown } from "lucide-react";
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
import { useNavItems } from "@/hooks/use-nav-items";

export function AppSidebar() {
	const navItems = useNavItems();

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
						{navItems.map((item) => {
							if (item.type === "link") {
								const Icon = item.icon;

								return (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton asChild>
											<Link to={item.to}>
												<Icon />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							}

							const Icon = item.icon;

							return (
								<Collapsible.Root
									key={item.label}
									defaultOpen={item.defaultOpen}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<Collapsible.Trigger asChild>
											<SidebarMenuButton>
												<Icon />
												<span>{item.label}</span>
												<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
											</SidebarMenuButton>
										</Collapsible.Trigger>
										<Collapsible.Content>
											<SidebarMenuSub>
												{item.children.map((child) => {
													const ChildIcon = child.icon;

													return (
														<SidebarMenuSubItem key={child.to}>
															<SidebarMenuSubButton asChild>
																<Link to={child.to}>
																	<ChildIcon />
																	<span>{child.label}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</Collapsible.Content>
									</SidebarMenuItem>
								</Collapsible.Root>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
