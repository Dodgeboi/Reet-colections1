import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedCategories = new Set(["kurtis", "lehengas", "sari", "blouses", "pants", "jewelry", "shoes"]);

function sizesFromText(text) {
  return String(text || "")
    .split(/[,.\/]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

function money(value) {
  const n = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const incoming = Array.isArray(body.products) ? body.products : [];
    if (!incoming.length) {
      return NextResponse.json({ error: "No products selected." }, { status: 400 });
    }

    const current = await readJson("products.json", []);
    const now = new Date();

    const additions = incoming.map((p, idx) => {
      const category = allowedCategories.has(p.category) ? p.category : "kurtis";
      const price = money(p.price);
      return {
        id: `RC-UP-${now.getTime()}-${idx}`,
        code: `IMP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${idx + 1}`,
        name: String(p.name || `Imported piece ${idx + 1}`).trim(),
        category,
        color: String(p.color || "").trim(),
        sizes: sizesFromText(p.sizesText),
        price,
        cost: 0,
        qty: Number(p.qty) || 1,
        status: "available",
        fabric: String(p.fabric || "").trim(),
        featured: false,
        thisWeek: true,
        newIn: true,
        clearance: false,
        image: p.image || "/images/fusion-mustard.png",
        note: String(p.note || "").trim(),
        addedBy: "admin-upload",
        source: { type: "admin-import", importedAt: now.toISOString() },
        priceFromCaption: !!price,
      };
    });

    await writeJson("products.json", [...additions, ...current]);
    return NextResponse.json({ added: additions.length, products: additions });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Approval failed" }, { status: 500 });
  }
}
