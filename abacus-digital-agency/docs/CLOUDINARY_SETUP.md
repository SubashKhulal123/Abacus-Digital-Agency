# Cloudinary Setup

Cloudinary stores every uploaded image and file: developer avatars,
project thumbnails/galleries, service cover images, blog covers, client
logos, resumes, and the general Media Library.

## 1. Create a free account
Go to [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free).
The free tier (25GB storage, 25GB monthly bandwidth) comfortably covers
a launch-stage agency site.

## 2. Get your credentials
1. After signup you land on the **Dashboard** — your credentials are
   right at the top:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "reveal" to see it)
2. Copy each into `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your-secret-here
   ```

**Never** put the API Secret in frontend code or a `VITE_`-prefixed
variable — it's backend-only by design in this project (all uploads are
proxied through the backend, which is the correct pattern; the frontend
never talks to Cloudinary directly).

## 3. How this project uses Cloudinary

Every upload flows the same way: browser → backend (Multer, in-memory
buffer, never touches disk) → Cloudinary (via `uploadToCloudinary()` in
`backend/src/utils/cloudinaryUpload.js`) → the resulting `{ url,
publicId }` gets saved on the relevant MongoDB document. Uploads are
organized into folders automatically:

| Folder | Used by |
|---|---|
| `abacus-digital-agency/developers` | Team member avatars |
| `abacus-digital-agency/projects` | Project thumbnails |
| `abacus-digital-agency/projects/gallery` | Project gallery images |
| `abacus-digital-agency/services` | Service cover images |
| `abacus-digital-agency/blogs` | Blog cover images |
| `abacus-digital-agency/clients` | Client logos |
| `abacus-digital-agency/testimonials` | Client avatars |
| `abacus-digital-agency/career-applications` | Resumes (raw files) |
| `abacus-digital-agency/site-settings` | Logo, dark logo, favicon |
| `abacus-digital-agency/media-library` | General Media Library uploads |

## 4. Verify it works
1. Start the backend and frontend, log into `/admin/login`.
2. Go to **Media Library → Upload Files**, pick any image.
3. If it appears in the grid, Cloudinary is correctly configured. If you
   get a 401/403 error, double-check the three credential values for
   typos (a common mistake: copying a trailing space along with the API
   Secret).

## 5. Image delivery optimization (already built in)
Every image rendered on the public site goes through
`frontend/src/utils/imageOptimization.js`, which appends Cloudinary
transformation parameters (`f_auto,q_auto,w_<size>`) to the URL — visitors
automatically get WebP/AVIF where their browser supports it, sized
appropriately, with zero extra configuration needed on your end.

## 6. Production considerations
- **Signed uploads only**: this project always uploads via the
  authenticated backend (never unsigned client-side uploads), so there's
  no risk of anonymous abuse of your Cloudinary quota — the
  `imageUpload`/`multiImageUpload`/`documentUpload` Multer middlewares
  also enforce file-type and size limits before anything reaches
  Cloudinary at all.
- **Quota monitoring**: Cloudinary's dashboard shows usage against your
  plan's limits in real time — worth a glance monthly.
- **Deleting orphaned assets**: the Media Library's delete action removes
  both the MongoDB record and the Cloudinary asset together
  (`deleteFromCloudinary`), so there's no manual cleanup needed for files
  deleted through the admin UI.
