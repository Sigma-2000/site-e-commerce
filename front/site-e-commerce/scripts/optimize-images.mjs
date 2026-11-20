import sharp from 'sharp';
import path from 'node:path';
import { stat } from 'node:fs/promises';

const images = ['serenade.jpg', 'daragon.jpg', 'minotaure.jpg', 'souffre-d-ete.jpg'];

const directory = path.resolve('public/images');

for (const filename of images) {
    const input = path.join(directory, filename);
    const name = path.parse(filename).name;

    const output = path.join(directory, `${name}-optimized.webp`);

    try {
        await sharp(input)
            .resize({
                width: 800,
                withoutEnlargement: true,
            })
            .webp({
                quality: 80,
                effort: 6,
            })
            .toFile(output);

        const { size } = await stat(output);

        console.log(`✅ ${name}-optimized.webp : ${(size / 1024).toFixed(1)} Kio`);
    } catch (error) {
        console.error(`❌ Erreur avec ${filename}: ${error.message}`);
    }
}
