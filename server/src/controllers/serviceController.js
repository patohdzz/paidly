import { Service, SERVICE_CATEGORIES } from "../models/Service.js";
import { isValidId } from "../utils/isValidId.js";

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