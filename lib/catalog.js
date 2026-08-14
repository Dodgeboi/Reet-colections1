// The four supplied outfits are the current catalog baseline. The release
// marker replaces the old production Blob catalog once, then normal owner
// edits continue to persist from that clean baseline.
import seedCatalog from "@/data/products.json";
import { readJson, writeJson } from "@/lib/store";

const CATALOG_RELEASE = "reet-four-outfits-v2";

function seedCopy() {
  return seedCatalog.map((product) => ({
    ...product,
    images: Array.isArray(product.images) ? [...product.images] : [],
  }));
}

export async function getCatalog() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const release = await readJson("catalog-release.json", {});
    if (release?.id !== CATALOG_RELEASE) {
      const catalog = seedCopy();
      await writeJson("products.json", catalog);
      await writeJson("catalog-release.json", { id: CATALOG_RELEASE });
      return catalog;
    }
  }

  const data = await readJson("products.json", []);
  return Array.isArray(data) ? data : seedCopy();
}
