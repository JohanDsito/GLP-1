-- ============================================================================
-- Expanded GLP-1 side-effect library: 5 categories + severity hierarchy.
-- Content itself lives in the i18n modules; this only seeds codes/metadata.
-- ============================================================================

-- Drop the old two-value category check so we can re-categorize existing rows.
alter table public.symptoms drop constraint if exists symptoms_category_check;

-- Severity flag to visually separate emergencies from routine effects.
alter table public.symptoms
  add column if not exists severity text not null default 'routine';

-- Reseed / upsert the full library (order = global display order).
insert into public.symptoms (code, display_name, category, severity, review_status, display_order)
values
  -- Section 1 — Gastrointestinal
  ('nausea', 'Nausea', 'gastrointestinal', 'routine', 'draft', 1),
  ('vomiting', 'Vomiting', 'gastrointestinal', 'routine', 'draft', 2),
  ('diarrhea', 'Diarrhea', 'gastrointestinal', 'routine', 'draft', 3),
  ('constipation', 'Constipation', 'gastrointestinal', 'routine', 'draft', 4),
  ('reflux', 'Reflux / heartburn', 'gastrointestinal', 'routine', 'draft', 5),
  ('sulfurBurps', 'Sulfur burps', 'gastrointestinal', 'routine', 'draft', 6),
  ('bloatingGas', 'Bloating and gas', 'gastrointestinal', 'routine', 'draft', 7),
  ('dehydration', 'Dehydration', 'gastrointestinal', 'routine', 'draft', 8),
  -- Section 2 — Systemic and cosmetic
  ('fatigue', 'Extreme fatigue', 'systemic', 'routine', 'draft', 9),
  ('hairLoss', 'Hair loss', 'systemic', 'routine', 'draft', 10),
  ('facialAging', 'Facial volume loss', 'systemic', 'routine', 'draft', 11),
  ('looseSkin', 'Loose skin', 'systemic', 'routine', 'draft', 12),
  ('glutealLoss', 'Loss of glutes and curves', 'systemic', 'routine', 'draft', 13),
  ('muscleLoss', 'Muscle loss', 'systemic', 'routine', 'draft', 14),
  ('headache', 'Headache', 'systemic', 'routine', 'draft', 15),
  -- Section 3 — Genitourinary, sexual and hormonal
  ('vulvarVolume', 'Vulvar volume loss', 'genitourinary', 'routine', 'draft', 16),
  ('vaginalDryness', 'Vaginal dryness', 'genitourinary', 'routine', 'draft', 17),
  ('libidoLoss', 'Low libido', 'genitourinary', 'routine', 'draft', 18),
  ('anorgasmia', 'Difficulty reaching orgasm', 'genitourinary', 'routine', 'draft', 19),
  ('menstrualChanges', 'Menstrual changes', 'genitourinary', 'routine', 'draft', 20),
  ('chillsHotFlashes', 'Chills / hot flashes', 'genitourinary', 'routine', 'draft', 21),
  ('vividDreams', 'Vivid dreams', 'genitourinary', 'routine', 'draft', 22),
  -- Section 4 — Serious complications
  ('gastroparesis', 'Gastroparesis / ileus', 'serious', 'emergency', 'draft', 23),
  ('injectionSite', 'Injection site pain', 'serious', 'routine', 'draft', 24),
  ('hypoglycemia', 'Low blood sugar (emergency)', 'serious', 'emergency', 'draft', 25),
  -- Section 5 — Psychological
  ('moodSwings', 'Mood swings', 'psychological', 'routine', 'draft', 26),
  ('anxiety', 'Anxiety', 'psychological', 'routine', 'draft', 27),
  ('lowMotivation', 'Low motivation / apathy', 'psychological', 'routine', 'draft', 28),
  ('insomnia', 'Insomnia', 'psychological', 'routine', 'draft', 29),
  ('foodRelationship', 'Altered relationship with food', 'psychological', 'routine', 'draft', 30)
on conflict (code) do update set
  category = excluded.category,
  severity = excluded.severity,
  display_order = excluded.display_order;

-- Re-add the constraints now that every row uses a valid new category/severity.
alter table public.symptoms drop constraint if exists symptoms_severity_check;
alter table public.symptoms
  add constraint symptoms_severity_check check (severity in ('routine', 'emergency'));

alter table public.symptoms
  add constraint symptoms_category_check
  check (category in ('gastrointestinal', 'systemic', 'genitourinary', 'serious', 'psychological'));
