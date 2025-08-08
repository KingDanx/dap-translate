import { pipeline } from "@xenova/transformers";
import DAPTimer from "@kingdanx/dap-timer";

export default class DAPTranslate {
  constructor() {
    this.languages = new Map();
  }

  async loadModels() {}

  async translate(text, language) {}
}
