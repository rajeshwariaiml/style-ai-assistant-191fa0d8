# YojanaMitraAI – Backend (Deadline Notification Service)

A lightweight **FastAPI** service that powers the **deadline alert system**
for saved government schemes. It runs entirely locally and reads its data
from JSON files in `/dataset` and `/backend/database`. The recommendation
engine in `/ml_pipeline` is **not** touched.

---

## 1. Folder Structure

```
backend/
├── main.py                       # FastAPI app entry point
├── requirements.txt
├── README.md                     # (this file)
├── database/
│   └── saved_schemes.json        # per-user saved schemes
├── routes/
│   └── notification_routes.py    # GET /notifications
├── controllers/
│   └── notification_controller.py
└── services/
    └── notification_service.py   # core deadline logic
```

Companion folders at the project root:

```
dataset/
└── schemes.json                  # scheme_name, deadline, eligibility_rules, benefits, category
ml_pipeline/                      # UNCHANGED — recommendation engine
frontend/
└── src/services/api.js           # JS client that calls /notifications
```

---

## 2. Running locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then open: http://localhost:8000/notifications

Optional query param: `?user_email=demo@yojanamitra.ai`

---

## 3. Deadline detection logic

`services/notification_service.py` implements the entire pipeline:

1. **Load schemes catalog** – first tries `dataset/schemes.json`, falls back to
   `ml_pipeline/dataset/schemes_sample.json` so existing data is reused.
2. **Load saved schemes** – reads `backend/database/saved_schemes.json`,
   accepting either a single user record or a list of records.
3. **Resolve deadline** – uses the deadline stored on the saved entry, or
   looks it up in the schemes catalog by scheme name (case-insensitive).
4. **Compute `days_remaining`** = `deadline − today` (in days).
5. **Classify status:**

   | days_remaining | status     |
   |----------------|------------|
   | `< 0`          | `expired`  |
   | `= 0`          | `today`    |
   | `1 – 7`        | `upcoming` |
   | `> 7`          | `far`      |

---

## 4. Notification generation logic

For every saved scheme with a parseable `YYYY-MM-DD` deadline, the service
produces an alert object:

```json
{
  "scheme_name": "PM Scholarship",
  "deadline": "2026-05-01",
  "status": "upcoming",
  "days_remaining": 5,
  "message": "Deadline for PM Scholarship is in 5 days",
  "user_email": "demo@yojanamitra.ai"
}
```

Message templates:

- `expired`  → "Deadline expired for <scheme> (N day(s) ago)"
- `today`    → "Last date for <scheme> application is today"
- `1 day`    → "Last date for <scheme> application is tomorrow"
- `upcoming` → "Deadline for <scheme> is in N days"
- `far`      → "Deadline for <scheme> is in N days"

Alerts are sorted: **expired → today → upcoming → far**, and within each
bucket by `days_remaining`.

---

## 5. Saved schemes tracking

`backend/database/saved_schemes.json` is the source of truth for which
schemes a user has saved. Format:

```json
[
  {
    "user_email": "demo@yojanamitra.ai",
    "saved_schemes": [
      { "scheme_name": "PM Scholarship", "deadline": "2026-05-01" }
    ]
  }
]
```

The `deadline` on each saved entry is optional — if missing, the service
falls back to the deadline declared in `dataset/schemes.json`.

---

## 6. Notification API usage

### Endpoint

```
GET /notifications
GET /notifications?user_email=<email>
```

### cURL

```bash
curl http://localhost:8000/notifications
curl "http://localhost:8000/notifications?user_email=demo@yojanamitra.ai"
```

### Frontend (`frontend/src/services/api.js`)

```js
import { fetchNotifications } from "@/services/api";

const alerts = await fetchNotifications("demo@yojanamitra.ai");
// render `alerts` in the existing notification panel — UI unchanged
```

---

## 7. Guarantees

- ✅ Frontend UI / styling / routing unchanged
- ✅ `ml_pipeline/` unchanged
- ✅ No existing endpoints renamed or removed
- ✅ Runs fully offline / locally — no Supabase or cloud DB needed for alerts
- ✅ All source code is plain `.py` / `.json` for academic review
