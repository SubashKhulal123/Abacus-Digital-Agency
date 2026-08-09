# Abacus Digital Agency — API Endpoint Planning

Base URL: `/api/v1`
All request/response bodies are JSON. All list endpoints support `?page=&limit=&sort=` query params and return a `meta` object with pagination info. Protected routes require a valid JWT (httpOnly cookie or `Authorization: Bearer` header).

Legend: 🔓 Public · 🔒 Admin (JWT) · 👑 Super Admin only

---

## SEO & Search — root-level and public (✅ implemented in Phase 4)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/sitemap.xml` | 🔓 | Dynamically generated from published content (root-level, not under `/api/v1`) |
| GET | `/robots.txt` | 🔓 | Root-level, points to the sitemap |
| GET | `/api/v1/search?q=` | 🔓 | Global search across projects, blogs, services, developers |

## Auth — `/auth`  (✅ implemented in Phase 1)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | 🔓 | Admin login, returns JWT cookie + token |
| POST | `/auth/logout` | 🔒 | Clears auth cookie |
| GET | `/auth/me` | 🔒 | Returns current authenticated admin |
| PATCH | `/auth/profile` | 🔒 | Update name/email |
| PATCH | `/auth/change-password` | 🔒 | Change password |

## Developers — `/developers`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/developers` | 🔓 | List active team members |
| GET | `/developers/:slug` | 🔓 | Single developer profile |
| POST | `/developers` | 🔒 | Create developer |
| PATCH | `/developers/:id` | 🔒 | Update developer |
| DELETE | `/developers/:id` | 🔒 | Delete developer |
| PATCH | `/developers/reorder` | 🔒 | Bulk reorder |

## Projects (Portfolio) — `/projects`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/projects` | 🔓 | List published projects (filter by category, tech, featured) |
| GET | `/projects/:slug` | 🔓 | Single project (increments views) |
| POST | `/projects` | 🔒 | Create project |
| PATCH | `/projects/:id` | 🔒 | Update project |
| DELETE | `/projects/:id` | 🔒 | Delete project |
| PATCH | `/projects/:id/status` | 🔒 | Publish/unpublish/archive |
| GET | `/projects/admin/all` | 🔒 | All projects incl. drafts (admin table) |

## Services — `/services`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/services` | 🔓 | List active services |
| GET | `/services/:slug` | 🔓 | Single service detail |
| POST | `/services` | 🔒 | Create service |
| PATCH | `/services/:id` | 🔒 | Update service |
| DELETE | `/services/:id` | 🔒 | Delete service |

## Testimonials — `/testimonials`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/testimonials` | 🔓 | List active testimonials |
| POST | `/testimonials` | 🔒 | Create |
| PATCH | `/testimonials/:id` | 🔒 | Update |
| DELETE | `/testimonials/:id` | 🔒 | Delete |

## Blogs — `/blogs`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/blogs` | 🔓 | List published posts (filter by category/tag/search) |
| GET | `/blogs/:slug` | 🔓 | Single post (increments views) |
| POST | `/blogs/:id/like` | 🔓 | Like a post |
| POST | `/blogs` | 🔒 | Create post |
| PATCH | `/blogs/:id` | 🔒 | Update post |
| DELETE | `/blogs/:id` | 🔒 | Delete post |
| GET | `/blogs/admin/all` | 🔒 | All posts incl. drafts |

## Categories — `/categories`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories?type=blog|project` | 🔓 | List categories by type |
| POST | `/categories` | 🔒 | Create |
| PATCH | `/categories/:id` | 🔒 | Update |
| DELETE | `/categories/:id` | 🔒 | Delete |

## Technologies — `/technologies`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/technologies` | 🔓 | List all (filter by category) |
| POST | `/technologies` | 🔒 | Create |
| PATCH | `/technologies/:id` | 🔒 | Update |
| DELETE | `/technologies/:id` | 🔒 | Delete |

## Clients — `/clients`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/clients` | 🔓 | List active client logos |
| POST | `/clients` | 🔒 | Create |
| PATCH | `/clients/:id` | 🔒 | Update |
| DELETE | `/clients/:id` | 🔒 | Delete |

## Contact — `/contact`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/contact` | 🔓 | Submit contact form (rate-limited, sends admin + auto-reply emails) |
| GET | `/contact` | 🔒 | List messages (filter by status) |
| GET | `/contact/:id` | 🔒 | Single message |
| PATCH | `/contact/:id/status` | 🔒 | Update status (read/replied/archived) |
| DELETE | `/contact/:id` | 🔒 | Delete message |

## Newsletter — `/newsletter`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/newsletter/subscribe` | 🔓 | Subscribe (rate-limited) |
| GET | `/newsletter/unsubscribe/:token` | 🔓 | Unsubscribe via emailed link |
| GET | `/newsletter` | 🔒 | List subscribers |
| DELETE | `/newsletter/:id` | 🔒 | Remove subscriber |

## Job Posts — `/careers/jobs`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/careers/jobs` | 🔓 | List active openings |
| GET | `/careers/jobs/:slug` | 🔓 | Single job post |
| POST | `/careers/jobs` | 🔒 | Create |
| PATCH | `/careers/jobs/:id` | 🔒 | Update |
| DELETE | `/careers/jobs/:id` | 🔒 | Delete |

## Career Applications — `/careers/applications`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/careers/applications` | 🔓 | Apply (multipart: resume upload, rate-limited) |
| GET | `/careers/applications` | 🔒 | List applications (filter by job/status) |
| GET | `/careers/applications/:id` | 🔒 | Single application |
| PATCH | `/careers/applications/:id/status` | 🔒 | Update status |
| DELETE | `/careers/applications/:id` | 🔒 | Delete |

## FAQs — `/faqs`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/faqs` | 🔓 | List active FAQs (filter by category) |
| POST | `/faqs` | 🔒 | Create |
| PATCH | `/faqs/:id` | 🔒 | Update |
| DELETE | `/faqs/:id` | 🔒 | Delete |

## Statistics — `/statistics`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/statistics` | 🔓 | List active homepage stats |
| POST | `/statistics` | 🔒 | Create |
| PATCH | `/statistics/:id` | 🔒 | Update |
| DELETE | `/statistics/:id` | 🔒 | Delete |

## Media Library — `/media`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/media` | 🔒 | List uploaded assets (filter by folder/type) |
| POST | `/media/upload` | 🔒 | Upload image/document to Cloudinary |
| DELETE | `/media/:id` | 🔒 | Delete asset (Cloudinary + DB record) |

## Site Settings — `/settings`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/settings` | 🔓 | Public site config (branding, SEO, theme defaults, socials) |
| PATCH | `/settings` | 👑 | Update site settings (singleton upsert) |

---

## Admin API — `/admin/*`  (✅ implemented in Phase 3, all require `protect` + editor/admin/super-admin role)

Every resource below follows the same pattern: `GET /` (list, all records incl. drafts/inactive, search+sort+paginate via `?search=&sort=&page=&limit=`), `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`, `DELETE /bulk` (body: `{ ids: [] }`). Resources with file uploads accept `multipart/form-data`.

| Resource | Base path | Notes |
|---|---|---|
| Dashboard | `GET /admin/dashboard` | Aggregate counts, recent activity, top content, placeholder traffic/revenue charts |
| Developers | `/admin/developers` | Avatar upload |
| Projects | `/admin/projects` | Thumbnail + multi-image gallery upload |
| Services | `/admin/services` | Cover image upload |
| Blogs | `/admin/blogs` | Cover image upload, rich-text content, draft/published |
| Testimonials | `/admin/testimonials` | Client avatar upload |
| Clients | `/admin/clients` | Logo upload |
| Technologies | `/admin/technologies` | |
| Categories | `/admin/categories` | |
| FAQs | `/admin/faqs` | |
| Statistics | `/admin/statistics` | |
| Job Posts | `/admin/jobs` | |
| Career Applications | `/admin/applications` | No create (public-submitted); `PATCH /:id/status` (+ optional applicant email), `GET /export` (CSV) |
| Contact Messages | `/admin/messages` | No create; `PATCH /:id/status`, `POST /:id/reply` (sends real email), `GET /export` (CSV) |
| Newsletter | `/admin/newsletter` | No create/update; `GET /export` (CSV), `POST /import` (CSV upload) |
| Media Library | `/admin/media` | `POST /` uploads to Cloudinary + tracks in DB, no update |
| Settings | `/admin/settings` | Full settings doc; `POST /upload/:field` for logo/favicon; `GET /env-config` (masked SMTP/Cloudinary status) |
| Audit Logs | `GET /admin/audit-logs` | Read-only trail of every admin mutation |
| Notifications | `/admin/notifications` | `PATCH /:id/read`, `PATCH /read-all` |
| Backup | `GET /admin/backup` | 👑 only — downloads a full JSON content export |
| Logs | `GET /admin/logs?lines=&level=` | Tails the local application log file |

### Two-Factor (scaffold) — `/auth/2fa/*`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/2fa/enable` | Generates secret + backup codes, sets `isEnabled: true` |
| POST | `/auth/2fa/disable` | Requires current password |



### Response shape (success)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human readable message",
  "data": { },
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

### Response shape (error)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Please provide a valid email address" }]
}
```
