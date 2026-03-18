import {
	Card,
	CardContent,
} from "@trip-booking/ui/components/card";
import { Skeleton } from "@trip-booking/ui/components/skeleton";

export function TripDetailsSkeleton() {
	return (
		<div className="mx-auto max-w-4xl p-6">
			<Skeleton className="mb-6 h-5 w-32" />
			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardContent className="flex flex-col gap-4">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
						<Skeleton className="h-4 w-56" />
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-8 w-32" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex flex-col gap-4">
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
