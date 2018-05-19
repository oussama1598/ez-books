import Xray from 'x-ray';
import { URL } from 'url';

const BASE_URI = 'https://ebookbb.com';
const x = Xray({
  filters: {
    currentPage: value =>
      value &&
      parseInt(
        value
          .split('of')[0]
          .replace('Page', '')
          .trim(),
        10
      ),
    totalPages: value => value && parseInt(value.split('of')[1].trim(), 10)
  }
});

function promisifyX(...rest) {
  return new Promise((resolve, reject) => {
    x(...rest)((err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
}

export function searchForBook(keyword, page = 1) {
  const uri = `${BASE_URI}/page/${page}/`;
  const url = new URL(uri);

  url.searchParams.append('s', keyword);

  return promisifyX(url.toString(), {
    currentPage: '.pages | currentPage',
    totalPages: '.pages | totalPages',
    books: x('.post', [
      {
        title: '.title a',
        detailsURL: '.more-link@href'
      }
    ]),
    nextPage: '.nextpostslink@href'
  });
}

export async function getDownloadLinks(booksUrl) {
  const links = await promisifyX(booksUrl, ['.fasc-type-glossy@href']);

  return links.reduce((linksObj, link) => {
    const urlDomain = new URL(link).hostname.split('.')[0];

    linksObj[urlDomain] = link;

    return linksObj;
  }, {});
}
