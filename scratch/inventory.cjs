const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const rootDir = 'C:\\Users\\diksha\\OneDrive\\Desktop\\SalonQueueManagementSystem';
const allFiles = getAllFiles(rootDir);

const fileSummary = allFiles.map(filePath => {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const stat = fs.statSync(filePath);
  let lines = 0;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    lines = content.split('\n').length;
  } catch (e) {}
  return { path: relPath, size: stat.size, lines };
});

fs.writeFileSync(
  'C:\\Users\\diksha\\.gemini\\antigravity\\brain\\0740d0c3-a6e3-4414-a6cf-b3663917f05e\\scratch\\file_inventory.json',
  JSON.stringify(fileSummary, null, 2),
  'utf8'
);

console.log(`Inventory collected: ${fileSummary.length} files.`);
fileSummary.forEach(f => console.log(`${f.path} (${f.lines} lines, ${f.size} bytes)`));
