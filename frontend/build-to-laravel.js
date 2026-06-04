import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDist = path.join(__dirname, 'dist');
const backendPublic = path.resolve(__dirname, '../backend/public');
const backendViews = path.resolve(__dirname, '../backend/resources/views');

// Helper to copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 1. Run Vite build
console.log('Building Vite frontend...');
try {
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('Frontend build failed:', error);
    process.exit(1);
}

// 2. Clean up existing build assets in Laravel public (to prevent accumulation of old chunks)
console.log('Cleaning up old assets in Laravel public/assets...');
const backendPublicAssets = path.join(backendPublic, 'assets');
if (fs.existsSync(backendPublicAssets)) {
    fs.rmSync(backendPublicAssets, { recursive: true, force: true });
}

// 3. Copy assets and other files from dist to backend/public (except index.html)
console.log('Copying built assets to Laravel...');
if (fs.existsSync(frontendDist)) {
    const entries = fs.readdirSync(frontendDist, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(frontendDist, entry.name);
        const destPath = path.join(backendPublic, entry.name);
        
        if (entry.name === 'index.html') {
            // Copy index.html to resources/views/app.blade.php
            const viewsPath = path.join(backendViews, 'app.blade.php');
            if (!fs.existsSync(backendViews)) {
                fs.mkdirSync(backendViews, { recursive: true });
            }
            fs.copyFileSync(srcPath, viewsPath);
            console.log(`Copied index.html -> ${viewsPath}`);
        } else {
            if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
            console.log(`Copied ${entry.name} -> ${destPath}`);
        }
    }
    console.log('\n======================================================');
    console.log('SUCCESS: Frontend compiled and integrated into Laravel!');
    console.log('You can now run "php artisan serve" inside "backend"');
    console.log('and access everything on http://127.0.0.1:8000');
    console.log('======================================================\n');
} else {
    console.error('Error: Dist folder not found!');
    process.exit(1);
}
