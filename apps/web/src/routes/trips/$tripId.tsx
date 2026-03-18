import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { orpc } from "@/utils/orpc";
import { BookingCard } from "./_components/booking-card";
import { TripDetailsSkeleton } from "./_components/trip-details-skeleton";
import { TripInfoCard } from "./_components/trip-info-card";
import { TripNotFound } from "./_components/trip-not-found";
import { toast } from "sonner";

export const Route = createFileRoute("/trips/$tripId")({
  component: TripDetailsComponent,
});

function TripDetailsComponent() {
  const { tripId } = Route.useParams();
  const queryClient = useQueryClient();

  const {
    data: trip,
    isLoading,
    error,
  } = useQuery(orpc.trips.getById.queryOptions({ input: { id: tripId } }));

  const booking = useMutation({
    ...orpc.bookings.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        orpc.trips.getById.queryOptions({ input: { id: tripId } }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <TripDetailsSkeleton />;
  }

  if (error || !trip) {
    return <TripNotFound />;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <TripInfoCard trip={trip} />
        <BookingCard trip={trip} booking={booking} />
      </div>
    </div>
  );
}
