import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@trip-booking/ui/components/card";
import {
	ArrowRight,
	Calendar,
	MapPin,
	Users,
} from "lucide-react";
import type { TripWithOperator } from "./types";

export function TripInfoCard({ trip }: { trip: TripWithOperator }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{trip.operator.logo && (
						<img
							src={trip.operator.logo}
							alt={trip.operator.name}
							className="h-6 w-6 object-contain"
						/>
					)}
					{trip.operator.name}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<MapPin className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium">{trip.departureCity}</span>
					<ArrowRight className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium">{trip.arrivalCity}</span>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<span>
						{new Date(trip.departureTime).toLocaleDateString([], {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<span>
						{new Date(trip.departureTime).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
						{" → "}
						{new Date(trip.arrivalTime).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Users className="h-4 w-4 text-muted-foreground" />
					<span>{trip.availableSeats} seats available</span>
				</div>
			</CardContent>
			<CardFooter>
				<span className="font-bold text-2xl">
					{Number(trip.price).toFixed(2)} MAD
				</span>
			</CardFooter>
		</Card>
	);
}
