import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import * as schema from "./schema";
import { operators, trips } from "./schema";

dotenv.config({ path: "../../apps/web/.env" });

const OPERATOR_SEED: Array<{ name: string; logo: string }> = [
	{
		name: "CTM",
		logo: "https://ui-avatars.com/api/?name=CTM&background=0D8ABC&color=fff",
	},
	{
		name: "Supratours",
		logo: "https://ui-avatars.com/api/?name=Supratours&background=E63946&color=fff",
	},
	{
		name: "ONCF",
		logo: "https://ui-avatars.com/api/?name=ONCF&background=2A9D8F&color=fff",
	},
	{
		name: "Trans Ghazala",
		logo: "https://ui-avatars.com/api/?name=Trans+Ghazala&background=E9C46A&color=000",
	},
	{
		name: "Sat",
		logo: "https://ui-avatars.com/api/?name=Sat&background=264653&color=fff",
	},
	{
		name: "Nejma Chamal",
		logo: "https://ui-avatars.com/api/?name=Nejma+Chamal&background=F4A261&color=000",
	},
];

const CITIES = [
	"Casablanca",
	"Rabat",
	"Marrakech",
	"Fes",
	"Tangier",
	"Agadir",
	"Oujda",
	"Meknes",
] as const;

const GUARANTEED_ROUTES: Array<{
	departureCity: string;
	arrivalCity: string;
	date: string;
}> = [
	{ departureCity: "Tangier", arrivalCity: "Casablanca", date: "2026-03-17" },
	{ departureCity: "Casablanca", arrivalCity: "Rabat", date: "2026-03-17" },
	{ departureCity: "Marrakech", arrivalCity: "Agadir", date: "2026-03-18" },
	{ departureCity: "Fes", arrivalCity: "Tangier", date: "2026-03-19" },
	{ departureCity: "Rabat", arrivalCity: "Oujda", date: "2026-03-20" },
	{ departureCity: "Agadir", arrivalCity: "Marrakech", date: "2026-03-21" },
];

function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(values: readonly T[]) {
	return values[randomInt(0, values.length - 1)]!;
}

function buildDepartureTime(date: string) {
	const departureTime = new Date(`${date}T00:00:00.000Z`);
	departureTime.setUTCHours(randomInt(6, 21), randomChoice([0, 15, 30, 45]), 0, 0);
	return departureTime;
}

function buildTrip(
	operatorId: string,
	departureCity: string,
	arrivalCity: string,
	date: string,
) {
	const departureTime = buildDepartureTime(date);
	const durationMinutes = randomInt(90, 480);
	const arrivalTime = new Date(departureTime.getTime() + durationMinutes * 60 * 1000);

	return {
		operatorId,
		departureCity,
		arrivalCity,
		departureTime,
		arrivalTime,
		price: (randomInt(5000, 35000) / 100).toFixed(2),
		availableSeats: randomInt(5, 55),
	};
}

function buildRandomRoute(date: string) {
	const departureCity = randomChoice(CITIES);
	const arrivalOptions = CITIES.filter((city) => city !== departureCity);
	const arrivalCity = randomChoice(arrivalOptions);

	return { departureCity, arrivalCity, date };
}

async function main() {
	const db = drizzle(process.env.DATABASE_URL!);

	await reset(db, schema);

	const insertedOperators = await db
		.insert(operators)
		.values(OPERATOR_SEED)
		.returning({ id: operators.id });

	const operatorIds = insertedOperators.map((operator) => operator.id);
	const tripRoutes = [...GUARANTEED_ROUTES];

	while (tripRoutes.length < 30) {
		const day = randomInt(16, 30);
		tripRoutes.push(buildRandomRoute(`2026-03-${String(day).padStart(2, "0")}`));
	}

	const seededTrips = tripRoutes.map((route, index) =>
		buildTrip(
			operatorIds[index % operatorIds.length]!,
			route.departureCity,
			route.arrivalCity,
			route.date,
		),
	);

	await db.insert(trips).values(seededTrips);

	console.log("Seed complete!");
	process.exit(0);
}

main().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
