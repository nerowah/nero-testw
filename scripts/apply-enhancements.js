#!/usr/bin/env node

/**
 * Script to apply enhancements to the OSSkins project
 * This script will backup original files and apply the enhanced versions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENHANCEMENTS = {
  files: [
    {
      source: 'src/app/enhanced-page.tsx',
      target: 'src/app/page.tsx',
      backup: 'src/app/page.tsx.backup'
    },
    {
      source: 'src/app/enhanced-layout.tsx',
      target: 'src/app/layout.tsx',
      backup: 'src/app/layout.tsx.backup'
    },
    {
      source: 'src/app/enhanced-globals.css',
      target: 'src/app/globals.css',
      backup: 'src/app/globals.css.backup'
    },
    {
      source: 'next.config.enhanced.ts',
      target: 'next.config.ts',
      backup: 'next.config.ts.backup'
    }
  ],
  newComponents: [
    'src/components/AppInitializer.tsx',
    'src/components/EnhancedLoading.tsx',
    'src/components/EnhancedChampionCard.tsx',
    'src/components/layout/EnhancedTopBar.tsx',
    'src/components/ui/badge.tsx',
    'src/lib/utils/performance-utils.ts'
  ],
  dependencies: {
    'framer-motion': '^11.0.8'
  }
};

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function createBackup(originalPath, backupPath) {
  if (fileExists(originalPath)) {
    fs.copyFileSync(originalPath, backupPath);
    log(`✓ Backup created: ${backupPath}`, 'success');
    return true;
  }
  return false;
}

function copyFile(sourcePath, targetPath) {
  try {
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');
    
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    fs.writeFileSync(targetPath, sourceContent);
    log(`✓ Enhanced file applied: ${targetPath}`, 'success');
    return true;
  } catch (error) {
    log(`✗ Failed to copy ${sourcePath} to ${targetPath}: ${error.message}`, 'error');
    return false;
  }
}

function installDependencies() {
  try {
    log('Installing enhanced dependencies...', 'info');
    
    // Check if package.json exists
    if (!fileExists('package.json')) {
      log('✗ package.json not found', 'error');
      return false;
    }
    
    // Read current package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Add new dependencies
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...ENHANCEMENTS.dependencies
    };
    
    // Write updated package.json
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    log('✓ package.json updated with new dependencies', 'success');
    
    // Install dependencies
    if (fileExists('pnpm-lock.yaml')) {
      execSync('pnpm install', { stdio: 'inherit' });
    } else if (fileExists('yarn.lock')) {
      execSync('yarn install', { stdio: 'inherit' });
    } else {
      execSync('npm install', { stdio: 'inherit' });
    }
    
    log('✓ Dependencies installed successfully', 'success');
    return true;
  } catch (error) {
    log(`✗ Failed to install dependencies: ${error.message}`, 'error');
    return false;
  }
}

function applyEnhancements() {
  log('🚀 Applying OSSkins Enhancements...', 'info');
  log('=====================================', 'info');
  
  let success = true;
  
  // Step 1: Create backups and apply file replacements
  log('\n📁 Processing file replacements...', 'info');
  for (const fileConfig of ENHANCEMENTS.files) {
    if (fileExists(fileConfig.source)) {
      // Create backup if original exists
      if (fileExists(fileConfig.target)) {
        createBackup(fileConfig.target, fileConfig.backup);
      }
      
      // Copy enhanced file
      if (!copyFile(fileConfig.source, fileConfig.target)) {
        success = false;
      }
    } else {
      log(`⚠ Enhanced file not found: ${fileConfig.source}`, 'warning');
    }
  }
  
  // Step 2: Copy new components
  log('\n🧩 Copying new components...', 'info');
  for (const componentPath of ENHANCEMENTS.newComponents) {
    if (fileExists(componentPath)) {
      log(`✓ Component available: ${componentPath}`, 'success');
    } else {
      log(`⚠ Component not found: ${componentPath}`, 'warning');
    }
  }
  
  // Step 3: Install dependencies
  log('\n📦 Installing dependencies...', 'info');
  if (!installDependencies()) {
    success = false;
  }
  
  // Step 4: Generate summary
  log('\n📊 Enhancement Summary', 'info');
  log('======================', 'info');
  
  if (success) {
    log('✅ All enhancements applied successfully!', 'success');
    log('\n🎉 Your OSSkins application now includes:', 'info');
    log('  • Modern glass morphism UI design', 'info');
    log('  • Advanced multi-phase loading system', 'info');
    log('  • Performance optimizations and lazy loading', 'info');
    log('  • Smooth animations with Framer Motion', 'info');
    log('  • Enhanced component architecture', 'info');
    
    log('\n🚀 Next steps:', 'info');
    log('  1. Start the development server: pnpm dev', 'info');
    log('  2. Test the enhanced features', 'info');
    log('  3. Check ENHANCEMENTS.md for detailed documentation', 'info');
    
    if (ENHANCEMENTS.files.some(f => fileExists(f.backup))) {
      log('\n💾 Backup files created for rollback if needed', 'warning');
    }
  } else {
    log('❌ Some enhancements failed to apply', 'error');
    log('Check the error messages above and try again', 'error');
  }
  
  return success;
}

function showUsage() {
  log('🛠️  OSSkins Enhancement Installer', 'info');
  log('================================', 'info');
  log('', 'info');
  log('Usage: node scripts/apply-enhancements.js [options]', 'info');
  log('', 'info');
  log('Options:', 'info');
  log('  --help, -h     Show this help message', 'info');
  log('  --dry-run      Show what would be changed without applying', 'info');
  log('  --backup-only  Only create backups without applying changes', 'info');
  log('', 'info');
  log('This script will:', 'info');
  log('  • Backup your existing files', 'info');
  log('  • Apply enhanced components and configurations', 'info');
  log('  • Install required dependencies', 'info');
  log('  • Provide rollback capabilities', 'info');
}

function dryRun() {
  log('🔍 Dry Run - What would be changed:', 'info');
  log('===================================', 'info');
  
  log('\n📁 Files that would be replaced:', 'info');
  for (const fileConfig of ENHANCEMENTS.files) {
    const status = fileExists(fileConfig.target) ? '(exists - will backup)' : '(new file)';
    log(`  • ${fileConfig.target} ${status}`, 'info');
  }
  
  log('\n🧩 New components that would be available:', 'info');
  for (const componentPath of ENHANCEMENTS.newComponents) {
    const status = fileExists(componentPath) ? '✓' : '✗';
    log(`  ${status} ${componentPath}`, 'info');
  }
  
  log('\n📦 Dependencies that would be added:', 'info');
  for (const [dep, version] of Object.entries(ENHANCEMENTS.dependencies)) {
    log(`  • ${dep}@${version}`, 'info');
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }
  
  if (args.includes('--dry-run')) {
    dryRun();
    return;
  }
  
  if (args.includes('--backup-only')) {
    log('📁 Creating backups only...', 'info');
    for (const fileConfig of ENHANCEMENTS.files) {
      if (fileExists(fileConfig.target)) {
        createBackup(fileConfig.target, fileConfig.backup);
      }
    }
    log('✅ Backups created successfully', 'success');
    return;
  }
  
  // Apply enhancements
  const success = applyEnhancements();
  process.exit(success ? 0 : 1);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { applyEnhancements, ENHANCEMENTS };
