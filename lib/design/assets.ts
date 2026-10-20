import {
  HOME_BACKGROUND,
  LEAF_BACKGROUND,
  MASJID_LOGO,
  MOSQUE_ARCHES,
  QIBLA_BG,
  TASBEEH_BG,
  TILE_IMAGES,
  FALLBACK_IMAGE,
} from "@/lib/images";

export const assets = {
  hero:       HOME_BACKGROUND,
  logo:       MASJID_LOGO,
  jamaatArch: MOSQUE_ARCHES,
  leaves:     LEAF_BACKGROUND,

  qibla:   QIBLA_BG,
  tasbeeh: TASBEEH_BG,
  duas:    TILE_IMAGES.duas,
  names:   TILE_IMAGES["names-of-allah"],

  fallback: FALLBACK_IMAGE,
} as const;