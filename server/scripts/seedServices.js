import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Service } from "../src/models/Service.js";

// Fake demo services for a home-repair business. No real personal data.
const services = [
  {
    name: "Leaky Faucet Repair",
    category: "Plumbing",
    unit: "flat",
    rate: 125,
    durationMinutes: 60,
    description:
      "Fix a dripping or leaking kitchen or bathroom faucet. Includes replacing worn washers, O-rings, or cartridges.",
  },
  {
    name: "Toilet Repair",
    category: "Plumbing",
    unit: "flat",
    rate: 150,
    durationMinutes: 60,
    description:
      "Fix a running, weak-flushing, or leaking toilet. Includes replacing the flapper, fill valve, or wax ring.",
  },
  {
    name: "Drywall Patch",
    category: "Drywall & Painting",
    unit: "flat",
    rate: 180,
    durationMinutes: 120,
    description:
      "Patch holes or cracks up to 12 inches. Includes taping, mudding, sanding, and primer so it's ready to paint.",
  },
  {
    name: "Tub & Shower Recaulking",
    category: "Plumbing",
    unit: "flat",
    rate: 140,
    durationMinutes: 90,
    description:
      "Remove old, cracked, or moldy caulk and apply fresh mildew-resistant silicone around a tub or shower.",
  },
  {
    name: "Light Fixture Install",
    category: "Electrical",
    unit: "flat",
    rate: 120,
    durationMinutes: 60,
    description:
      "Replace an existing ceiling or wall light fixture with a new one you provide. Uses the existing wiring and box.",
  },
  {
    name: "General Handyman Labor",
    category: "General Handyman",
    unit: "hr",
    rate: 75,
    durationMinutes: 120,
    description:
      "Hourly help for small jobs around the house: hanging shelves, assembling furniture, minor fixes, and more.",
  },
  {
    name: "Ceiling Fan Install",
    category: "Electrical",
    unit: "flat",
    rate: 175,
    durationMinutes: 90,
    description:
      "Install a ceiling fan you provide in place of an existing light fixture, using the existing wiring.",
  },
  {
    name: "Interior Painting",
    category: "Drywall & Painting",
    unit: "hr",
    rate: 65,
    durationMinutes: 240,
    description:
      "Paint interior walls, trim, or doors. Includes prep, taping, and cleanup. Customer provides the paint color.",
  },
  {
    name: "Door Repair & Adjustment",
    category: "Carpentry",
    unit: "flat",
    rate: 110,
    durationMinutes: 60,
    description:
      "Fix a sticking, squeaking, or misaligned door. Includes tightening hinges, adjusting the strike plate, and planing.",
  },
  {
    name: "TV Wall Mount",
    category: "Carpentry",
    unit: "flat",
    rate: 130,
    durationMinutes: 60,
    description:
      "Mount a TV up to 75 inches on drywall into studs using a mount you provide. Includes leveling and cable tidy-up.",
  },
];

async function seed() {
  await connectDB();

  let created = 0;
  let updated = 0;

  for (const data of services) {
    const result = await Service.updateOne(
      { name: data.name },
      { $set: data },
      { upsert: true, runValidators: true }
    );

    if (result.upsertedCount > 0) {
      created += 1;
    } else {
      updated += 1;
    }
  }

  const total = await Service.countDocuments();
  console.log(`Seed complete: ${created} created, ${updated} updated, ${total} total services.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });