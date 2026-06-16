// Shared data + asset URLs for the Natural History Museum (NHM) sections.

import taskboardImg from './taskboard.png'
import calendarImg from './calendar.png'

export const chaptersData = [
  { name: 'Install Tracker / CRM', image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624247/01_udnber.png' },
  { name: 'TaskBoard', image: taskboardImg },
  { name: 'Calendar', image: calendarImg },
  { name: 'Install Validation', image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624256/04_get63z.png' },
  { name: 'Commission Tracker', image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624251/05_kz1tyu.png' },
]

export const HERO_VIDEO =
  'https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/magnific_use-img-2-as-the-exact-ba_Piu3X0W42C_wnrc8f.mp4'

export const PTERODACTYL_IMG =
  'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779625001/ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png'

export const navLinks = ['Visit', 'Exhibitions', 'Discover', 'Learn', 'About']

// Shared motion variants.
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export const letterBlock = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
}
