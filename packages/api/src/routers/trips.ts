import { ORPCError } from "@orpc/server";
import { db } from "@trip-booking/db";
import { operators, trips } from "@trip-booking/db/schema/index";
import { and, between, eq } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure } from "../index";

export const tripsRouter = {
  search: publicProcedure
    .input(
      z.object({
        departureCity: z.string().min(1),
        arrivalCity: z.string().min(1),
        date: z.iso.date(),
      }),
    )
    .handler(async ({ input }) => {
      const startOfDay = new Date(`${input.date}T00:00:00`);
      const endOfDay = new Date(`${input.date}T23:59:59.999`);

      const results = await db
        .select()
        .from(trips)
        .innerJoin(operators, eq(trips.operatorId, operators.id))
        .where(
          and(
            eq(trips.departureCity, input.departureCity),
            eq(trips.arrivalCity, input.arrivalCity),
            between(trips.departureTime, startOfDay, endOfDay),
          ),
        )
        .orderBy(trips.departureTime);

      return results.map((row) => ({
        ...row.trips,
        operator: row.operators,
      }));
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .handler(async ({ input }) => {
      const trip = await db.query.trips.findFirst({
        where: eq(trips.id, input.id),
        with: { operator: true },
      });

      if (!trip) {
        throw new ORPCError("NOT_FOUND", { message: "Trip not found" });
      }

      return trip;
    }),
};
