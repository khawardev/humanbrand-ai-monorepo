import * as p from '@clack/prompts';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import Fuse from 'fuse.js';

// Cancel handler for when the user presses Ctrl+C inside Clack prompts
const handleCancel = (value) => {
    if (p.isCancel(value)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
    }
};

// Custom Fuzzy Search Prompt using standard @clack/prompts autocomplete
async function fuzzySelect({ message, options }) {
    const fuse = new Fuse(options, {
        keys: ['label', 'hint'],
        threshold: 0.3,
    });

    return await p.autocomplete({
        message,
        options,
        filter: (query, item) => {
            if (!query) return true;
            const results = fuse.search(query);
            return results.some(r => r.item.value === item.value);
        }
    });
}

async function runCommand(command, args = []) {
    return new Promise((resolve) => {
        const proc = spawn(command, args, { stdio: 'inherit', shell: true });
        proc.on('close', (code) => {
            if (code !== 0) {
                console.log(`\n${chalk.red('▲')} Process failed with exit code ${code}\n`);
                process.exit(code);
            } else {
                console.log(`\n${chalk.green('▲')} Command completed successfully\n`);
            }
            resolve();
        });
    });
}

function getAllScripts() {
    try {
        const pkgPath = join(process.cwd(), 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        return Object.keys(pkg.scripts || {}).map(name => ({
            name: name,
            description: pkg.scripts[name]
        }));
    } catch (e) {
        return [];
    }
}

function printBanner() {
    console.clear();
    console.log(`\n${chalk.white('▲')}  ${chalk.dim('~/')} ${chalk.dim('pnpm humanbrand scripts')}\n`);

    const bannerLines = [
        "██╗  ██╗██╗   ██╗███╗   ███╗ █████╗ ███╗   ██╗██████╗ ██████╗  █████╗ ███╗   ██╗██████╗      █████╗ ██╗",
        "██║  ██║██║   ██║████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔══██╗    ██╔══██╗██║",
        "███████║██║   ██║██╔████╔██║███████║██╔██╗ ██║██████╔╝██████╔╝███████║██╔██╗ ██║██║  ██║    ███████║██║",
        "██╔══██║██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██╗██╔══██╗██╔══██║██║╚██╗██║██║  ██║    ██╔══██║██║",
        "██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║██████╔╝██║  ██║██║  ██║██║ ╚████║██████╔╝    ██║  ██║██║",
        "╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═╝  ╚═╝╚═╝"
    ];

    const grays = [
        chalk.hex('#ffffff'), chalk.hex('#e2e8f0'), chalk.hex('#cbd5e1'),
        chalk.hex('#94a3b8'), chalk.hex('#64748b'), chalk.hex('#475569')
    ];

    bannerLines.forEach((line, index) => console.log(grays[index](line)));
    console.log(`\n${chalk.dim('The ultimate command-line interface for HumanBrand AI apps')}\n`);
}

async function main() {
    const scripts = getAllScripts();
    let selectedScript = process.argv[2];
    let finalArgs = [];
    let baseCmd = 'pnpm';

    if (selectedScript) {
        const validScript = scripts.find(s => s.name === selectedScript);
        if (!validScript) {
            console.error(`\n${chalk.red('▲')} Script "${selectedScript}" not found.\n`);
            process.exit(1);
        }
        finalArgs = [selectedScript, ...process.argv.slice(3)];
        await runCommand(baseCmd, finalArgs);
        return;
    }

    printBanner();

    if (scripts.length === 0) {
        console.error(`\n${chalk.red('▲')} No scripts found in package.json.\n`);
        process.exit(1);
    }

    p.intro(chalk.bgCyan.black(' scripts '));

    p.log.step(`Source: ${chalk.dim(join(process.cwd(), 'package.json'))}`);
    p.log.step(`Found ${chalk.green(scripts.length)} scripts`);

    // Use our custom, visually-perfect fuzzy search component!
    selectedScript = await fuzzySelect({
        message: 'Search and select a script to run',
        options: scripts.map(s => ({
            value: s.name,
            label: s.name,
            hint: s.description
        }))
    });

    handleCancel(selectedScript);

    const extraArgsStr = await p.text({
        message: 'Add extra arguments?',
        placeholder: 'e.g. --watch or --host',
        defaultValue: ''
    });

    handleCancel(extraArgsStr);

    finalArgs = [selectedScript];
    if (extraArgsStr.trim()) {
        finalArgs.push(...extraArgsStr.trim().split(' '));
    }

    const fullCommand = `${baseCmd} ${finalArgs.join(' ')}`;

    p.outro(`Executing: ${chalk.cyan(fullCommand)}`);

    await runCommand(baseCmd, finalArgs);
}

main().catch(err => {
    console.error(`\n${chalk.red('▲')} An unexpected error occurred: ${err.message}\n`);
    process.exit(1);
});