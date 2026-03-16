import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<div className="flex h-full items-center justify-center">
			<h1 className="font-bold text-4xl">trip-booking</h1>
		</div>
	);
}
