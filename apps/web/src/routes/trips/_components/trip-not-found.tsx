import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function TripNotFound() {
	return (
		<div className="mx-auto max-w-4xl p-6">
			<Link
				to="/"
				className="mb-6 inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to search
			</Link>
			<p className="mt-8 text-center text-muted-foreground">
				Trip not found.
			</p>
		</div>
	);
}
