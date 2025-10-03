# MyCash Development Environment

## Prerequisites Checklist

- [ ] Node.js v20.19+ or v22.12+ installed
- [ ] npm 6.11+ or yarn 1.13+ installed
- [ ] Git installed
- [ ] VS Code (recommended) with Angular extensions
- [ ] Android Studio (for Android development)
- [ ] Xcode (for iOS development, macOS only)

## Quick Start Commands

### Development
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm start

# Start with device preview
npm run dev
\`\`\`

### Building
\`\`\`bash
# Build for web
npm run build

# Build for production
npm run build:prod
\`\`\`

### Mobile Development
\`\`\`bash
# Add Android platform
npm run cap:add:android

# Add iOS platform (macOS only)
npm run cap:add:ios

# Sync and run on Android
npm run cap:run:android

# Sync and run on iOS
npm run cap:run:ios
\`\`\`

### Development Workflow
1. Make changes to source code
2. Test in browser with \`npm start\`
3. Test on device with \`npm run android:dev\` or iOS simulator
4. Build and test native apps with platform-specific commands

## Environment Variables
Create a \`.env\` file in the project root (not included in Git):
\`\`\`
# Development settings
NODE_ENV=development
IONIC_DEV_SERVER_PORT=8100

# Database settings
DB_NAME=mycash.db
DB_VERSION=1
\`\`\`

## Recommended VS Code Extensions
- Angular Language Service
- TypeScript Importer
- Prettier
- ESLint
- Ionic Extension
- Auto Rename Tag
- Bracket Pair Colorizer

## Browser Development Tools
- Chrome DevTools for debugging
- Angular DevTools extension
- Redux DevTools (if using state management)

## Debugging Tips
1. Use Chrome DevTools for web debugging
2. Use Android Studio or Xcode for native debugging
3. Check console logs in browser/device
4. Use Angular DevTools for component inspection
5. Monitor network requests for data flow

## File Structure Best Practices
- Components in \`src/app/components/\`
- Services in \`src/app/services/\`
- Models in \`src/app/models/\`
- Shared modules in \`src/app/shared/\`
- Assets in \`src/assets/\`