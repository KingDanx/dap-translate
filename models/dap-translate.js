import path from "path";
import { randomUUID } from "crypto";
import { pipeline, TranslationPipeline } from "@xenova/transformers";
import DAPTimer from "@kingdanx/dap-timer";

/**
 * @type {Map<string, TranslationPipeline}
 */
const languagesMap = new Map();
export const supportedLanguages = ["es", "fr", "de", "it"];

const modelConfig = {
  local_files_only: true,
  cache_dir: path.join(import.meta.dir, "..", "language-models"),
};

for (const language of supportedLanguages) {
  const translator = await pipeline(
    "translation",
    `Xenova/opus-mt-en-${language}`,
    modelConfig
  );
  languagesMap.set(language, translator);
}

/**
 * @class - translates multiple languages to english
 * @property {Map<string, TranslationPipeline>} languages
 */
export default class DAPTranslate {
  languages = languagesMap;

  /**
   *
   * @param {string} text - english text to be translated
   * @returns {string} - returns the string with all punctuation striped
   */
  #processInput(text) {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>@\[\]\\|+]/g, "");
  }

  /**
   * Translate the given text into the specified language.
   *
   * @param {Object} params
   * @param {string} params.text - The source text to translate.
   * @param {string} params.language - Target language code (e.g., 'fr', 'es').
   * @throws {Error} Throws if the specified language is not supported.
   * @returns {Promise<Object>} A promise that resolves to an object containing:
   *  - id {string}: a unique identifier for the translation request,
   *  - text {string}: the original input text,
   *  - translation_text {string}: the translated text,
   *  - duration {Object}: timing information with string and numeric representation.
   */
  async translate({ text, language }) {
    const translator = this.languages.get(language);
    if (!translator) {
      throw new Error(`Specified language does not exist: ${language}`);
    }
    const timer = new DAPTimer();
    const id = randomUUID();
    timer.time(id);
    const [translation] = await translator(this.#processInput(text));
    const process_duration = timer.timeEnd(id);

    return { id, text, ...translation, process_duration };
  }
}
