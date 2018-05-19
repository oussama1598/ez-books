import request from 'request-promise';
import cheerio from 'cheerio';
import { URL } from 'url';

export default async function(uri) {
  const id = new URL(uri).pathname.replace('/', '');
  const $ = await request({
    uri: uri.replace('.com', '.org'),
    method: 'POST',
    form: {
      op: 'download2',
      id
    },
    transform: body => cheerio.load(body)
  });

  $('.filepanel').remove();

  return $('span a').attr('href');
}
