import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const IGNORE_DIRS = ["node_modules", ".next", ".git", "dist", "build", ".agent", ".agents"];

const EXCLUDE_FILES = [
  "next-env.d.ts",
  "rename-to-pascal-case.ts",
  "drizzle.config.ts",
  "next.config.ts",
  "postcss.config.mjs",
  "tailwind.config.ts",
  "tsconfig.json",
  "eslint.config.mjs",
  "not-found.tsx",
  "not-found.ts",
  "error.tsx",
  "error.ts",
  "loading.tsx",
  "loading.ts",
  "layout.tsx",
  "layout.ts",
  "page.tsx",
  "page.ts",
  "route.ts",
  "route.tsx",
  "middleware.ts",
  "middleware.tsx",
  "global-error.tsx",
  "global-error.ts",
  "default.tsx",
  "default.ts",
  "template.tsx",
  "template.ts",
  "opengraph-image.tsx",
  "twitter-image.tsx",
  "sitemap.ts",
  "robots.ts",
  "manifest.ts",
  "index.ts",
  "index.tsx",
];

type NamingMode = "pascal" | "camel";

function isAlreadyPascalCase(str: string): boolean {
  if (str.length === 0) return false;
  const firstChar = str.charAt(0);
  return firstChar === firstChar.toUpperCase() && !str.includes("-") && !str.includes("_");
}

function isAlreadyCamelCase(str: string): boolean {
  if (str.length === 0) return false;
  const firstChar = str.charAt(0);
  return firstChar === firstChar.toLowerCase() && !str.includes("-") && !str.includes("_");
}

function toPascalCase(str: string): string {
  if (str.includes("-") || str.includes("_")) {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
  if (str.includes("-") || str.includes("_")) {
    const parts = str.split(/[-_]/);
    if (parts.length === 0) return str.toLowerCase();
    return (parts[0] || '').toLowerCase() + parts.slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function convertFileName(fileName: string, mode: NamingMode): string {
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);

  if (mode === "camel") {
    if (isAlreadyCamelCase(baseName)) {
      return fileName;
    }
    const camelName = toCamelCase(baseName);
    return camelName + ext;
  }

  if (isAlreadyPascalCase(baseName)) {
    return fileName;
  }

  const pascalName = toPascalCase(baseName);
  return pascalName + ext;
}

function needsRenaming(baseName: string, mode: NamingMode): boolean {
  if (mode === "camel") {
    if (baseName.includes("-") || baseName.includes("_")) {
      return true;
    }
    return false;
  }

  if (baseName.includes("-") || baseName.includes("_")) {
    return true;
  }
  const firstChar = baseName.charAt(0);
  return firstChar !== firstChar.toUpperCase();
}

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function findFilesToRename(dir: string, mode: NamingMode): string[] {
  const allFiles = getAllFiles(dir);
  return allFiles.filter((file) => {
    const fileName = path.basename(file);
    const baseName = path.basename(file, path.extname(file));
    
    if (EXCLUDE_FILES.includes(fileName)) {
      return false;
    }
    
    return needsRenaming(baseName, mode);
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function updateImportsInFile(
  filePath: string,
  oldBaseName: string,
  newBaseName: string
): boolean {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;
  const originalContent = content;

  const importPatterns = [
    new RegExp(`(from\\s+["'][^"']*\\/)${escapeRegex(oldBaseName)}(["'])`, "g"),
    new RegExp(`(from\\s+["']\\.\\/)${escapeRegex(oldBaseName)}(["'])`, "g"),
    new RegExp(`(from\\s+["'])${escapeRegex(oldBaseName)}(["'])`, "g"),
    new RegExp(`(import\\s+["'][^"']*\\/)${escapeRegex(oldBaseName)}(["'])`, "g"),
    new RegExp(`(import\\s+["'])${escapeRegex(oldBaseName)}(["'])`, "g"),
    new RegExp(`(require\\s*\\(\\s*["'][^"']*\\/)${escapeRegex(oldBaseName)}(["']\\s*\\))`, "g"),
  ];

  for (const pattern of importPatterns) {
    content = content.replace(pattern, `$1${newBaseName}$2`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf-8");
    modified = true;
  }

  return modified;
}

function renameFileAndUpdateImports(
  targetPath: string,
  dryRun: boolean = false,
  mode: NamingMode = "pascal"
): {
  oldPath: string;
  newPath: string;
  updatedFiles: string[];
} | null {
  const absolutePath = path.isAbsolute(targetPath)
    ? targetPath
    : path.resolve(process.cwd(), targetPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Path does not exist: ${absolutePath}`);
    return null;
  }

  const stat = fs.statSync(absolutePath);
  const filesToRename: string[] = [];

  if (stat.isDirectory()) {
    const files = findFilesToRename(absolutePath, mode);
    filesToRename.push(...files);
  } else if (stat.isFile()) {
    const fileName = path.basename(absolutePath);
    const baseName = path.basename(absolutePath, path.extname(absolutePath));
    
    if (EXCLUDE_FILES.includes(fileName)) {
      console.log(`⏭️  Skipping excluded file: ${absolutePath}`);
      return null;
    }
    
    if (needsRenaming(baseName, mode)) {
      filesToRename.push(absolutePath);
    } else {
      console.log(`✅ File is already in correct case: ${absolutePath}`);
      return null;
    }
  }

  if (filesToRename.length === 0) {
    console.log("✅ No files need renaming");
    return null;
  }

  console.log(`\n📁 Found ${filesToRename.length} file(s) to rename:\n`);

  const allProjectFiles = getAllFiles(PROJECT_ROOT);
  const renamedFiles: { oldPath: string; newPath: string; oldBaseName: string; newBaseName: string }[] = [];

  for (const file of filesToRename) {
    const dir = path.dirname(file);
    const oldFileName = path.basename(file);
    const newFileName = convertFileName(oldFileName, mode);
    const newFilePath = path.join(dir, newFileName);
    const oldBaseName = path.basename(file, path.extname(file));
    const newBaseName = path.basename(newFilePath, path.extname(newFilePath));

    console.log(`  📄 ${oldFileName} → ${newFileName}`);

    if (!dryRun) {
      fs.renameSync(file, newFilePath);
      renamedFiles.push({ oldPath: file, newPath: newFilePath, oldBaseName, newBaseName });
    }
  }

  const updatedFiles: string[] = [];

  if (!dryRun && renamedFiles.length > 0) {
    console.log("\n🔄 Updating imports...\n");

    for (const { oldBaseName, newBaseName } of renamedFiles) {
      for (const projectFile of allProjectFiles) {
        const currentPath = renamedFiles.find(r => r.oldPath === projectFile)?.newPath || projectFile;
        if (fs.existsSync(currentPath)) {
          const wasUpdated = updateImportsInFile(currentPath, oldBaseName, newBaseName);
          if (wasUpdated && !updatedFiles.includes(currentPath)) {
            updatedFiles.push(currentPath);
            console.log(`  ✏️  Updated imports in: ${path.relative(PROJECT_ROOT, currentPath)}`);
          }
        }
      }
    }
  }

  if (!filesToRename[0]) return null;
  
  return {
    oldPath: filesToRename[0],
    newPath: path.join(
      path.dirname(filesToRename[0]),
      convertFileName(path.basename(filesToRename[0]), mode)
    ),
    updatedFiles,
  };
}

function renameAllFiles(dryRun: boolean = false, mode: NamingMode = "pascal"): void {
  const modeLabel = mode === "camel" ? "files to camelCase" : "files to PascalCase";
  console.log(`🔍 Scanning for ${modeLabel}...\n`);

  const filesToRename = findFilesToRename(PROJECT_ROOT, mode);

  if (filesToRename.length === 0) {
    console.log(`✅ All ${mode === "camel" ? "files are already in camelCase" : "files are already in PascalCase"}!`);
    return;
  }

  console.log(`📁 Found ${filesToRename.length} file(s) that need renaming:\n`);

  for (const file of filesToRename) {
    console.log(`  - ${path.relative(PROJECT_ROOT, file)}`);
  }

  if (dryRun) {
    console.log("\n⚠️  DRY RUN - No files will be renamed");
    console.log("\nFiles that would be renamed:\n");

    for (const file of filesToRename) {
      const oldFileName = path.basename(file);
      const newFileName = convertFileName(oldFileName, mode);
      console.log(`  📄 ${oldFileName} → ${newFileName}`);
    }
    return;
  }

  const allProjectFiles = getAllFiles(PROJECT_ROOT);
  const renamedFiles: { oldPath: string; newPath: string; oldBaseName: string; newBaseName: string }[] = [];

  console.log("\n🔄 Renaming files...\n");

  for (const file of filesToRename) {
    const dir = path.dirname(file);
    const oldFileName = path.basename(file);
    const newFileName = convertFileName(oldFileName, mode);
    const newFilePath = path.join(dir, newFileName);
    const oldBaseName = path.basename(file, path.extname(file));
    const newBaseName = path.basename(newFilePath, path.extname(newFilePath));

    console.log(`  📄 ${path.relative(PROJECT_ROOT, file)} → ${newFileName}`);

    fs.renameSync(file, newFilePath);
    renamedFiles.push({ oldPath: file, newPath: newFilePath, oldBaseName, newBaseName });
  }

  console.log("\n🔄 Updating imports across the project...\n");

  const updatedFiles: Set<string> = new Set();

  const currentProjectFiles = getAllFiles(PROJECT_ROOT);

  for (const { oldBaseName, newBaseName } of renamedFiles) {
    for (const projectFile of currentProjectFiles) {
      if (fs.existsSync(projectFile)) {
        const wasUpdated = updateImportsInFile(projectFile, oldBaseName, newBaseName);
        if (wasUpdated) {
          updatedFiles.add(projectFile);
        }
      }
    }
  }

  for (const file of updatedFiles) {
    console.log(`  ✏️  Updated: ${path.relative(PROJECT_ROOT, file)}`);
  }

  console.log(`\n✅ Done! Renamed ${renamedFiles.length} file(s) and updated ${updatedFiles.size} file(s) with imports.`);
}

function printUsage(): void {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║           File Rename to PascalCase / camelCase Utility           ║
╚═══════════════════════════════════════════════════════════════════╝

Usage:
  npx ts-node --esm scripts/rename-to-pascal-case.ts [options] [path]

Options:
  --dry-run    Show what would be renamed without making changes
  --all        Rename all files in the project
  --camel      Convert to camelCase instead of PascalCase
  --help       Show this help message

Examples:
  # Rename a specific file to PascalCase
  npx ts-node --esm scripts/rename-to-pascal-case.ts components/shared/line-paths-bg.tsx

  # Rename all files in a folder to PascalCase
  npx ts-node --esm scripts/rename-to-pascal-case.ts components/shared

  # Preview all PascalCase changes (dry run)
  npx ts-node --esm scripts/rename-to-pascal-case.ts --dry-run --all

  # Rename all non-PascalCase files in the project
  npx ts-node --esm scripts/rename-to-pascal-case.ts --all

  # Rename files to camelCase
  npx ts-node --esm scripts/rename-to-pascal-case.ts --camel server/actions

  # Preview camelCase renames (dry run)
  npx ts-node --esm scripts/rename-to-pascal-case.ts --dry-run --camel server/actions

Naming Modes:
  Default (PascalCase):
    - line-paths-bg.tsx → LinePathsBg.tsx
    - my_component.tsx → MyComponent.tsx  
    - icons.tsx → Icons.tsx

  --camel (camelCase):
    - generate-image-actions.ts → generateImageActions.ts
    - use-auto-resize-textarea.ts → useAutoResizeTextarea.ts
    - aiag-config.ts → aiagConfig.ts

Excluded files (Next.js special files and configs):
  not-found.tsx, error.tsx, loading.tsx, layout.tsx, page.tsx, route.ts,
  middleware.ts, next-env.d.ts, drizzle.config.ts, next.config.ts, index.ts, etc.
`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    printUsage();
    return;
  }

  const dryRun = args.includes("--dry-run");
  const renameAll = args.includes("--all");
  const camelMode = args.includes("--camel");
  const mode: NamingMode = camelMode ? "camel" : "pascal";

  const pathArg = args.find((arg) => !arg.startsWith("--"));

  if (renameAll) {
    renameAllFiles(dryRun, mode);
  } else if (pathArg) {
    const result = renameFileAndUpdateImports(pathArg, dryRun, mode);
    if (result) {
      console.log(`\n✅ Successfully renamed and updated imports!`);
    }
  } else {
    printUsage();
  }
}

main();
