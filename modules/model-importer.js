import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { env, pipeline, TranslationPipeline } from "@huggingface/transformers";

env.allowRemoteModels = true;
env.localFilesOnly = false;

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

// Single canonical root for our own persistent model cache. Every path below
// is derived from this ONE value so env.cacheDir, modelConfig.cache_dir, and
// our own fs.readdir/fs.cp bookkeeping can never disagree with each other.
const modelsRoot = path.join(import.meta.dirname, "..", "language-models");
const moduleCache = path.join(modelsRoot, "Xenova");

// transformers.js appends "<namespace>/<model-name>" onto cache_dir itself,
// so cacheDir should point at the root, not at ".../Xenova".
env.cacheDir = modelsRoot;
env.localModelPath = modelsRoot;

const modelConfig = {
  local_files_only: true,
  cache_dir: modelsRoot,
};

await fs.mkdir(moduleCache, { recursive: true });
const files = await fs.readdir(moduleCache);

console.log("FILES:", files);

// Pass 1: models already present in our own module cache — load directly.
for (const file of files) {
  const model = unloadedModels.find((m) => m.model === file);
  if (model) {
    await pipeline("translation", `Xenova/${file}`, modelConfig);

    unloadedModels.splice(
      unloadedModels.findIndex((f) => f.model === file),
      1
    );
  } else {
    console.log("FILE NOT FOUND", file);
  }
}

console.log("UNLOADED:", unloadedModels);

// Pass 3: models not found anywhere locally — download (remote allowed)
for (const model of unloadedModels) {
  await pipeline("translation", `Xenova/${model.model}`);

  const translator = await pipeline(
    "translation",
    `Xenova/${model.model}`,
    modelConfig
  );
  languagesMap.set(model.language, translator);
}
