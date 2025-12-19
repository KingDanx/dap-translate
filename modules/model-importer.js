import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline, TranslationPipeline } from "@xenova/transformers";

process.on("uncaughtException", (e) => console.log(e));

/**
 * @type {Map<string, TranslationPipeline}
 */
export const languagesMap = new Map();
export const supportedLanguages = ["es", "fr", "de", "it"];

const unloadedModels = supportedLanguages.map((l) => {
  return {
    language: l,
    model: `opus-mt-en-${l}`,
  };
});

const transformersPath = fileURLToPath(
  import.meta.resolve("@xenova/transformers")
);

const modelConfig = {
  local_files_only: true,
  cache_dir: path.join(import.meta.dirname, "..", "language-models"),
};

const defaultCache = path.join(
  transformersPath,
  "..",
  "..",
  ".cache",
  "Xenova"
);

const moduleCache = path.join(
  import.meta.dirname,
  "..",
  "language-models",
  "Xenova"
);

await fs.mkdir(defaultCache, { recursive: true });
await fs.mkdir(moduleCache, { recursive: true });

const cachedFiles = await fs.readdir(defaultCache);
console.log(cachedFiles);
const files = await fs.readdir(moduleCache);

console.log("FILES:", files);

for (const file of files) {
  const model = unloadedModels.find((m) => m.model === file);
  if (model) {
    const translator = await pipeline(
      "translation",
      `Xenova/${file}`,
      modelConfig
    );
    languagesMap.set(model.language, translator);
    cachedFiles.splice(
      cachedFiles.findIndex((f) => f === file),
      1
    );
    unloadedModels.splice(
      unloadedModels.findIndex((f) => f.model === file),
      1
    );
  } else {
    console.log("FILE NOT FOUND", file);
  }
}

console.log("REMAINING CAHCE", cachedFiles);

for (const file of cachedFiles) {
  const model = unloadedModels.find((m) => m.model === file);
  if (model) {
    await fs.cp(path.join(defaultCache, file), path.join(moduleCache, file), {
      recursive: true,
    });
    const translator = await pipeline(
      "translation",
      `Xenova/${file}`,
      modelConfig
    );
    unloadedModels.splice(
      unloadedModels.findIndex((f) => f.model === file),
      1
    );
    languagesMap.set(model.language, translator);
  }
}

console.log("UNLOADED:", unloadedModels);

for (const model of unloadedModels) {
  await pipeline("translation", `Xenova/${model.model}`);
  await fs.cp(
    path.join(defaultCache, model.model),
    path.join(moduleCache, model.model),
    { recursive: true }
  );
  const translator = await pipeline(
    "translation",
    `Xenova/${model.model}`,
    modelConfig
  );
  languagesMap.set(model.language, translator);
}
