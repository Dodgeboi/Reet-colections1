# Reet Collections Admin Upload Import

This adds a Facebook-free import workflow:

1. Start the storefront:
   ```powershell
   cd C:\Users\naman\downloads\reet-collections-admin-import\reet-collections
   npm install
   npm run dev
   ```

2. Add your Anthropic key in `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-new-key
   ANTHROPIC_MODEL=claude-haiku-4-5-20251001
   ```

3. Open:
   ```text
   http://localhost:3000/admin/import
   ```

4. Upload photos from your mom's phone or paste a Facebook/WhatsApp caption.

5. Click **Extract products**.

6. Edit title/category/price/sizes/description.

7. Click **Approve**. Approved products are prepended to `data/products.json` and show in the shop.

Important: this file-based save works well locally. On Vercel, files do not persist after deployment, so the next production step should be Supabase.
