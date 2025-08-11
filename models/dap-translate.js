import { randomUUID } from "crypto";
import DAPTimer from "@kingdanx/dap-timer";
import { languagesMap } from "../modules/model-importer.js";

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

    return { id, text, ...translation, language, process_duration };
  }
}
