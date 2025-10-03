# MyCash Deployment Guide

This guide covers deploying MyCash to various platforms including web, Android, iOS, and desktop.

## Prerequisites

Ensure you have completed the development setup as outlined in `DEVELOPMENT.md`.

## Web Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

1. **Build the app:**
   \`\`\`bash
   npm run build:prod
   \`\`\`

2. **Deploy the \`www\` folder** to your hosting provider:
   - **Netlify**: Drag and drop the \`www\` folder or connect your Git repository
   - **Vercel**: Connect your repository and set build command to \`npm run build:prod\`
   - **GitHub Pages**: Push \`www\` contents to \`gh-pages\` branch

### Self-Hosted Server

1. **Build the app:**
   \`\`\`bash
   npm run build:prod
   \`\`\`

2. **Copy \`www\` folder contents** to your web server directory

3. **Configure server** for SPA routing (redirect all routes to \`index.html\`)

## Android Deployment

### Prerequisites
- Android Studio installed
- Android SDK configured
- Valid Google Play Developer account (for store deployment)

### Development Build
\`\`\`bash
# Add Android platform (first time only)
npm run cap:add:android

# Build and open in Android Studio
npm run android:build
\`\`\`

### Production APK
1. **In Android Studio:**
   - Build > Generate Signed Bundle/APK
   - Create or use existing keystore
   - Build release APK

2. **Install on device:**
   \`\`\`bash
   adb install app-release.apk
   \`\`\`

### Google Play Store
1. **Build signed AAB:**
   - In Android Studio: Build > Generate Signed Bundle/APK
   - Choose Android App Bundle
   - Upload to Google Play Console

2. **Store listing:**
   - Add app description, screenshots, privacy policy
   - Complete content rating questionnaire
   - Submit for review

## iOS Deployment

### Prerequisites (macOS only)
- Xcode installed
- Apple Developer account
- Valid certificates and provisioning profiles

### Development Build
\`\`\`bash
# Add iOS platform (first time only)
npm run cap:add:ios

# Build and open in Xcode
npm run ios:build
\`\`\`

### TestFlight/App Store
1. **In Xcode:**
   - Select "Any iOS Device" as target
   - Product > Archive
   - Upload to App Store Connect

2. **App Store Connect:**
   - Add app metadata, screenshots, privacy policy
   - Submit for App Store review

## Desktop Deployment

### Electron (Cross-platform desktop)

1. **Install Electron support:**
   \`\`\`bash
   npm install @capacitor-community/electron
   npx cap add @capacitor-community/electron
   \`\`\`

2. **Build desktop app:**
   \`\`\`bash
   npm run build:prod
   npx cap sync @capacitor-community/electron
   npx cap open @capacitor-community/electron
   \`\`\`

3. **Package for distribution:**
   - Use Electron Builder or Electron Forge
   - Create installers for Windows, macOS, Linux

### Progressive Web App (PWA)

1. **Add service worker** (optional, for offline support)
2. **Configure manifest.json** for installability
3. **Deploy to HTTPS** (required for PWA features)

## Environment Configuration

### Production Environment
Create \`src/environments/environment.prod.ts\`:
\`\`\`typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com',
  appVersion: '1.0.0'
};
\`\`\`

### Build Optimization
- Enable production mode
- Minify JavaScript and CSS
- Optimize images and assets
- Enable gzip compression on server

## App Store Requirements

### Icons and Splash Screens
Generate app icons for all platforms:
\`\`\`bash
# Install cordova-res for icon generation
npm install -g cordova-res

# Generate icons and splash screens
cordova-res --skip-config --copy
\`\`\`

### Required Files
- **Android**: \`android/app/src/main/res/\` (icons, splash screens)
- **iOS**: \`ios/App/App/Assets.xcassets/\` (icons, splash screens)
- **Web**: \`src/assets/icon/\` (favicon, PWA icons)

### Privacy Policy
Create a privacy policy document covering:
- Data collection practices
- Local storage usage
- Third-party services (if any)
- User rights and data deletion

### App Descriptions

#### Short Description (80 characters)
"Personal spending tracker with offline SQLite storage and analytics."

#### Long Description
"MyCash is a comprehensive personal finance app that helps you track spending, manage budgets, and analyze your financial habits. Built with modern web technologies, it works offline and syncs across all your devices.

Key Features:
✓ Track all your expenses with detailed categories
✓ Recurring bill management
✓ Visual analytics and spending insights
✓ Export data to CSV for analysis
✓ Complete offline functionality
✓ Material Design interface
✓ Cross-platform compatibility"

## Performance Optimization

### Bundle Size
- Tree shaking enabled
- Lazy loading of routes
- Dynamic imports for large libraries

### Database Performance
- Indexed SQLite queries
- Efficient data pagination
- Background sync operations

### Mobile Performance
- Optimized images
- Minimal JavaScript payload
- Hardware acceleration for animations

## Security Considerations

### Data Protection
- Local SQLite database encryption (optional)
- Input validation and sanitization
- Secure communication (HTTPS only)

### App Security
- Obfuscated production builds
- Certificate pinning (mobile)
- Runtime application self-protection (RASP)

## Monitoring and Analytics

### Error Tracking
Consider integrating:
- Sentry for error monitoring
- Google Analytics for usage tracking
- Performance monitoring tools

### User Feedback
- In-app feedback forms
- App store review prompts
- Support contact mechanisms

## Troubleshooting Deployment Issues

### Common Android Issues
- **Build failures**: Check Android SDK versions
- **Signing errors**: Verify keystore configuration
- **Permission issues**: Review manifest permissions

### Common iOS Issues
- **Certificate errors**: Update provisioning profiles
- **Xcode build failures**: Clean derived data
- **Upload issues**: Check bundle identifier

### Web Deployment Issues
- **Routing problems**: Configure server for SPA
- **CORS errors**: Set proper headers
- **Performance issues**: Enable compression

## Post-Deployment

### Version Updates
1. Update version in \`package.json\` and \`capacitor.config.ts\`
2. Build new versions for each platform
3. Deploy web updates automatically
4. Submit mobile updates to app stores

### User Support
- Monitor app store reviews
- Respond to user feedback
- Maintain documentation and help resources
- Plan regular feature updates

## Automation

### CI/CD Pipeline
Consider setting up:
- Automated testing on commits
- Automated builds for releases
- Deployment to staging environments
- Automated app store submissions

### Scripts
Use the provided npm scripts in \`package.json\` for consistent builds across environments.