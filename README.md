# dap-translate

A lightweight translation service that leverages transformer models (via transformers.js) to translate English text into multiple languages.

---

## Features

- **Language Support**: Translate English text into multiple languages.
- **Powered by transformers.js**: Utilizes transformer models for accurate translations.
- **Lightweight and modular**: Core logic separated into modules for easy maintenance.

---

## Project Structure

```
.
├── language-models/   # Pre-trained language models
├── models/            # Model configurations and utilities
├── modules/           # Core translation logic
├── test/              # Unit and integration tests
├── build/             # Build scripts and configurations
├── .gitignore         # Git ignore rules
├── LICENSE            # Project license
├── README.md          # Project documentation
└── package.json       # Project metadata and dependencies
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/KingDanx/dap-translate.git
cd dap-translate
```

2. Install dependencies:

```bash
bun install
```

OR


```bash
bun install @kingdanx/dap-translate
```

OR


```bash
npm install @kingdanx/dap-translate
```



---

## Usage

```javascript
import { translate } from 'dap-translate';

const translatedText = await translate('Hello, world!', 'es');
console.log(translatedText); // Output: '¡Hola, mundo!'
```

Supported languages are based on the models available in the `language-models` directory.

---

## Testing

Run the test suite:

```bash
bun test
```

---

## License

MIT License – see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any improvements or fixes.
