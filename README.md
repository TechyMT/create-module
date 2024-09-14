# `@techymt/create-module`

[![NPM Version](https://img.shields.io/npm/v/@techymt/create-module.svg)](https://www.npmjs.com/package/@techymt/create-module)
[![License](https://img.shields.io/npm/l/@techymt/create-module.svg)](https://www.npmjs.com/package/@techymt/create-module)

## Overview

`@techymt/create-module` is a TypeScript package designed to streamline the creation of new modules in a clean TypeScript project structure. This tool is tailored for use with the [typescript-clean-boilerplate](https://github.com/TechyMT/typescript_clean_template) repository, ensuring that your project maintains a consistent and maintainable architecture.

## Features

- Automatically generates module directories and files based on a predefined structure.
- Ensures consistent module setup with TypeScript.
- Dynamically resizes terminal text using `figlet` for better readability.
- Easily integrate with the [typescript-clean-boilerplate](https://github.com/TechyMT/typescript_clean_template) template.

## Installation

To install `@techymt/create-module` globally, run:

```bash
npm install -g @techymt/create-module
```

Or add it as a project dependency:

```bash
npm install --save-dev @techymt/create-module
```

## Usage

Navigate to the root of your Node.js project directory:
```bash
cd /path/to/your/project
```

Then you can create a new module using the following command:

```bash
npx @techymt/create-module
```
You will be prompted to enter the module name. For example:

```bash
? Enter the module name: <ModuleName>
```

This command will create a new folder under your project’s `Modules` directory, with the following structure:

```
src/
└── Modules/
    └── ModuleName/
        ├── controllers/
        │   ├── index.ts
        │   └── modulename.controller.ts
        ├── middlewares/
        │   ├── index.ts
        │   └── modulename.middleware.ts
        ├── repositories/
        │   ├── index.ts
        │   └── modulename.repository.ts
        ├── services/
        │   ├── index.ts
        │   └── modulename.service.ts
        ├── routes/
        │   ├── index.ts
        │   └── modulename.route.ts
        └── index.ts (Exports the module)
```

### Integration with TypeScript Clean Boilerplate

Once you have created your module, integrate it with your main `index.ts` file as follows:

```ts
import { ModuleNameModule } from './Modules/ModuleName';

// Add the module to the Express app
app.use(ModuleNameModule);
```

For more details on setting up the clean TypeScript architecture, visit the [typescript-clean-boilerplate](https://github.com/TechyMT/typescript_clean_template) repository.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- [TechyMT](https://github.com/techymt)
