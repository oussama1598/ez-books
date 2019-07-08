import { askForKeyword, listResults, separator } from '../helpers/prompt';
import { error } from '../helpers/logger';
import { searchForBook, getDownloadLinks } from '../lib/ebookbb';
import parseClodyFiles from '../lib/cloudyfiles';
import Downloader from '../modules/Downloader';

const CWD = process.cwd();

async function search(keyword, page = 1) {
  const searchResults = await searchForBook(keyword, page);
  const parsedBooks = searchResults.books.map((book, index) => ({
    name: `${index + 1} - ${book.title}`,
    value: book.detailsURL
  }));

  if (parsedBooks.length === 0) return error('Nothing found');

  if (searchResults.nextPage)
    parsedBooks.push(
      ...[
        separator(),
        {
          name: 'Next page',
          value: 'nextPage'
        },
        separator()
      ]
    );

  const { currentPage, totalPages } = searchResults;
  const selectedBook = await listResults(parsedBooks, currentPage, totalPages);

  if (selectedBook === 'nextPage') return search(keyword, page + 1);

  return selectedBook;
}

export default async function() {
  try {
    const keyword = await askForKeyword();
    const selectedBook = await search(keyword);

    if (!selectedBook) return;

    const downloadLinks = await getDownloadLinks(selectedBook);

    if (!Object.keys(downloadLinks).includes('cloudyfiles')) {
      error("Couldn't find the 'cloudyfiles' provider");
      return;
    }

    const downloadLink = await parseClodyFiles(downloadLinks.cloudyfiles);

    await new Downloader(downloadLink, CWD).start();
  } catch (err) {
    error('Something wrong happend');

    console.log(err);
  }
}
