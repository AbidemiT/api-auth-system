import { Router } from "express";
import { prismaClient } from "../libs";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

// Get all resources
router.get("/", asyncHandler(async (req, res) => {
  const resources = await prismaClient.resource.findMany({
    where: { isActive: true },
    include: { availability: true },
    orderBy: { type: 'asc' }
  });
  res.json({
    success: true,
    data: resources,
  });
}));

// Get resource by ID
router.get("/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resource = await prismaClient.resource.findUnique({
    where: { id },
    include: { availability: true },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  res.json({
    success: true,
    data: resource,
  });
}));

// Check resource availability for a given date
router.get("/:id/availability", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  if (!date || typeof date !== 'string') {
    throw new Error("Date query parameter is required");
  }

  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay(); // Adjust for Sunday being 0

  // Get resource with availability
  const resource = await prismaClient.resource.findUnique({
    where: { id },
    include: {
      availability: {
        where: {
          dayOfWeek
        }
      }
    },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.availability.length === 0) {
    return res.json({
      success: true,
      data: {
        isAvailable: false,
        message: "Resource is not available on the selected date",
      },
    });
  }

  // Get existing bookings for the resource on the selected date
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await prismaClient.booking.findMany({
    where: {
      resourceId: id,
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { startTime: 'asc' }
  });


  res.json({
    success: true,
    data: {
      isAvailable: true,
      operatingHours: resource.availability[0],
      bookedSlots: existingBookings.map((booking) => ({
        startTime: booking.startTime,
        endTime: booking.endTime,
      }))
    },
  });
}));

export default router;