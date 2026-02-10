import {
	Building2,
	Calendar,
	Clock,
	Cog,
	House,
	ListCollapse,
	ListTodo,
	Plus,
	Upload,
} from "lucide-react";
import type { FileRoutesByTo } from "@/routeTree.gen";

type RouteTo = keyof FileRoutesByTo;

type NavItem =
	| {
			type: "link";
			label: string;
			to: RouteTo;
			icon: typeof Building2;
	  }
	| {
			type: "collapsible";
			label: string;
			icon: typeof Building2;
			defaultOpen?: boolean;
			children: Array<{
				label: string;
				to: RouteTo;
				icon: typeof Building2;
			}>;
	  };

const navItems: NavItem[] = [
	{
		type: "collapsible",
		label: "Mosque",
		icon: Building2,
		defaultOpen: true,
		children: [
			{
				label: "Mosque Details",
				to: "/mosque/mosque-details",
				icon: ListCollapse,
			},
			{
				label: "Mosque Config",
				to: "/mosque/mosque-config",
				icon: Cog,
			},
		],
	},
	{
		type: "collapsible",
		label: "Prayer Times",
		icon: Clock,
		defaultOpen: true,
		children: [
			{
				label: "Prayer Times",
				to: "/prayer-times/test-prayer-times",
				icon: Calendar,
			},
			{
				label: "Mosque Prayer Times",
				to: "/prayer-times/mosque-prayer-times",
				icon: House,
			},
			{
				label: "Iqama Times",
				to: "/prayer-times/prayer-iqama",
				icon: Clock,
			},
			{
				label: "Prayer Times Upload",
				to: "/prayer-times/upload-prayer-times",
				icon: Upload,
			},
		],
	},
	{
		type: "collapsible",
		label: "Events",
		icon: Calendar,
		defaultOpen: true,
		children: [
			{
				label: "Show Events",
				to: "/events/list-events",
				icon: ListTodo,
			},
			{
				label: "Create Event",
				to: "/events/create-event",
				icon: Plus,
			},
		],
	},
];

export function useNavItems() {
	return navItems;
}

export type { NavItem };
