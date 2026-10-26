import { Service, SERVICE_CATEGORIES } from "../models/Service.js";
import { isValidId } from "../utils/isValidId.js";

// Only these fields can be set from a request (prevents mass assignment).
const EDITABLE_FIELDS = [
  "name",
  "category",
  "unit",
  "rate",
  "durationMinutes",
  "description",
  "active",
];

function pickServiceFields(body) {
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (body?.[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
}

// GET /api/services  (optional: ?category=Plumbing)
export async function listServices(req, res) {
  const { category } = req.query;
  const filter = { active: true };

  if (category !== undefined) {
    if (!SERVICE_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    filter.category = category;
  }

  const services = await Service.find(filter).sort({ name: 1 });
  res.json(services);
}

// GET /api/services/:id
export async function getServiceById(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(404).json({ error: "Service not found" });
  }

  const service = await Service.findOne({ _id: id, active: true });

  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.json(service);
}

// GET /api/services/admin/all  (admin: includes inactive services)
export async function listAllServices(req, res) {
  const services = await Service.find().sort({ name: 1 });
  res.json(services);
}

// POST /api/services  (admin)
export async function createService(req, res) {
  const service = await Service.create(pickServiceFields(req.body));
  res.status(201).json(service);
}

// PATCH /api/services/:id  (admin)
export async function updateService(req, res) {
  const { id } = req.params;
  const service = isValidId(id) ? await Service.findById(id) : null;

  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  Object.assign(service, pickServiceFields(req.body));
  await service.save();

  res.json(service);
}

// DELETE /api/services/:id  (admin)
// Past bookings keep working because they store a snapshot of the service.
export async function deleteService(req, res) {
  const { id } = req.params;
  const service = isValidId(id) ? await Service.findByIdAndDelete(id) : null;

  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.status(204).end();
}