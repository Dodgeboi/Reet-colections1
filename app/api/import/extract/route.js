import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { saveUpload, extFromMime } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORY_HINT = "Use one category slug only: suits, anarkalis, kurtis, lehengas, sari, blouses, pants, jewelry, shoes.";

function safeJson(text) {
  const cleaned = String(text || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
  return JSON.parse(cleaned);
}

function fallbackProducts(savedImages, caption) {
  if (savedImages.length) {
    return savedImages.map((image, index) => ({
      name: `Imported product ${index + 1}`,
      category: "suits",
      color: "",
      fabric: "",
      sizesText: "",
      price: "",
      qty: 1,
      note: caption?.trim() || "Imported from admin upload. Edit details before approving.",
      image,
    }));
  }
  return [{
    name: "Imported product",
    category: "suits",
    color: "",
    fabric: "",
    sizesText: "",
    price: "",
    qty: 1,
    note: caption?.trim() || "Imported from pasted caption. Edit details before approving.",
    image: "/images/products/pink-ombre-suit-front.png",
  }];
}

async function callAnthropic({ caption, files, savedImages }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackProducts(savedImages, caption);

  const imageBlocks = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    imageBlocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: file.type || "image/jpeg",
        data: buffer.toString("base64"),
      },
    });
  }

  const prompt = `You are helping Reet Collections, an Indian ethnic-wear boutique, convert uploaded product photos/captions into store products.
Return ONLY valid JSON array. No markdown.
Each product object must have: name, category, color, fabric, sizesText, price, qty, note, imageIndex.
imageIndex is the zero-based uploaded image number that best matches the product. If uncertain, use the same index as product order.
${CATEGORY_HINT}
Prices are USD numbers only. If no price is visible, use an empty string.
Sizes should be a comma-separated string. If no size is visible, use empty string.
Keep names short and sale-friendly, like "Ajrak Print Shirt" or "Red Cord Set".
Caption/notes:\n${caption || ""}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1800,
      temperature: 0.1,
      messages: [{
        role: "user",
        content: [
          ...imageBlocks,
          { type: "text", text: prompt },
        ],
      }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic extraction failed: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.content?.find((c) => c.type === "text")?.text || "[]";
  const parsed = safeJson(text);
  const list = Array.isArray(parsed) ? parsed : [];

  return list.map((p, idx) => {
    const imageIndex = Number.isInteger(p.imageIndex) ? p.imageIndex : idx;
    return {
      name: p.name || `Imported product ${idx + 1}`,
      category: p.category || "suits",
      color: p.color || "",
      fabric: p.fabric || "",
      sizesText: p.sizesText || "",
      price: p.price ?? "",
      qty: p.qty || 1,
      note: p.note || "",
      image: savedImages[imageIndex] || savedImages[idx] || "/images/products/pink-ombre-suit-front.png",
    };
  });
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const caption = String(form.get("caption") || "");
    const files = form.getAll("images").filter((f) => f && typeof f.arrayBuffer === "function");

    const savedImages = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = extFromMime(file.type);
      const name = `import-${Date.now()}-${i}.${ext}`;
      savedImages.push(await saveUpload(buffer, name, file.type || "image/jpeg"));
    }

    const products = await callAnthropic({ caption, files, savedImages });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Import failed" }, { status: 500 });
  }
}
