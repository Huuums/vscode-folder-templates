import * as fs from 'fs';
import * as path from 'path';

export const cleanDir = (dir: fs.PathLike) => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.unlink(path.join(dir as string, file), err => {
        if (err) throw err;
      });
    });
  });
};
