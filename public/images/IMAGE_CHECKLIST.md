# Client Image Checklist — Replace these image slots

Place images in **this exact folder**: `public/images/`.
Use the **exact filenames** below (case sensitive). After adding images, run `npm run build` again and redeploy `dist/`.

| Filename | Used in section | Recommended size / shape | Original source reference |
| --- | --- | --- | --- |
| `hero-main.jpg` | First hero / main image | 1200×1300 portrait-ish | `indexss_files/download-1-1024x687.jpg` (original source may be landscape; adjust your chosen output) |
| `home-service.jpg` | Home Service Model | 1200×1050 landscape | Original image near “Home Service Model” |
| `ebook-benefits.jpg` | What's inside the e-book | 1200×1050 landscape | Original image near guide benefits |
| `story-rahul.jpg` | Rahul testimonial | 900×600 landscape | Original story image near RAHUL |
| `story-amit.jpg` | Amit testimonial | 900×600 landscape | Original story image near AMIT |
| `story-sanjay.jpg` | Sanjay testimonial | 900×600 landscape | Original story image near SANJAY |
| `ebook-bundle.png` | Main 4-PDF product showcase | 1300×1000, ideally transparent PNG | `indexss_files/ChatGPT-Image-Feb-3-2026-03_23_44-PM-1024x683.png` |
| `author-manish.jpg` | Dr Manish Srivastava profile | 1000×1100 portrait | `indexss_files/ChatGPT-Image-Feb-3-2026-04_24_48-PM.png` |

If an image is missing, the webpage shows a styled placeholder identifying the exact filename. The image slots are **not real client photos** until you supply the approved originals.

## How to add images
1. Copy your approved files into `public/images/`.
2. Rename them to exactly match the list above.
3. `npm run dev` to preview.
4. `npm run build` to update `dist/`.
5. `npx netlify deploy --dir=dist` to test, then `npx netlify deploy --prod --dir=dist` for production.

Extra original screenshots or illustrations can also go here. To place additional originals in the page, add a matching `<Photo name="your-image.jpg" alt="..." />` in `src/App.jsx`.
