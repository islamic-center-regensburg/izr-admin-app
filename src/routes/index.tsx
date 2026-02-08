import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="text-center flex flex-col items-center justify-center gap-10 p-8 h-screen">
			<h1 className="text-8xl">Welcome to izr admin the App</h1>
			<h2 className="text-7xl">Welcome to izr admin the App</h2>
			<h3 className="text-6xl">Welcome to izr admin the App</h3>
			<h4 className="text-5xl">Welcome to izr admin the App</h4>
			<h5 className="text-4xl">Welcome to izr admin the App</h5>
			<h6 className="text-3xl">Welcome to izr admin the App</h6>
			<p className="text-xl">Welcome to izr admin the App</p>
		</div>
	);
}
