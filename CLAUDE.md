# CLAUDE.md - Greentext App Development Guide

## Build Commands
- `npm start` - Start development server with hot reload (port 3000)
- `npm run host` - Start development server exposed to local network (accessible from other devices)
- `npm run build` - Build production bundle
- `npm run generate-assets` - Generate social media preview images and favicon

## Project Structure
- React 19 functional components with hooks
- Webpack 5 for bundling
- Tailwind CSS for styling
- No TypeScript - JavaScript only
- No test setup currently

## Code Style Guidelines
- **Components**: Functional components with hooks, PascalCase naming
- **Files**: PascalCase for components (.jsx extension), camelCase for utilities
- **Imports**: ES6 imports, component imports include .jsx extension
- **Formatting**: 2-space indentation, semicolons, single quotes for strings
- **Variables**: camelCase for variables/functions, UPPER_CASE for constants
- **JSX**: Double quotes for JSX attributes
- **Error Handling**: try/catch blocks, console.error for logging, user feedback with alerts
- **CSS**: Tailwind utility classes, use existing color and sizing conventions

## Board Themes
- App includes multiple board themes (Classic, Yotsuba, Serious, Yotsuba Pink)
- Follow existing theme structure when modifying UI components