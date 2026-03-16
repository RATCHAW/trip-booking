import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const operators = pgTable("operators", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	logo: text(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
