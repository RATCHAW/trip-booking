import { useForm } from "@tanstack/react-form";
import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@trip-booking/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@trip-booking/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@trip-booking/ui/components/field";
import { Input } from "@trip-booking/ui/components/input";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import type { TripWithOperator } from "./types";

const createBookingFormSchema = (availableSeats: number) =>
  z.object({
    fullName: z.string().trim().min(1, "Full name is required."),
    phone: z.string().trim().min(1, "Phone is required."),
    email: z
      .email("Please enter a valid email address.")
      .min(1, "Email is required."),
    seatsRequested: z
      .string()
      .trim()
      .min(1, "Seats are required.")
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
        "Request at least 1 seat.",
      )
      .refine(
        (value) => availableSeats > 0 && Number(value) <= availableSeats,
        availableSeats > 0
          ? `Only ${availableSeats} seats are available.`
          : "This trip is sold out.",
      ),
  });

interface BookingCardProps {
  trip: TripWithOperator;
  booking: UseMutationResult<
    unknown,
    Error,
    {
      tripId: string;
      fullName: string;
      phone: string;
      email: string;
      seatsRequested: number;
    }
  >;
}

export function BookingCard({ trip, booking }: BookingCardProps) {
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const bookingFormSchema = createBookingFormSchema(trip.availableSeats);

  const bookingForm = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      seatsRequested: "1",
    },
    validators: {
      onChange: bookingFormSchema,
      onSubmit: bookingFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await booking.mutateAsync({
          tripId: trip.id,
          fullName: value.fullName.trim(),
          phone: value.phone.trim(),
          email: value.email.trim(),
          seatsRequested: Number(value.seatsRequested),
        });
        setBookingSuccess(true);
      } catch {
        return;
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Trip</CardTitle>
      </CardHeader>
      {bookingSuccess ? (
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="font-semibold text-lg">Booking confirmed!</p>
          <p className="text-muted-foreground text-sm">
            Your booking has been successfully created.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setBookingSuccess(false);
              booking.reset();
              bookingForm.reset();
            }}
          >
            Book again
          </Button>
        </CardContent>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void bookingForm.handleSubmit();
          }}
        >
          <CardContent className="flex flex-col gap-4">
            <FieldGroup>
              <bookingForm.Field
                name="fullName"
                children={(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched ||
                      bookingForm.state.isSubmitted) &&
                    !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          if (booking.error) {
                            booking.reset();
                          }

                          field.handleChange(e.target.value);
                        }}
                        placeholder="John Doe"
                        autoComplete="name"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <bookingForm.Field
                name="phone"
                children={(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched ||
                      bookingForm.state.isSubmitted) &&
                    !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          if (booking.error) {
                            booking.reset();
                          }

                          field.handleChange(e.target.value);
                        }}
                        placeholder="+212 600 000000"
                        autoComplete="tel"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <bookingForm.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched ||
                      bookingForm.state.isSubmitted) &&
                    !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          if (booking.error) {
                            booking.reset();
                          }

                          field.handleChange(e.target.value);
                        }}
                        placeholder="john@example.com"
                        autoComplete="email"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <bookingForm.Field
                name="seatsRequested"
                children={(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched ||
                      bookingForm.state.isSubmitted) &&
                    !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Seats</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={1}
                        max={trip.availableSeats}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          if (booking.error) {
                            booking.reset();
                          }

                          field.handleChange(e.target.value);
                        }}
                        inputMode="numeric"
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        {trip.availableSeats > 0
                          ? `Choose up to ${trip.availableSeats} seats.`
                          : "No seats remain for this trip."}
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            {booking.error && (
              <p className="text-destructive text-sm">
                {booking.error.message}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={booking.isPending || trip.availableSeats === 0}
            >
              {booking.isPending ? "Booking..." : "Book Now"}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
