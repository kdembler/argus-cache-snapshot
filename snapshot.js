const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');
require('dotenv').config();

const CACHE_FILE_PATH = process.env.CACHE_FILE_PATH;
if (!fs.existsSync(CACHE_FILE_PATH)) {
  throw new Error(`CACHE_FILE_PATH does not exist: ${CACHE_FILE_PATH}`);
}
const DATA_DIRECTORY_PATH = process.env.DATA_DIRECTORY_PATH;
if (!fs.existsSync(DATA_DIRECTORY_PATH)) {
  throw new Error(`DATA_DIRECTORY_PATH does not exist: ${DATA_DIRECTORY_PATH}`);
}
const OUTPUT_DIRECTORY_PATH = process.env.OUTPUT_DIRECTORY_PATH;
if (!fs.existsSync(OUTPUT_DIRECTORY_PATH)) {
  throw new Error(`OUTPUT_DIRECTORY_PATH does not exist: ${OUTPUT_DIRECTORY_PATH}`);
}
const STORAGE_LOG_PATH = path.join(OUTPUT_DIRECTORY_PATH, 'storage-log.txt');
const CRON_SCHEDULE = process.env.CRON_SCHEDULE ?? '0 0 * * *'

const getDirectorySize = (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  });
  return size;
};

const takeCacheSnapshot = () => {
  console.log('Taking cache snapshot...');
  const timestamp = new Date().toISOString();
  const snapshotFileName = 'cache' + '_' + timestamp + path.extname(CACHE_FILE_PATH);
  const snapshotFilePath = path.join(OUTPUT_DIRECTORY_PATH, snapshotFileName);
  fs.copyFileSync(CACHE_FILE_PATH, snapshotFilePath);
  console.log(`Cache snapshot taken and saved as ${snapshotFileName}`);
};

// Function to log the storage space
const logStorageSpace = () => {
  console.log('Logging storage space...');
  const size = getDirectorySize(DATA_DIRECTORY_PATH);
  const log = `${new Date().toISOString()} - ${size} bytes\n`;
  if (!fs.existsSync(STORAGE_LOG_PATH)) {
    fs.writeFileSync(STORAGE_LOG_PATH, log);
  } else {
    fs.appendFileSync(STORAGE_LOG_PATH, log);
  }
  console.log(`Storage space logged: ${size} bytes`);
};

console.log(`Scheduling tasks using cron expression "${CRON_SCHEDULE}"...`);
cron.schedule(CRON_SCHEDULE, () => {
  console.log('Scheduled tasks started...');
  takeCacheSnapshot();
  logStorageSpace();
  console.log('Scheduled tasks completed.');
});