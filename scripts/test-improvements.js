#!/usr/bin/env node

/**
 * Test script for OSskins improvements
 * Validates code quality, TypeScript compilation, and basic functionality
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🧪 Testing OSskins Improvements...\n');

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function addTest(name, passed, details = '') {
  results.tests.push({ name, passed, details });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
  }
}

// Helper function to run shell commands
function runCommand(command, cwd = projectRoot) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Helper function to check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(path.resolve(projectRoot, filePath));
    return true;
  } catch {
    return false;
  }
}

// Helper function to check file content
async function checkFileContent(filePath, searchString) {
  try {
    const content = await fs.readFile(path.resolve(projectRoot, filePath), 'utf-8');
    return content.includes(searchString);
  } catch {
    return false;
  }
}

async function runTests() {
  console.log('📁 Checking file structure...');
  
  // Test 1: Check if new files exist
  const newFiles = [
    'src/components/EnhancedLoading.tsx',
    'src/components/ErrorBoundary.tsx',
    'src/lib/hooks/use-virtualization.ts'
  ];
  
  for (const file of newFiles) {
    const exists = await fileExists(file);
    addTest(`New file exists: ${file}`, exists);
  }

  // Test 2: Check critical fixes
  console.log('\n🔧 Checking critical fixes...');
  
  const hasCorrectChampionGridProps = await checkFileContent(
    'src/components/ChampionGrid.tsx',
    'selectedChampionId: number | null'
  );
  addTest('ChampionGrid props interface fixed', hasCorrectChampionGridProps);

  const hasErrorBoundaryInLayout = await checkFileContent(
    'src/app/layout.tsx',
    'ErrorBoundary'
  );
  addTest('ErrorBoundary integrated in layout', hasErrorBoundaryInLayout);

  // Test 3: Check enhanced components
  console.log('\n🎨 Checking component enhancements...');
  
  const hasFramerMotion = await checkFileContent(
    'src/components/SkinCard.tsx',
    'framer-motion'
  );
  addTest('Framer Motion integration', hasFramerMotion);

  const hasScrollArea = await checkFileContent(
    'src/components/ChampionGrid.tsx',
    'ScrollArea'
  );
  addTest('ScrollArea integration', hasScrollArea);

  const hasEnhancedLoading = await checkFileContent(
    'src/app/page.tsx',
    'ChampionLoading'
  );
  addTest('Enhanced loading components', hasEnhancedLoading);

  // Test 4: Check CSS enhancements
  console.log('\n💎 Checking CSS enhancements...');
  
  const hasSmoothScroll = await checkFileContent(
    'src/app/globals.css',
    'scroll-behavior: smooth'
  );
  addTest('Smooth scroll CSS', hasSmoothScroll);

  const hasAnimationUtilities = await checkFileContent(
    'src/app/globals.css',
    '@keyframes fadeInUp'
  );
  addTest('Animation utilities', hasAnimationUtilities);

  const hasEnhancedScrollbar = await checkFileContent(
    'src/app/globals.css',
    'hover:bg-border/80'
  );
  addTest('Enhanced scrollbar styling', hasEnhancedScrollbar);

  // Test 5: Check TypeScript compilation
  console.log('\n🏗️ Checking TypeScript compilation...');
  
  try {
    await runCommand('npx tsc --noEmit --skipLibCheck');
    addTest('TypeScript compilation', true);
  } catch (error) {
    addTest('TypeScript compilation', false, error.stderr || error.stdout);
  }

  // Test 6: Check package.json dependencies
  console.log('\n📦 Checking dependencies...');
  
  const hasFramerMotionDep = await checkFileContent(
    'package.json',
    '"framer-motion"'
  );
  addTest('Framer Motion dependency', hasFramerMotionDep);

  const hasRadixScrollArea = await checkFileContent(
    'package.json',
    '"@radix-ui/react-scroll-area"'
  );
  addTest('Radix ScrollArea dependency', hasRadixScrollArea);

  // Test 7: Check component exports
  console.log('\n🔍 Checking component exports...');
  
  const hasEnhancedLoadingExports = await checkFileContent(
    'src/components/EnhancedLoading.tsx',
    'export const ChampionLoading'
  );
  addTest('Enhanced loading exports', hasEnhancedLoadingExports);

  const hasErrorBoundaryExports = await checkFileContent(
    'src/components/ErrorBoundary.tsx',
    'export class ErrorBoundary'
  );
  addTest('ErrorBoundary exports', hasErrorBoundaryExports);

  // Test 8: Check memoization
  console.log('\n⚡ Checking performance optimizations...');
  
  const hasChampionGridMemo = await checkFileContent(
    'src/components/ChampionGrid.tsx',
    'React.memo'
  );
  addTest('ChampionGrid memoization', hasChampionGridMemo);

  const hasSkinCardMemo = await checkFileContent(
    'src/components/SkinCard.tsx',
    'React.memo'
  );
  addTest('SkinCard memoization', hasSkinCardMemo);

  // Final results
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 All improvements successfully implemented!');
    console.log('🚀 Your OSskins application is ready with enhanced UI/UX!');
  } else {
    console.log('\n⚠️  Some issues detected. Please review the failed tests above.');
  }

  console.log('\n📋 Detailed Test Report:');
  results.tests.forEach((test, index) => {
    const status = test.passed ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${test.name}`);
    if (!test.passed && test.details) {
      console.log(`   Details: ${test.details}`);
    }
  });

  return results.failed === 0;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
