# `@techymt/create-module`

[![NPM Version](https://img.shields.io/npm/v/@techymt/create-module.svg)](https://www.npmjs.com/package/@techymt/create-module)
[![License](https://img.shields.io/npm/l/@techymt/create-module.svg)](https://www.npmjs.com/package/@techymt/create-module)

## Overview

`@techymt/create-module` is a TypeScript package designed to streamline the creation of new modules in a clean TypeScript project structure. This tool is tailored for use with the [typescript-clean-boilerplate](https://github.com/TechyMT/typescript_clean_template) repository, ensuring that your project maintains a consistent and maintainable architecture.

## Prerequisites

Before using `@techymt/create-module`, ensure that your project meets the following prerequisites:

1. **TypeScript**: You need TypeScript installed in your project. If it's not installed, add it using:
   ```bash
   npm install --save-dev typescript
   ```

2. **`ts-node`**: This is required to run TypeScript files directly. Install it with:
   ```bash
   npm install --save-dev ts-node
   ```

3. **Type Definitions for Node.js**: Install `@types/node` for TypeScript support:
   ```bash
   npm install --save-dev @types/node
   ```

4. **`tsconfig.json`**: Ensure that a `tsconfig.json` file is present in the root of your project. If not, create one by running:
   ```bash
   npx tsc --init
   ```

## Features

- Automatically generates module directories and files based on a predefined structure.
- Ensures consistent module setup with TypeScript.
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
