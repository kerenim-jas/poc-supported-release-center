# JFrog Platform Design Tokens — extracted from Figma Live Assessment

Source: Figma file `cjzhDLB2uHfmtVNCCiQPaH` (Live Assessment), canvas `11438:5490` (Wiz Integration 26.4.26), via Figma MCP `get_variable_defs` on 2026-05-20.

These are the **authoritative** JFrog Platform design tokens. The POC at `poc-supported-release-center` should match these exactly.

---

## Color tokens

### Text

| Token | Hex |
|---|---|
| `text/primary` | `#414857` |
| `text/secondary` | `#5e6d81` |
| `text/tertiary` | `#999db4` |
| `text/active` | `#415980` |
| `text/brand-success` | `#3eb065` |
| `text/inverse-primary` | `#ffffff` |
| `text/primary-inverse` | `#ffffff` |
| `text/disabled` (semantic mapping suggested) | `#c9d0e3` |

Aliases referencing the same values:
- `semantic/text/primary` = `#414857`
- `semantic/text/secondary` = `#556274`
- `semantic/text/tertiary` = `#999DB4`
- `Netural/Black Coral` = `#556274`
- `Text` / `Text / santas-gray` (legacy) = `#414857` / `#999DB4`

### Icon

| Token | Hex |
|---|---|
| `icon/primary` | `#414857` |
| `icon/secondary` | `#5e6d81` |
| `icon/tertiary` | `#999db4` |
| `icon/disabled` | `#c9d0e3` |
| `icon/primary-inverse` | `#ffffff` |
| `icon/secondary-inverse` | `#eaeef5` |
| `icon/tertiary-inverse` | `#b4bacc` |
| `icon/inverse-primary` | `#ffffff` |

### Surface / background

| Token | Hex |
|---|---|
| `surface/primary` | `#ffffff` |
| `surface/secondary` | `#f8fafb` |
| `surface/primary-inverse` (sidebar bg) | `#1f2f4a` |
| `surface/quaternary-inverse` | `#2d4264` |
| `surface/inverse-primary` | `#1f2f4a` |
| `surface/inverse-secondary` | `#152033` |
| `surface/screen-overlay` (modal scrim) | `#41485766` |
| `background/plain` (page bg) | `#eaeef5` |
| `background/inverse` | `#ffffff` |
| `background/brand-primary` (JFrog green) | `#3eb065` |
| `background/brand-secondary` (success bg) | `#d9fad2` |
| `background/danger-secondary` (error bg) | `#fedcde` |

### Border

| Token | Hex |
|---|---|
| `border/primary` | `#eaeef5` |
| `border/secondary` | `#c9d0e3` |
| `border/quaternary` | `#b4bacc` |
| `border/active-primary` | `#415980` |
| `border/active-secondary` | `#3eb065` |
| `border/secondary-inverse` | `#708cb2` |

### Brand / palette

| Token | Hex |
|---|---|
| `green/500` (JFrog brand green) | `#3eb065` |
| `green/300` | `#9ee29e` |
| `global/green-brand/500` | `#3EB065` |
| `Primary/01` (alt green) | `#40BE46` |
| `navy/100` | `#eef3f8` |
| `navy/500` | `#708cb2` |
| `navy/600` | `#415980` |
| `global/blue-slate/600` | `#415980` |
| `global-colors/blue-slate/100` | `#eef3f8` |
| `global-colors/blue-slate/300` | `#d2dfed` |
| `gray/100` | `#F8FAFB` |
| `gray/200` | `#E9EBEF` |
| `gray/600` | `#7E8194` |
| `global/gray/100` | `#F8FAFB` |
| `global/gray/200` | `#EAEEF5` |
| `global/gray/500` | `#999DB4` |
| `global/gray/800` | `#4C4E59` |
| `gray/white` / `white/100` / `global/gray/white` | `#FFFFFF` |
| `orange/500` | `#F59E0B` |
| `Levels/High` (severity red) | `#FB515B` |
| `Card gray` | `#F8FAFB` |

---

## Spacing scale

| Token | px |
|---|---|
| `spacing/3xs` | 2 |
| `spacing/2xs` | 4 |
| `spacing/xs` | 8 |
| `spacing/s` | 12 |
| `spacing/m` | 16 |
| `spacing/l` | 20 |
| `spacing/xl` | 24 |

---

## Corner radius

| Token | px |
|---|---|
| `corner-radius/xs` | 2 |
| `corner-radius/s` / `corner-radius/corner-radius-s` | 4 |

---

## Typography (font family: Open Sans throughout)

| Token | Size / weight / line-height |
|---|---|
| `body1-regular` | 14 / 400 / 22 |
| `body2-regular` | 14 / 400 / 22 |
| `body1-semibold` | 14 / 600 / 19 |
| `body2-semibold` | 14 / 600 / 19 |
| `subtitle1-semibold` | 14 / 600 / 19 |
| `subtitle2-semibold` | 14 / 600 / 19 |
| `button1-semibold` | 14 / 600 / 19 |
| `label1-semibold` | 12 / 600 / 16 |
| `h1-semibold` | 18 / 600 / 25 |
| `3Xlarge` | 34 / 600 |
| `base` | 14 / 400 |
| `medium` | 16 / 400 |
| `base semibold` | 14 / 600 |

---

## Effects

| Token | Definition |
|---|---|
| `elevation - sunken` | drop shadow `#708CB226` offset (0, 4) blur 10 spread 2 |

---

## Component-level observations (from Figma metadata)

These were captured from the canvas frames (`Sensor Management`, audit-event style tables, settings dialogs):

- **Sidebar nav (Administration)**: 72px wide, `surface/primary-inverse` (#1f2f4a) background.
- **Buttons**: 28px tall (primary action), `corner-radius/s` (4px). Common widths: 76px (icon-only), 241px (composite button group), 142px (modal action), 160px (form save action).
- **Form input fields**: 42px tall inner control, full row container often 64–88px (with label/help text). Widths typically 292px or 602px.
- **Severity dots (legend)**: 8×8 circle; label is 14px regular text in the same row.
- **Card / widget**: 16–20px padding, `surface/primary` (#ffffff) on `background/plain` (#eaeef5) page bg, `border/primary` (#eaeef5) 1px.
- **Tabs**: 30px tall (in the audit/sensor pages, 1287×30 frame at `y=164` from top of content).
- **Table header row**: 40px, body2-semibold text. Row height typically 52–56px including separators.

---

## How to interpret these for the POC

- **Page background** is **`#eaeef5`** (currently the POC may use `#f8fafb`). Switch to `eaeef5` so cards on top "lift" with the right tonal contrast.
- **Card / surface** on top of the page bg is **`#ffffff`** with a hairline border of `#eaeef5`.
- **Body copy**: `#414857` (primary), secondary `#5e6d81`, tertiary `#999db4`. **Always use Open Sans.**
- **Primary brand action**: `#3eb065` (green) — buttons, success states, brand link hover.
- **Sidebar**: navy-dark `#1f2f4a`, hover state slightly lighter (`#2d4264`).
- **Severity colors**:
  - Critical / High: `#FB515B` (Levels/High in Figma)
  - Medium: `#F59E0B` (orange/500)
  - Low: `#3eb065` or low-saturation green
- **Borders**: hairline `#eaeef5`, separator `#c9d0e3`, focused/active `#415980` or `#3eb065`.
- **Button height: 28px**, padding ~8–12px horizontal, font `button1-semibold` (Open Sans 14/600).
- **Corner radius: 4px** everywhere (never use 8 or 12 except for modal/card surfaces if needed).
- **Spacing rhythm**: 4 → 8 → 12 → 16 → 20 → 24. Never use odd values like 6, 10, 14.
