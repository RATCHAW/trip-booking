import type { client } from "@/utils/orpc";

export type TripWithOperator = Awaited<
	ReturnType<typeof client.trips.getById>
>;
