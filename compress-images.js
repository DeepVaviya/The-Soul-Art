/**
 * Image Compression Script for The Soul Art
 * Converts all JPEG images to optimized WebP format
 * Run: node compress-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const QUALITY = 75; // WebP quality (0-100), 75 is a great balance

async function compressImages() {
    const folders = fs.readdirSync(IMAGES_DIR).filter(f =>
        fs.statSync(path.join(IMAGES_DIR, f)).isDirectory()
    );

    let totalOriginal = 0;
    let totalCompressed = 0;
    let fileCount = 0;

    for (const folder of folders) {
        const folderPath = path.join(IMAGES_DIR, folder);
        const files = fs.readdirSync(folderPath).filter(f =>
            /\.(jpe?g|png)$/i.test(f)
        );

        for (const file of files) {
            const inputPath = path.join(folderPath, file);
            const outputName = file.replace(/\.(jpe?g|png)$/i, '.webp');
            const outputPath = path.join(folderPath, outputName);

            const originalSize = fs.statSync(inputPath).size;
            totalOriginal += originalSize;

            try {
                await sharp(inputPath)
                    .resize({ width: 800, height: 1200, fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: QUALITY })
                    .toFile(outputPath);

                const compressedSize = fs.statSync(outputPath).size;
                totalCompressed += compressedSize;
                fileCount++;

                const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
                console.log(`✓ ${folder}/${file} → ${outputName} (${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB, -${savings}%)`);
            } catch (err) {
                console.error(`✗ Failed: ${folder}/${file} - ${err.message}`);
            }
        }
    }

    // Also compress root-level images (like me.jpeg)
    const rootFiles = fs.readdirSync(IMAGES_DIR).filter(f =>
        /\.(jpe?g|png)$/i.test(f)
    );

    for (const file of rootFiles) {
        const inputPath = path.join(IMAGES_DIR, file);
        const outputName = file.replace(/\.(jpe?g|png)$/i, '.webp');
        const outputPath = path.join(IMAGES_DIR, outputName);

        const originalSize = fs.statSync(inputPath).size;
        totalOriginal += originalSize;

        try {
            await sharp(inputPath)
                .resize({ width: 800, height: 1200, fit: 'inside', withoutEnlargement: true })
                .webp({ quality: QUALITY })
                .toFile(outputPath);

            const compressedSize = fs.statSync(outputPath).size;
            totalCompressed += compressedSize;
            fileCount++;

            const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
            console.log(`✓ ${file} → ${outputName} (${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB, -${savings}%)`);
        } catch (err) {
            console.error(`✗ Failed: ${file} - ${err.message}`);
        }
    }

    console.log(`\n═══ Summary ═══`);
    console.log(`Files: ${fileCount}`);
    console.log(`Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed: ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Saved: ${((totalOriginal - totalCompressed) / 1024 / 1024).toFixed(2)} MB (${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%)`);
}

compressImages().catch(console.error);
