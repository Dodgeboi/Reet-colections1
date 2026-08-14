import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { writeJson } from "@/lib/store";
import { getCatalog } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCatalog());
}

// Owner replaces a single product's photo (used by in-place editing).
export async function PATCH(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, image } = await req.json();
    const ok = typeof image === "string" && (image.startsWith("/images/") || image.startsWith("/api/uploads/") || image.startsWith("https://"));
    if (!id || !ok) return NextResponse.json({ error: "Invalid product or image." }, { status: 400 });
    const catalog = await getCatalog();
    const product = catalog.find((x) => x.id === id);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    product.image = image;
    product.images = [image, ...(Array.isArray(product.images) ? product.images.slice(1) : [])].slice(0, 3);
    await writeJson("products.json", catalog);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: "Expected an array of products." }, { status: 400 });
    await writeJson("products.json", body);
    return NextResponse.json({ ok: true, count: body.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
