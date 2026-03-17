import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../index";
import { bookingsRouter } from "./bookings";
import { tripsRouter } from "./trips";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	trips: tripsRouter,
	bookings: bookingsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
