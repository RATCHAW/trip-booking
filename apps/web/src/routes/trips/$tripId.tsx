import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trips/$tripId")({
	component: TripDetailsComponent,
});

function TripDetailsComponent() {
	const { tripId } = Route.useParams();
	return (
		<div className="flex h-full items-center justify-center">
			<h1 className="font-bold text-2xl">Trip {tripId}</h1>
		</div>
	);
}
