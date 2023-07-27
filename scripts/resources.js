import fs from "fs/promises"
import path from "path"
import prettier from "prettier"
import { Handler } from "@ghom/handler"

const fontHandler = new Handler(path.join("resources", "fonts"), {
  loader: (filePath) => Promise.resolve(filePath),
})

await fontHandler.init()

console.log(`🔠 ${fontHandler.elements.size - 1} fonts detected`)

const fonts = Array.from(fontHandler.elements.values()).filter((fontPath) =>
  /\.(?:ttf|woff2?)$/.test(path.extname(fontPath)),
)

await fs.writeFile(
  path.join("src", "generated", "fonts.scss"),
  await prettier.format(
    fonts
      .map(
        (fontPath) => `@font-face {
  font-family: "${path.basename(fontPath, path.extname(fontPath))}";
  src: url("${fontPath}") format("woff2");\n}`,
      )
      .join("\n\n"),
    {
      filepath: "fonts.scss",
    },
  ),
  "utf-8",
)

await fs.writeFile(
  path.join("src", "generated", "fonts.ts"),
  await prettier.format(
    `export const fonts = [
  ${fonts
    .map((fontPath) => {
      return `  "${path.basename(fontPath, path.extname(fontPath))}"`
    })
    .join(",\n")}\n] as const\n\nexport default fonts`,
    {
      filepath: "file.ts",
      semi: false,
    },
  ),
  "utf-8",
)

console.log("✅ Fonts linked")

async function linkAssets(id, filter) {
  const handler = new Handler(path.join("resources", id), {
    loader: (filePath) => Promise.resolve(filePath),
  })

  await handler.init()

  console.log(`🖼️ ${handler.elements.size - 1} ${id} loaded`)

  await fs.writeFile(
    path.join("src", "generated", `${id}.ts`),
    await prettier.format(
      `export const ${id} = {
  ${Array.from(handler.elements.values())
    .filter(filter)
    .map((filePath) => {
      const resolvedPath = path
        .join("..", "..", ...filePath.split(/\\\\/g))
        .replace(/\\/g, "/")
      return `  "${resolvedPath}": new URL("${resolvedPath}", import.meta.url).href`
    })
    .join(",\n")}\n} as const\n\nexport default ${id}`,
      {
        filepath: "file.ts",
        semi: false,
      },
    ),
    "utf-8",
  )

  console.log(`✅ ${id} linked`)
}

await linkAssets("images", (filePath) => /\.(?:png|jpe?g|svg)$/.test(filePath))
await linkAssets("musics", (filePath) => /\.(?:mp3|wav|ogg)$/.test(filePath))
await linkAssets("sounds", (filePath) => /\.(?:mp3|wav|ogg)$/.test(filePath))
await linkAssets("videos", (filePath) => /\.(?:mp4|webm)$/.test(filePath))

const textHandler = new Handler(path.join("resources", "texts"), {
  loader: (filePath) => Promise.resolve(filePath),
})

await textHandler.init()

console.log(`📜 ${textHandler.elements.size - 1} texts loaded`)

await fs.writeFile(
  path.join("src", "generated", "texts.ts"),
  await prettier.format(
    `${Array.from(textHandler.elements.values())
      .filter((textPath) => /\.json$/.test(textPath))
      .map(
        (textPath) =>
          `import ${path.basename(
            textPath,
            path.extname(textPath),
          )} from "../../${textPath.replace(/\\|\//g, "/")}"`,
      )
      .join("\n")}\n\nexport const texts = {
  ${Array.from(textHandler.elements.values())
    .filter((textPath) => /\.json$/.test(textPath))
    .map((textPath) => {
      return `  ${path.basename(textPath, path.extname(textPath))}`
    })
    .join(",\n")}\n} as const\n\nexport default texts`,
    {
      filepath: "file.ts",
      semi: false,
    },
  ),
  "utf-8",
)

console.log("✅ Texts linked")
