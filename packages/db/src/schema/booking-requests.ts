import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { trips } from "./trips";

export const bookingRequests = pgTable("booking_requests", {
	id: uuid().defaultRandom().primaryKey(),
	tripId: uuid("trip_id")
		.notNull()
		.references(() => trips.id),
	fullName: text("full_name").notNull(),
	phone: text().notNull(),
	email: text().notNull(),
	seatsRequested: integer("seats_requested").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookingRequestsRelations = relations(
	bookingRequests,
	({ one }) => ({
		trip: one(trips, {
			fields: [bookingRequests.tripId],
			references: [trips.id],
		}),
	}),
);
