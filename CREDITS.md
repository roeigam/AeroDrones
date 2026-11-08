# Image credits

## Client photos (in use)
All photos on the site were supplied by the client. The originals are kept in `client-photos/` (git-ignored, not shipped).
Before going public, the client should confirm owning, or having permission to use, every one of them. <!-- TODO -->

| File | Used for | Original | Processing |
|---|---|---|---|
| `src/assets/hero/hero.jpg` | Hero (framed mode) | `01-hero-fpv-drone-sunset-sky.jpg` | Cropped to 4:3 around the drone (1349×1012) |
| `src/assets/about/workbench.jpg` | About | `03-workbench-fpv-drone-tools.jpg` | None |
| `src/assets/builds/hexacopter-camera-platform.jpg` | Build 01 | `06-build-hexacopter-camera-gimbal.jpg` | None |
| `src/assets/builds/build-in-progress.jpg` | Build 02 | `08-build-in-progress-frame-and-esc.jpg` | None |
| `src/assets/builds/custom-electronics-quad.jpg` | Build 03 | `09-build-custom-electronics-quad.jpg` | Top strip cropped (dog and chairs in the background), 715×699 |
| `src/assets/builds/quad-landing-legs.jpg` | Build 04 | `02-about-drone-in-hand-blue-sky.jpg` | None. Low resolution (495×619): the gallery never displays it larger than native size |
| `src/assets/builds/diy-cardboard-quad.jpg` | Build 05 | `10-build-diy-cardboard-quad.jpg` | None |

The OG images in `public/og/` are generated from the hero photo by `scripts/gen-og.mjs`.

## Not used
- `04-…` (parts layout) and `05-…` (kit) are not used, by decision.
- `07-build-fpv-freestyle-blue-props.jpg` carries an **oscarliang.com** watermark, so it appears to be a third-party photo. It is left out until the client confirms the rights to it. <!-- TODO -->

## Former stock placeholders (removed)
These Unsplash photos were placeholders before the client's photos arrived. They are no longer in the project or the build, and were moved to `../AeroDrones-unused-stock-photos/` (outside the repo). All are under the [Unsplash License](https://unsplash.com/license).

| Former file | Was used for | Photo | Photographer |
|---|---|---|---|
| `src/assets/hero/hero-drone.jpg` | Hero | https://unsplash.com/photos/-jIc1-0pZ1U | Nejc Soklič |
| `src/assets/about/about-builder.jpg` | About | https://unsplash.com/photos/AeeLQOk4jaA | Nejc Soklič |
| `src/assets/decor/carbon-closeup.jpg` | Style tile | https://unsplash.com/photos/oHY0NfxZsJc | Lilian Velet |
| `src/assets/decor/red-quad.jpg` | Style tile | https://unsplash.com/photos/90tbIHE2tDo | Felix Berger |

The generated HUD placeholder builds and their script (`scripts/gen-build-placeholders.mjs`) were deleted.
