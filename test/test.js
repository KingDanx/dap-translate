import DAPTranslate from "../models/dap-translate";

const translator = new DAPTranslate();

const message =
  "The next train is approaching, please stand behind the yellow line.";

const translation = await translator.translate({
  text: message,
  language: "fr",
});
const translation2 = await translator.translate({
  text: message,
  language: "it",
});
const translation3 = await translator.translate({
  text: message,
  language: "es",
});

console.log(translation);
console.log(translation2);
console.log(translation3);

Bun.serve({
  port: 80,
  routes: {
    "/translate": {
      POST: async (req) => {
        try {
          const { text, language } = await req.json();
          const translation = await translator.translate({ text, language });

          return Response.json(translation);
        } catch (e) {
          console.error(e);
          return Response.json({ error: e.message }, { status: 400 });
        }
      },
    },
  },
});
