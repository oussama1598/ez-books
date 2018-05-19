import { prompt, Separator } from 'inquirer';

export function askForKeyword() {
  return prompt([
    {
      type: 'input',
      name: 'keyword',
      message: 'Please type in a keyword: ',
      validate: value => !!value || 'Keyword is required'
    }
  ]).then(result => result.keyword);
}

export function listResults(results, currentPage, totalPages) {
  return prompt([
    {
      type: 'list',
      name: 'book',
      message: `Here's what's found (Page ${currentPage} of ${totalPages}) : `,
      choices: results
    }
  ]).then(result => result.book);
}

export function separator() {
  return new Separator();
}
