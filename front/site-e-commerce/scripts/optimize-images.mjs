import sharp from 'sharp';
import path from 'node:path';

const logos = ['sigma-logo.png', 'sigma-logo-white.png'];

const widths = [320, 640];

for (const filename of logos) {
    for (const width of widths) {
        const name = path.parse(filename).name;

        const output = `public/images/${name}-${width}.webp`;

        await sharp(`public/images/${filename}`)
            .resize({
                width,
                withoutEnlargement: true,
            })
            .webp({
                quality: 90,
                effort: 6,
                alphaQuality: 100,
            })
            .toFile(output);

        console.log(`Image générée : ${output}`);
    }
}
