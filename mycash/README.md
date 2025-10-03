# MyCash - Personal Spending Tracker

MyCash is a cross-platform mobile application built with Ionic and Angular for tracking personal spending and managing household expenses. The app features a modern Material Design UI and uses SQLite for local data storage.

## Features

### 🎯 Core Functionality
- **Add/Edit/Delete Spending Entries**: Track all your expenses with detailed information
- **Categories**: Organize spending by categories (Food, Transport, Utilities, etc.)
- **Recurring Expenses**: Mark and track recurring bills and subscriptions
- **Analytics Dashboard**: View spending summaries and category breakdowns
- **Data Export**: Export your data as CSV for external analysis
- **Offline Support**: All data stored locally using SQLite

### 🎨 User Interface
- Modern Material Design components
- Responsive design for all screen sizes
- Intuitive navigation with bottom tabs
- Dark/Light theme support
- Smooth animations and transitions

### 📱 Cross-Platform Support
- Android (via Capacitor)
- iOS (via Capacitor) 
- Web browser
- Desktop (Linux, Windows, macOS via Electron)

## Technical Stack

### Frontend
- **Angular 20+**: Modern TypeScript framework
- **Ionic 8**: Cross-platform UI framework
- **Material Design**: UI component library
- **Standalone Components**: Latest Angular architecture

### Backend/Storage
- **SQLite**: Local database for data persistence
- **Capacitor Community SQLite**: SQLite plugin for mobile platforms

### Build Tools
- **Capacitor**: Native app packaging
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe development

## Project Structure

\`\`\`
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── spending-list/    # List view of all spending entries
│   │   ├── spending-form/    # Add/Edit spending form
│   │   └── spending-detail/  # Detailed view of spending entry
│   ├── models/              # TypeScript interfaces and enums
│   │   └── spending.model.ts # Spending data models
│   ├── services/            # Business logic services
│   │   ├── database.service.ts  # SQLite database operations
│   │   └── spending.service.ts  # Spending data management
│   ├── shared/              # Shared modules
│   │   └── material/        # Material Design module
│   ├── tabs/                # Tab navigation structure
│   │   ├── tab1/            # Spending List tab
│   │   ├── tab2/            # Analytics tab
│   │   └── tab3/            # Settings tab
│   └── app.routes.ts        # Application routing
├── assets/                  # Static assets
├── theme/                   # Custom theming
└── global.scss             # Global styles
\`\`\`

## Prerequisites

### Required Software
- Node.js v20.19+ or v22.12+ (for Angular CLI compatibility)
- npm 6.11+ or yarn 1.13+
- Git

### Development Tools (Optional)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- VS Code with Angular extensions

## Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd mycash
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Install Global CLI Tools
\`\`\`bash
npm install -g @ionic/cli @angular/cli
\`\`\`

### 4. Run in Development Mode
\`\`\`bash
ionic serve
\`\`\`

The app will be available at \`http://localhost:8100\`

## Building for Production

### Web Build
\`\`\`bash
ionic build
\`\`\`

### Mobile App Build
First, add the mobile platforms:
\`\`\`bash
# Android
npx cap add android

# iOS (macOS only)
npx cap add ios
\`\`\`

Build and sync:
\`\`\`bash
ionic build
npx cap sync
\`\`\`

Open in native IDE:
\`\`\`bash
# Android
npx cap open android

# iOS
npx cap open ios
\`\`\`

### Desktop Build
For desktop applications, you can use Capacitor with Electron:
\`\`\`bash
npm install @capacitor-community/electron
npx cap add @capacitor-community/electron
npx cap open @capacitor-community/electron
\`\`\`

## Database Schema

The app uses SQLite with the following main table structure:

### spending table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Unique spending entry ID |
| description | TEXT NOT NULL | Spending description |
| amount | REAL NOT NULL | Spending amount |
| category | TEXT NOT NULL | Spending category |
| date | TEXT NOT NULL | Spending date (ISO string) |
| isRecurring | INTEGER | Boolean flag for recurring expenses |
| recurringType | TEXT | Type of recurrence (daily/weekly/monthly/yearly) |
| notes | TEXT | Optional notes |
| createdAt | TEXT NOT NULL | Creation timestamp |
| updatedAt | TEXT NOT NULL | Last update timestamp |

## Development Guidelines

### Code Structure
- Use standalone components for better tree-shaking
- Implement reactive programming with RxJS
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling

### Data Management
- All database operations are async
- Use services for business logic
- Implement proper loading states
- Handle offline scenarios

### UI/UX
- Follow Material Design principles
- Ensure mobile-first responsive design
- Implement proper loading indicators
- Use Ionic native components when possible

## Available Scripts

| Command | Description |
|---------|-------------|
| \`ionic serve\` | Start development server |
| \`ionic build\` | Build for production |
| \`ionic generate component <name>\` | Generate new component |
| \`ionic generate service <name>\` | Generate new service |
| \`npx cap sync\` | Sync web build to native platforms |
| \`npx cap run android\` | Run on Android device/emulator |
| \`npx cap run ios\` | Run on iOS device/simulator |

## Key Features Implementation

### Spending Management
- CRUD operations for spending entries
- Category-based filtering
- Date range queries
- Search functionality

### Analytics
- Total spending calculations
- Category breakdowns
- Monthly averages
- Visual representation with charts (can be extended)

### Data Export
- CSV export functionality
- Backup and restore capabilities
- Data migration support

### Settings
- App information display
- Data management tools
- Export/import features
- Platform detection

## Performance Considerations

- Lazy loading of modules
- Virtual scrolling for large lists
- Efficient database queries with indexes
- Optimized bundle size with tree-shaking
- Service worker for caching (web)

## Security Features

- Local data storage only (no cloud by default)
- SQLite encryption capabilities
- Input validation and sanitization
- XSS protection

## Extending the App

### Adding New Features
1. Create new components in \`src/app/components/\`
2. Add new services in \`src/app/services/\`
3. Update routing in \`app.routes.ts\`
4. Add new database tables if needed

### Customizing UI
1. Modify theme variables in \`src/theme/variables.scss\`
2. Update Material theme in \`src/global.scss\`
3. Add custom CSS in component style files

### Adding New Platforms
1. Install platform-specific Capacitor plugins
2. Update \`capacitor.config.ts\`
3. Add platform-specific code with Capacitor APIs

## Troubleshooting

### Common Issues
1. **Node.js Version**: Ensure Node.js v20.19+ or v22.12+
2. **Build Errors**: Clear \`node_modules\` and reinstall
3. **SQLite Issues**: Check Capacitor SQLite plugin installation
4. **Platform Builds**: Ensure native development tools are installed

### Debug Tips
- Use Chrome DevTools for web debugging
- Use native IDE debuggers for mobile
- Check Capacitor logs with \`npx cap doctor\`
- Monitor SQLite operations with service logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and support:
- Check the troubleshooting guide above
- Create an issue in the repository
- Review Ionic and Angular documentation
- Check Capacitor community resources

## Roadmap

Future enhancements could include:
- Cloud synchronization
- Multiple currency support
- Budget planning features
- Receipt photo attachments
- Advanced analytics and reporting
- Data visualization charts
- Import from banking APIs
- Multi-user support
- Spending goals and alerts