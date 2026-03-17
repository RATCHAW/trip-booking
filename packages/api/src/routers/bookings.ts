import { ORPCError } from "@orpc/server";
import { db } from "@trip-booking/db";
import { bookingRequests, trips } from "@trip-booking/db/schema/index";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure } from "../index";

export const bookingsRouter = {
	create: publicProcedure
		.input(
			z.object({
				tripId: z.uuid(),
				fullName: z.string().min(1),
				phone: z.string().min(1),
				email: z.email(),
				seatsRequested: z.int().min(1),
			}),
		)
		.handler(async ({ input }) => {
			return await db.transaction(async (tx) => {
				const [trip] = await tx
					.select()
					.from(trips)
					.where(eq(trips.id, input.tripId))
					.for("update");

				if (!trip) {
					throw new ORPCError("NOT_FOUND", {
						message: "Trip not found",
					});
				}

				if (trip.availableSeats < input.seatsRequested) {
					throw new ORPCError("BAD_REQUEST", {
						message: `Not enough seats available. Requested ${input.seatsRequested}, but only ${trip.availableSeats} available.`,
					});
				}

				await tx
					.update(trips)
					.set({
						availableSeats: sql`${trips.availableSeats} - ${input.seatsRequested}`,
					})
					.where(eq(trips.id, input.tripId));

				const [booking] = await tx
					.insert(bookingRequests)
					.values({
						tripId: input.tripId,
						fullName: input.fullName,
						phone: input.phone,
						email: input.email,
						seatsRequested: input.seatsRequested,
					})
					.returning();

				return booking;
			});
		}),
};
