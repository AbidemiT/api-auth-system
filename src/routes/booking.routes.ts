import { Router } from "express";
import { prismaClient } from "../libs";
import { authenticateToken } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";
import z from "zod";

const router = Router();

router.use(authenticateToken);

// Validation schema for booking creation
const createBookingSchema = z.object({
  resourceId: z.string().min(1, "Resource ID is required"),
  startTime: z.iso.datetime('Start time must be a valid ISO datetime string'),
  endTime: z.iso.datetime('End time must be a valid ISO datetime string'),
  notes: z.string().optional(),
});

// Create a new booking
router.post("/", asyncHandler(async (req, res) => {
  const parseResult = createBookingSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new Error("Invalid booking data");
  }

  const { resourceId, startTime, endTime, notes } = parseResult.data;
  const userId = req.user!.userId;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Calculate duration in minutes
  const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));

  if (duration < 30) {
    throw new Error("Booking duration must be at least 30 minutes");
  }

  // Get resource to calculate cost
  const resource = await prismaClient.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (!resource.isActive) {
    throw new Error("Resource is not active");
  }

  // Check if duration exceeds max allowed duration
  if (duration > resource.maxDuration) {
    throw new Error(`Booking duration exceeds maximum allowed duration of ${resource.maxDuration} minutes`);
  };

  // Calculate cost based on duration
  let totalCost: number;
  if (duration >= 480) {
    // 8 hours or more - full day rate
    totalCost = Number(resource.pricePerFullDay);
  } else if (duration >= 240) {
    // 4 hours or more - half day rate
    totalCost = Number(resource.pricePerHalfDay);
  } else {
    // Less than 4 hours - hourly rate
    const hours = duration / 60;
    totalCost = Number(resource.pricePerHour) * hours;
  }

  // Check for overlapping bookings
  const overlappingBooking = await prismaClient.booking.findFirst({
    where: {
      resourceId,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
      OR: [
        {
          // New booking starts during an existing booking
          AND: [
            { startTime: { lte: startDate } },
            { endTime: { gt: startDate } },
          ],
        }, {
          // New booking ends during an existing booking
          AND: [
            { startTime: { lt: endDate } },
            { endTime: { gte: endDate } },
          ],
        }, {
          // New booking encompasses an existing booking
          AND: [
            { startTime: { gte: startDate } },
            { endTime: { lte: endDate } },
          ],
        }
      ],
    },
  });

  if (overlappingBooking) {
    throw new Error("The resource is already booked for the selected time slot");
  }

  // Create booking
  const booking = await prismaClient.booking.create({
    data: {
      userId,
      resourceId,
      startTime: startDate,
      duration,
      endTime: endDate,
      totalPrice: totalCost,
      notes,
      status: 'PENDING',
    },
    include: {
      resource: true,
    }
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
}));

// Get bookings for the authenticated user
router.get("/", asyncHandler(async (req, res) => {
  const userId = req.user!.userId;

  const bookings = await prismaClient.booking.findMany({
    where: { userId },
    include: {
      resource: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({
    success: true,
    data: bookings,
  });
}));

// Get single booking by ID
router.get("/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const booking = await prismaClient.booking.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      resource: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  res.json({
    success: true,
    data: booking,
  });
}));

// PATCH - cancel a booking
router.patch("/:id/cancel", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const booking = await prismaClient.booking.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status === 'CANCELLED') {
    throw new Error("Booking is already cancelled");
  }

  if (booking.status === 'COMPLETED') {
    throw new Error("Completed bookings cannot be cancelled");
  }

  const updatedBooking = await prismaClient.booking.update({
    where: { id },
    data: {
      status: 'CANCELLED',
    },
    include: {
      resource: true,
    },
  });

  res.json({
    success: true,
    message: "Booking cancelled successfully",
    data: updatedBooking,
  });
}));

export default router;