# Complete Guide to Turborepo: From Zero to Production

## Introduction: Why Monorepos Matter (And Why Most Don't Know About Them)

The harsh reality is that 99% of software engineers have never heard of monorepos, let alone implemented one properly. This isn't coming from an ego-driven perspective—it's based on real-world experience with teams struggling with build times exceeding an hour for simple React applications.

I've witnessed firsthand the consequences of poor monorepo implementations: teams of 20+ engineers waiting over an hour for builds on every push to the dev branch. The culprit? A React project with compressed Ant Design components being unzipped in the CI/CD pipeline, taking forever to compile. The solution was straightforward—use Ant Design's built-in theming or create a private npm package—but organizational resistance led to copy-pasting entire folders into source code just to reduce build times from 60+ minutes to 5 minutes.

This guide will teach you how to build monorepos the right way using Turborepo, taking you from complete beginner to proficient practitioner.

## What is Turborepo?

Turborepo is a high-performance build system for JavaScript and TypeScript codebases designed specifically for monorepos. It solves the fundamental scaling problem that monorepos face: as your repository grows, build times become prohibitively slow.

### The Monorepo Scaling Problem

Monorepos offer many advantages—shared code, consistent tooling, atomic commits across projects—but they struggle to scale efficiently. Each workspace has its own:
- Test suite
- Linting rules
- Build process
- Dependencies

A single monorepo might need to execute thousands of tasks. Without proper tooling, this creates dramatic slowdowns that affect how teams build and ship software.
Turborepo solves this through intelligent caching and task orchestration. Its Remote Cache stores the results of all tasks, meaning your CI never needs to do the same work twice.

## Prerequisites and Platform Notes

**Important:** Turborepo works best on Unix-like systems. If you're on Windows 11, consider using WSL 2.0 as you may encounter platform-specific issues. File system commands may differ based on your platform.

## Step-by-Step Implementation Guide

Let's build a complete monorepo with Next.js frontend, Express.js API, and shared packages.

### Final Project Structure

```
my-monorepo/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express backend
├── packages/
│   ├── ui/         # Shared UI components
│   ├── types/      # Shared TypeScript types
│   └── docs/       # Documentation (optional)
├── turbo.json
├── tsconfig.base.json
├── package.json
└── .gitignore
```

### Step 1: Clean Slate Setup

First, ensure you have a clean environment:

```bash
# Remove any existing Turbo installation
npm uninstall -g turbo
rm -rf node_modules
rm package-lock.json
```

### Step 2: Initialize the Monorepo

```bash
mkdir my-turborepo && cd my-turborepo
npm init -y
```

Edit your root `package.json`:

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "2.5.4"
  },
  "packageManager": "npm@10.9.2"
}
```

Install Turborepo:

```bash
npm install
```

### Step 3: Configure Turborepo

Create `turbo.json` in your root directory:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^test"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    }
  }
}
```

### Step 4: Create Project Structure

```bash
mkdir -p apps/web apps/api packages/ui packages/types packages/docs
```

### Step 5: Set Up Next.js Frontend

Navigate to the web app directory and create a Next.js application:

```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Update `apps/web/package.json` to include shared dependencies:

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.3.4",
    "@repo/ui": "*",
    "types": "*"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.3.4"
  }
}
```


### Step 6: Create Shared Packages

#### Shared Types Package
Create `packages/types/index.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}
```

Create `packages/types/package.json`:

```json
{
  "name": "types",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts"
}
```

#### Shared UI Components Package
Create `packages/ui/src/Button.tsx`:

```tsx
import React from 'react';
import type { ButtonProps } from 'types';

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const className = `${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''}`;

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

Create `packages/ui/src/index.ts`:

```typescript
export { Button } from './Button';
```

Create `packages/ui/package.json`:

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "types": "*"
  },
  "devDependencies": {
    " @types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0"
  }
}
```

### Step 7: Configure TypeScript

Create `tsconfig.base.json` in the root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@repo/ui": ["./packages/ui/src"],
      "@repo/ui/*": ["./packages/ui/src/*"],
      "types": ["./packages/types"],
      "types/*": ["./packages/types/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist", ".next"]
}
```

### Step 8: Update Git Configuration

Create/update `.gitignore`:

```text
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
.next/
.vercel/

# Turborepo
.turbo/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### Step 9: Test Your Monorepo

Install all dependencies:

```bash
npm install
```

Build everything:

```bash
npm run build
```

Expected output:
`Tasks: 4 successful, 4 total Cached: 0 cached, 4 total Time: 15.2s`

Run the development servers:

```bash
npm run dev
```

This will start both your Next.js app (usually on port 3000) and Express API (on port 3001).

### Step 11: Verify Everything Works

Test the caching by running build again:

```bash
npm run build
```

Expected output:
`Tasks: 4 successful, 4 total Cached: 4 cached, 4 total Time: 185ms >>> FULL TURBO`

## Key Turborepo Commands

- `turbo build` - Build all packages following dependency graph
- `turbo build --filter=web` - Build only the web app and its dependencies
- `turbo build --dry` - Show what would be built without executing
- `turbo dev` - Start all development servers
- `turbo lint` - Run linting across all packages
- `turbo test` - Run tests across all packages

## Advanced Configuration

### Remote Caching
For teams, set up remote caching to share build artifacts:
```bash
npx turbo login
npx turbo link
```

### Package Filtering
Target specific packages:
```bash
# Build only frontend
turbo build --filter=web

# Build frontend and its dependencies
turbo build --filter=web...

# Build everything except docs
turbo build --filter=!docs
```

## Troubleshooting Common Issues

1. **Build failures:** Check your `turbo.json` task dependencies
2. **Import errors:** Verify your TypeScript path mappings in `tsconfig.base.json`
3. **Workspace resolution:** Ensure `package.json` workspaces configuration is correct
4. **Platform issues on Windows:** Use WSL 2.0 or ensure you have the latest Node.js version

## Conclusion

You now have a production-ready Turborepo monorepo with:
- ✅ Next.js frontend with TypeScript
- ✅ Express.js API with TypeScript
- ✅ Shared UI components
- ✅ Shared type definitions
- ✅ Intelligent caching and task orchestration
- ✅ Lightning-fast builds after initial setup

This foundation can scale to support dozens of applications and packages while maintaining fast build times and developer productivity.
