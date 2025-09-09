// Test script to verify CivicPulse setup
const fs = require('fs');
const path = require('path');

console.log('🔍 CivicPulse Setup Verification');
console.log('================================\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server/package.json',
  'client/package.json',
  'server/index.js',
  'client/src/App.js',
  'server/models/Complaint.js',
  'server/routes/complaints.js'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n📦 Checking package.json scripts...');

// Check root package.json
try {
  const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'server', 'client', 'install-all'];
  
  requiredScripts.forEach(script => {
    if (rootPkg.scripts && rootPkg.scripts[script]) {
      console.log(`✅ Root script: ${script}`);
    } else {
      console.log(`❌ Root script: ${script} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading root package.json');
  allFilesExist = false;
}

// Check server package.json
try {
  const serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'cors', 'multer'];
  
  requiredDeps.forEach(dep => {
    if (serverPkg.dependencies && serverPkg.dependencies[dep]) {
      console.log(`✅ Server dependency: ${dep}`);
    } else {
      console.log(`❌ Server dependency: ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading server package.json');
  allFilesExist = false;
}

// Check client package.json
try {
  const clientPkg = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
  
  requiredDeps.forEach(dep => {
    if (clientPkg.dependencies && clientPkg.dependencies[dep]) {
      console.log(`✅ Client dependency: ${dep}`);
    } else {
      console.log(`❌ Client dependency: ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading client package.json');
  allFilesExist = false;
}

console.log('\n🔧 Setup Instructions:');
console.log('======================');

if (allFilesExist) {
  console.log('✅ All files are present!');
  console.log('\nNext steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: cd server && npm install && cd ..');
  console.log('3. Run: cd client && npm install && cd ..');
  console.log('4. Start MongoDB: mongod');
  console.log('5. Run: npm run dev');
  console.log('\nOr use the automated script:');
  console.log('- Windows: start.bat');
  console.log('- Mac/Linux: ./start.sh');
  console.log('- PowerShell: .\\start.ps1');
} else {
  console.log('❌ Some files are missing. Please check the setup.');
  console.log('\nTry running:');
  console.log('1. npm install');
  console.log('2. cd server && npm install && cd ..');
  console.log('3. cd client && npm install && cd ..');
}

console.log('\n📚 For detailed help, see:');
console.log('- MANUAL_SETUP.md');
console.log('- TROUBLESHOOTING.md');
console.log('- SETUP.md');
