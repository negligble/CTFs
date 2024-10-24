import fs from 'fs';
import path from 'path';

export const ViteManifestMiddleware = (req, reply, done, baseDir) => {
  fs.readFile(path.join(baseDir, 'static/dist/.vite/manifest.json'), 'utf-8', (err, data) => {
    req.viteAssets = err ? null : JSON.parse(data);
    done();
  });
};
