import * as express from 'express';
import { promises } from 'fs';
import { join } from 'path';
import { DiskStorageOptions, tus } from 'node-uploadx';

const app = express();
const dir = 'files';
const opts: DiskStorageOptions = {
  allowMIME: ['image/*'],
  directory: dir,
  filename: file => `.${file.originalName}`, // dot hide incomplete uploads
  onComplete: async file => {
    console.log('File upload complete: ', file.originalName);
    await promises.rename(join(dir, file.name), join(dir, file.originalName)); // unhide
  }
};

app.use('/files', [express.static(dir), tus(opts)]);

app.listen(3003, error => {
  if (error) throw error;
  console.log('listening on port:', 3003);
});
