# Project Setup Documentation

This document records the commands used to initialize this React Native/Expo project and includes links to relevant documentation.

## Initial Project Creation

### Command
```bash
npx create-expo-app@latest Scaffold --template blank-typescript
```

### Documentation
- [Expo documentation](https://docs.expo.dev/get-started/create-a-project/)
- [Expo CLI reference](https://docs.expo.dev/workflow/expo-cli/)
- [TypeScript template](https://docs.expo.dev/guides/typescript/)

### Command Breakdown
- `npx`: Execute npm packages without installing globally
- `create-expo-app@latest`: Use the latest version of Expo's project creation tool
- `Scaffold`: Name of the project directory
- `--template blank-typescript`: Start with a minimal TypeScript template

## Project Structure

This creates a blank React Native project with TypeScript support configured by default.

### Key Files Created
- `App.tsx`: Main application component
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `app.json`: Expo app configuration
- `assets/`: Directory for app assets (images, icons, etc.)

## Add Web Support

### Navigation to Project Directory
```bash
cd Scaffold
```

### Install Web Dependencies
```bash
npx expo install react-dom react-native-web
```

### Documentation
- [Expo web support](https://docs.expo.dev/workflow/web/)
- [React Native Web documentation](https://necolas.github.io/react-native-web/)
- [Expo platform-specific installations](https://docs.expo.dev/more/expo-cli/#install-expo-cli-packages)

### Command Breakdown
- `cd Scaffold`: Navigate to the project directory
- `npx expo install`: Use Expo's package installer to ensure version compatibility
- `react-dom`: React library for web rendering
- `react-native-web`: React Native implementation for web platforms

### Usage
After installation, you can run the app on web:
```bash
npx expo start --web
```

## Install Commitlint

### Install Commitlint Packages
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

### Documentation
- [Commitlint documentation](https://commitlint.js.org/)
- [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/)
- [Commitlint config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)

### Command Breakdown
- `npm install`: Install npm packages
- `-D`: Install as dev dependencies
- `@commitlint/cli`: Command line interface for commitlint
- `@commitlint/config-conventional`: Conventional commit message configuration

### Configuration Setup
Create the commitlint configuration file:
```bash
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.ts
```

### Command Breakdown
- `echo`: Print text to standard output
- `export default { extends: ['@commitlint/config-conventional'] }`: ES6 module syntax for configuration
- `> commitlint.config.ts`: Redirect output to create configuration file

### Files Created
- `commitlint.config.ts`: Commitlint configuration file with conventional commit rules

## Configure Husky Hooks

### Install Husky
```bash
npm install --save-dev husky
```

### Initialize Husky
```bash
npx husky init
```

### Add Commitlint Script to package.json
```bash
npm pkg set scripts.commitlint="commitlint --edit"
```

### Create Commit Message Hook
```bash
echo "npm run commitlint \${1}" > .husky/commit-msg
```

### Remove Default Pre-commit Hook
```bash
rm .husky/pre-commit
```

### Documentation
- [Husky documentation](https://typicode.github.io/husky/)
- [Husky getting started guide](https://typicode.github.io/husky/#/?id=install)
- [Git hooks documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

### Command Breakdown
- `npm install --save-dev husky`: Install husky as dev dependency
- `npx husky init`: Initialize husky configuration and create `.husky/` directory
- `npm pkg set scripts.commitlint="commitlint --edit"`: Add commitlint script to package.json
- `echo "npm run commitlint \${1}" > .husky/commit-msg`: Create commit-msg hook that runs commitlint
- `rm .husky/pre-commit`: Remove the default pre-commit hook created by husky init

### Files Created/Modified
- `.husky/`: Directory for git hooks
- `.husky/commit-msg`: Git hook that validates commit messages
- `package.json`: Updated with husky configuration and commitlint script

## Next Steps

Common commands for development:
- `npm install` - Install dependencies
- `npx expo start` - Start development server
- `npx expo start --web` - Start development server for web platform
- `npx expo run:android` - Run on Android
- `npx expo run:ios` - Run on iOS

## Additional Resources

- [Expo Getting Started Guide](https://docs.expo.dev/get-started/installation/)
- [React Native with Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
- [TypeScript in React Native](https://reactnative.dev/docs/typescript)
- [Expo Development Workflow](https://docs.expo.dev/workflow/overview/)