export const images = {
  "../../resources/images/test.jpg": new URL(
    "../../resources/images/test.jpg",
    import.meta.url,
  ).href,
} as const

export default images
