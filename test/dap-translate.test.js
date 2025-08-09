import { test, expect } from "bun:test";
import DAPTranslate from "../models/dap-translate";
import { supportedLanguages } from "../modules/model-importer";

const translator = new DAPTranslate();

test("DAPTranslate initializes all languages", () => {
  expect(translator.languages).toBeInstanceOf(Map);
  expect(translator.languages.size).toBe(supportedLanguages.length);
});

test("DAPTranslate translates and returns expected output", async () => {
  const text = "This is a test of the translation.";
  const translation = await translator.translate({ text, language: "es" });
  expect(translation).toBeObject();
});

test("DAPTranslate throws error when unsupported language is passed", async () => {
  const language = "zh";
  try {
    const text = "This is a test of the translation.";
    const translation = await translator.translate({ text, language });
    expect(translation).fail("This language is not currently supported");
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toBe(`Specified language does not exist: ${language}`);
  }
});
