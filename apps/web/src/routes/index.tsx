import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@trip-booking/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@trip-booking/ui/components/card";
import { Input } from "@trip-booking/ui/components/input";
import { Label } from "@trip-booking/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@trip-booking/ui/components/select";
import { Skeleton } from "@trip-booking/ui/components/skeleton";
import { ArrowRight, Calendar, MapPin, Search, Users } from "lucide-react";
import { orpc } from "@/utils/orpc";

type TripSearch = {
	departureCity?: string;
	arrivalCity?: string;
	date?: string;
};

const getSearchValue = (value: unknown) =>
	typeof value === "string" && value.length > 0 ? value : undefined;

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>): TripSearch => ({
		departureCity: getSearchValue(search.departureCity),
		arrivalCity: getSearchValue(search.arrivalCity),
		date: getSearchValue(search.date),
	}),
	component: HomeComponent,
});

const CITIES = [
	"Casablanca",
	"Rabat",
	"Marrakech",
	"Fes",
	"Tangier",
	"Agadir",
	"Oujda",
	"Meknes",
];

function HomeComponent() {
	const navigate = useNavigate({ from: Route.fullPath });
	const search = Route.useSearch();
	const departureCity = search.departureCity ?? "";
	const arrivalCity = search.arrivalCity ?? "";
	const date = search.date ?? "";
	const hasSearchParams = Boolean(departureCity && arrivalCity && date);

	const { data: results, isLoading } = useQuery({
		...orpc.trips.search.queryOptions({
			input: {
				departureCity,
				arrivalCity,
				date,
			},
		}),
		enabled: hasSearchParams,
	});

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const nextSearch = {
			departureCity: getSearchValue(formData.get("departureCity")),
			arrivalCity: getSearchValue(formData.get("arrivalCity")),
			date: getSearchValue(formData.get("date")),
		};

		if (nextSearch.departureCity && nextSearch.arrivalCity && nextSearch.date) {
			navigate({ search: nextSearch });
		}
	};

	return (
		<div className="mx-auto max-w-4xl p-6">
			<h1 className="mb-6 font-bold text-3xl">Trip Search</h1>

			<Card>
				<CardContent>
					<form
						key={[departureCity, arrivalCity, date].join("|")}
						onSubmit={handleSearch}
						className="flex flex-col gap-4 md:flex-row md:items-end"
					>
						<div className="flex flex-1 flex-col gap-2">
							<Label htmlFor="departure">Departure City</Label>
							<Select
								name="departureCity"
								required
								defaultValue={departureCity || undefined}
							>
								<SelectTrigger id="departure">
									<SelectValue placeholder="Select city" />
								</SelectTrigger>
								<SelectContent>
									{CITIES.map((city) => (
										<SelectItem key={city} value={city}>
											{city}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-1 flex-col gap-2">
							<Label htmlFor="arrival">Arrival City</Label>
							<Select
								name="arrivalCity"
								required
								defaultValue={arrivalCity || undefined}
							>
								<SelectTrigger id="arrival">
									<SelectValue placeholder="Select city" />
								</SelectTrigger>
								<SelectContent>
									{CITIES.map((city) => (
										<SelectItem key={city} value={city}>
											{city}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-1 flex-col gap-2">
							<Label htmlFor="date">Date</Label>
							<Input
								id="date"
								name="date"
								type="date"
								required
								defaultValue={date}
							/>
						</div>

						<Button type="submit">
							<Search className="mr-2 h-4 w-4" />
							Search
						</Button>
					</form>
				</CardContent>
			</Card>

			<div className="mt-8 flex flex-col gap-4">
				{isLoading &&
					Array.from({ length: 3 }).map((_, i) => (
						<Card key={`skeleton-${i}`}>
							<CardContent className="flex flex-col gap-3">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-4 w-64" />
								<Skeleton className="h-4 w-32" />
							</CardContent>
						</Card>
					))}

				{hasSearchParams && !isLoading && results?.length === 0 && (
					<p className="text-center text-muted-foreground">
						No trips found for this route and date.
					</p>
				)}

				{results?.map((trip) => (
					<Link
						key={trip.id}
						to="/trips/$tripId"
						params={{ tripId: trip.id }}
						className="block transition-opacity hover:opacity-80"
					>
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
							<CardContent>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
									<div className="flex items-center gap-2">
										<MapPin className="h-4 w-4 text-muted-foreground" />
										<span>{trip.departureCity}</span>
										<ArrowRight className="h-4 w-4 text-muted-foreground" />
										<span>{trip.arrivalCity}</span>
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
										<span>{trip.availableSeats} seats</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="justify-between">
								<span className="font-semibold text-lg">
									{Number(trip.price).toFixed(2)} MAD
								</span>
								<Button variant="outline" size="sm" tabIndex={-1}>
									View Details
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
