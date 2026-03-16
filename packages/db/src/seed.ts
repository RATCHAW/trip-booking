import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import * as schema from "./schema";

dotenv.config({ path: "../../apps/web/.env" });

async function main() {
	const db = drizzle(process.env.DATABASE_URL!);

	await reset(db, schema);

	await seed(db, schema).refine((f) => ({
		operators: {
			count: 6,
			columns: {
				name: f.valuesFromArray({
					values: [
						"CTM",
						"Supratours",
						"ONCF",
						"Trans Ghazala",
						"Sat",
						"Nejma Chamal",
					],
				}),
				logo: f.valuesFromArray({
					values: [
						"https://ui-avatars.com/api/?name=CTM&background=0D8ABC&color=fff",
						"https://ui-avatars.com/api/?name=Supratours&background=E63946&color=fff",
						"https://ui-avatars.com/api/?name=ONCF&background=2A9D8F&color=fff",
						"https://ui-avatars.com/api/?name=Trans+Ghazala&background=E9C46A&color=000",
						"https://ui-avatars.com/api/?name=Sat&background=264653&color=fff",
						"https://ui-avatars.com/api/?name=Nejma+Chamal&background=F4A261&color=000",
					],
				}),
			},
		},
		trips: {
			count: 30,
			columns: {
				departureCity: f.valuesFromArray({
					values: [
						"Casablanca",
						"Rabat",
						"Marrakech",
						"Fes",
						"Tangier",
						"Agadir",
						"Oujda",
						"Meknes",
					],
				}),
				arrivalCity: f.valuesFromArray({
					values: [
						"Casablanca",
						"Rabat",
						"Marrakech",
						"Fes",
						"Tangier",
						"Agadir",
						"Oujda",
						"Meknes",
					],
				}),
				price: f.number({ minValue: 50, maxValue: 350, precision: 100 }),
				availableSeats: f.int({ minValue: 5, maxValue: 55 }),
				departureTime: f.date({
					minDate: "2026-03-16",
					maxDate: "2026-04-30",
				}),
				arrivalTime: f.date({
					minDate: "2026-03-16",
					maxDate: "2026-04-30",
				}),
			},
		},
		bookingRequests: {
			count: 0,
		},
	}));

	console.log("Seed complete!");
	process.exit(0);
}

main().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
