#!/usr/bin/env node
/**
 * Data synchronization script
 * Copies essential data from experience repo to portfolio repo
 */

const fs = require('fs');
const path = require('path');

// Configuration
const EXPERIENCE_REPO_PATH = process.env.EXPERIENCE_REPO_PATH || '../experience';
const DATA_DIR = path.join(__dirname, '../data');

// Source paths in experience repo
const SOURCE_PATHS = {
  masterData: `${EXPERIENCE_REPO_PATH}/companies/las-vegas-sands/data/master-data.yaml`,
  timeline: `${EXPERIENCE_REPO_PATH}/companies/las-vegas-sands/data/timeline.json`, 
  careerTimeline: `${EXPERIENCE_REPO_PATH}/data/career-timeline.json`
};

// Destination paths in portfolio repo
const DEST_PATHS = {
  masterData: path.join(DATA_DIR, 'master-data.yaml'),
  timeline: path.join(DATA_DIR, 'timeline.json'),
  careerTimeline: path.join(DATA_DIR, 'career-timeline.json')
};

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      console.warn(`⚠️  Source file not found: ${src}`);
      return false;
    }
    
    ensureDirectoryExists(dest);
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied: ${path.basename(src)} -> ${dest}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to copy ${src}: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🔄 Starting data synchronization...');
  console.log(`📂 Experience repo path: ${EXPERIENCE_REPO_PATH}`);
  
  let successCount = 0;
  let totalCount = 0;
  
  for (const [key, srcPath] of Object.entries(SOURCE_PATHS)) {
    totalCount++;
    if (copyFile(srcPath, DEST_PATHS[key])) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Sync complete: ${successCount}/${totalCount} files copied`);
  
  if (successCount === totalCount) {
    console.log('✅ All data files synchronized successfully');
    process.exit(0);
  } else {
    console.log('⚠️  Some files failed to sync');
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  // Support command line argument for experience repo path
  if (process.argv[2]) {
    EXPERIENCE_REPO_PATH = process.argv[2];
  }
  main();
}

module.exports = { copyFile, ensureDirectoryExists };