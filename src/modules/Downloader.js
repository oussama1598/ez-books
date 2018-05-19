import request from 'request';
import fs from 'fs';
import ProgressBar from 'progress';
import path from 'path';

export default class Downloader {
  constructor(url, saveTo) {
    this.saveTo = saveTo;
    this.url = url;
    this.filename = path.basename(url);
    this.pg = null;
  }

  start() {
    return new Promise(resolve => {
      request
        .get(this.url)
        .on('response', res => {
          const contentLength = res.headers['content-length'];
          const total = parseInt(contentLength, 10);

          this.pg = new ProgressBar('  downloading [:bar] :percent', {
            width: 20,
            total
          });
        })
        .on('data', chunk => {
          this.pg.tick(chunk.length);
        })
        .pipe(fs.createWriteStream(path.join(this.saveTo, this.filename)))
        .on('finish', resolve);
    });
  }
}
