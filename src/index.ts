#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { input } from '@inquirer/prompts'
import figlet from "figlet"

const terminalWidth = process.stdout.columns || 80;

// Define the default folder structure
const defaultSubfolders = ['controllers', 'middlewares', 'routes', 'services', 'repositories'];

// Utility functions for casing conversions
const toPascalCase = (str: string): string => str.replace(/(^\w|_\w)/g, match => match.replace('_', '').toUpperCase());
const toCamelCase = (str: string): string => str.replace(/_./g, match => match[1].toUpperCase()).replace(/^\w/, c => c.toLowerCase());
const toKebabCase = (str: string): string => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

// Function to find the project root directory
const findProjectRoot = (): string => {
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
        if (fs.existsSync(path.join(currentDir, 'package.json'))) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    throw new Error('Cannot find project root. Make sure you run this script within a Node.js project.');
};

// Function to generate file names and class names
const files = (moduleName: string, subfolders: string[]): Array<{ folder: string, name: string }> => [
    { folder: '', name: 'index.ts' }, // Main index.ts
    ...subfolders.map(sub => ({
        folder: sub,
        name: sub === 'repositories'
            ? `${moduleName.toLowerCase()}.repository.ts`
            : `${moduleName.toLowerCase()}.${sub.slice(0, -1)}.ts`
    })),
    ...subfolders.map(sub => ({ folder: sub, name: 'index.ts' }))
];

// Function to generate file content based on subfolder
const fileContent = (moduleName: string, subfolder: string): string => {
    const className = toPascalCase(moduleName);

    switch (subfolder) {
        case 'controllers':
            return `import { Request, Response } from 'express';
import { ${className}Service } from '../services';

export class ${className}Controller {
    private ${moduleName.toLowerCase()}Service: ${className}Service;

    constructor() {
        this.${moduleName.toLowerCase()}Service = new ${className}Service();
    }
}`;
        case 'middlewares':
            const text = `${toPascalCase(moduleName)} Request - \${req.method} \${req.path}`;
            return `import { Request, Response, NextFunction } from 'express';

export const ${toPascalCase(moduleName)}Middleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(\`${text}\`);
    next();
}
`;
        case 'routes':
            return `import { Router } from 'express';
import { ${className}Controller } from '../controllers';
import { ${toPascalCase(moduleName)}Middleware } from '../middlewares';

const router = Router();
const ${moduleName.toLowerCase()}Controller = new ${className}Controller();

// Apply middleware
router.use(${toPascalCase(moduleName)}Middleware);

// Test route to ensure the API is working
router.get('/ping', (req, res) => res.send('pong'));

export { router };`;
        case 'services':
            return `import { ${className}Repository } from '../repositories';

export class ${className}Service {
    private ${moduleName.toLowerCase()}Repository: ${className}Repository;

    constructor() {
        this.${moduleName.toLowerCase()}Repository = new ${className}Repository();
    }
}`;
        case 'repositories':
            return `export class ${className}Repository {
    // Define repository methods here
}`;
        default:
            return '';
    }
};

// Function to create folder and files
function createModuleStructure(moduleName: string, subfolders: string[]): void {
    try {
        const projectRoot = findProjectRoot(); // Get the project root directory
        const modulePath = path.join(projectRoot, 'src', 'Modules', toPascalCase(moduleName));

        // Create the main module folder
        if (!fs.existsSync(modulePath)) {
            fs.mkdirSync(modulePath, { recursive: true });
        }

        // Create subfolders and files
        subfolders.forEach(folder => {
            const folderPath = path.join(modulePath, folder);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
        });

        // Create the required files in each folder
        files(moduleName, subfolders).forEach(file => {
            const filePath = path.join(modulePath, file.folder, file.name);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, fileContent(moduleName, file.folder), 'utf8');
            }
        });

        // Create index.ts file for exporting components in each subfolder
        subfolders.forEach(folder => {
            const indexPath = path.join(modulePath, folder, 'index.ts');
            const exportLine = folder === 'repositories'
                ? `export { ${toPascalCase(moduleName)}Repository } from './${moduleName.toLowerCase()}.repository';\n`
                : folder === 'routes' ? `export { router as ${moduleName.toLowerCase()}Routes } from './${moduleName.toLowerCase()}.route';\n`
                    : `export { ${toPascalCase(moduleName)}${folder.slice(0, -1).charAt(0).toUpperCase() + folder.slice(1, -1)} } from './${moduleName.toLowerCase()}.${folder.slice(0, -1)}';\n`;
            fs.writeFileSync(indexPath, exportLine, 'utf8');
        });

        // Create main index.ts file for exporting the module
        const mainIndexPath = path.join(modulePath, 'index.ts');
        const mainExports = `import { ${moduleName.toLowerCase()}Routes } from './routes';
import { Router } from 'express';

const ${toPascalCase(moduleName)}Module = Router();

${toPascalCase(moduleName)}Module.use('/${moduleName.toLowerCase()}', ${moduleName.toLowerCase()}Routes);

export { ${toPascalCase(moduleName)}Module };
`;
        fs.writeFileSync(mainIndexPath, mainExports, 'utf8');


        figlet.text('Module Created', {
            font: 'Small',
            horizontalLayout: "controlled smushing",
            verticalLayout: "universal smushing",
            width: terminalWidth

        },
            function (err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.log(data)
                console.info(`You can add this module to your main index.ts file as follows:\n//index.ts\nimport { ${toPascalCase(moduleName)}Module } from './Modules/${toPascalCase(moduleName)}';\n// Add the module to the Express app\napp.use(${toPascalCase(moduleName)}Module);`)
            }
        )



    } catch (error) {
        figlet.text('Error', {
            font: 'Small',
            horizontalLayout: "controlled smushing",
            verticalLayout: "universal smushing",
            width: terminalWidth

        }, function (err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data)
        }
        )
    }
}

// CLI Prompt for module name
(async () => {
    try {
        const moduleName = await input({
            message: 'Enter the module name:',
            validate: input => input.trim().length > 0 || 'Module name cannot be empty',
        });

        if (!/^[\w-]+$/.test(moduleName)) {
            throw new Error('Invalid module name. Only alphanumeric characters and underscores are allowed.');
        }

        createModuleStructure(moduleName, defaultSubfolders);
    } catch (error) {
        if (error instanceof Error) {
            figlet.text('Error', {
                font: 'Small',
                horizontalLayout: "controlled smushing",
                verticalLayout: "universal smushing",
                width: terminalWidth

            }, function (err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.log(data)
            }
            )
        } else {
            console.error('An unknown error occurred');
        }
    }
})();
