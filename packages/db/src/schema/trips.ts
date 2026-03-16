import { relations } from "drizzle-orm";
import {
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { bookingRequests } from "./booking-requests";
import { operators } from "./operators";

export const trips = pgTable("trips", {
	id: uuid().defaultRandom().primaryKey(),
	operatorId: uuid("operator_id")
		.notNull()
		.references(() => operators.id),
	departureCity: text("departure_city").notNull(),
	arrivalCity: text("arrival_city").notNull(),
	departureTime: timestamp("departure_time").notNull(),
	arrivalTime: timestamp("arrival_time").notNull(),
	price: numeric({ precision: 10, scale: 2 }).notNull(),
	availableSeats: integer("available_seats").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tripsRelations = relations(trips, ({ one, many }) => ({
	operator: one(operators, {
		fields: [trips.operatorId],
		references: [operators.id],
	}),
	bookingRequests: many(bookingRequests),
}));
