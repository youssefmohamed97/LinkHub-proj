import { XMLParser } from 'fast-xml-parser';
import bcrypt from 'bcrypt';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import { PythonShell } from 'python-shell';
// import { promises as fs } from 'fs';
import * as fs from 'fs';

function sanitizeFilename(inputUrl) {
  // Replace characters that are not allowed in filenames with underscores
  return inputUrl.replace(/[\/:?&=]/g, '_');
}
const newItemsInFeed = async ($) => {
  try {
    const feed_url = $.step.parameters.feedUrl;
    const options = {
      scriptPath:
        '/Users/youssefmohamed/Documents/Bitbucket/Rss/packages/backend/src/apps/upwork_scrapper',
      mode: 'text',
      args: [feed_url], // Pass the URL as an argument to the Python script
    };
    // await new Promise((resolve, reject) => {
    await PythonShell.run('scraper.py', options, function (err, results) {
      if (err) return reject(err);
      try {
        const result = JSON.parse(results[0]); // Assuming the output is a single line of JSON
        console.log('Python script output:', result);
        resolve();
      } catch (jsonError) {
        reject(jsonError);
      }
    });

    let jobListings = [];
    try {
      const filePath =
        '/Users/youssefmohamed/Documents/Bitbucket/Rss/packages/backend/src/apps/upwork_scrapper/result_files/' +
        sanitizeFilename(feed_url) +
        '.json';

      console.log(filePath);
      if (fs.existsSync(filePath)) {
        const data = await fs.readFileSync(filePath, 'utf8'); // Read the file asynchronously
        const jsonData = JSON.parse(data);
        console.log('json data is ...', jsonData);
        jobListings = jsonData;
      } else {
        console.log('File does not exist:', filePath);
      }
    } catch (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // console.log('jobListings data is ...', jobListings);
    if (!Array.isArray(jobListings)) {
      throw new Error('Job listings data is not an array');
    }

    for (const item of jobListings) {
      // console.log('item details', item);
      const dataItem = {
        raw: item,
        meta: {
          internalId: item.link,
        },
      };
      $.pushTriggerItem(dataItem);
    }
  } catch (error) {
    // console.error('Error in newItemsInFeed:', error);
  }
};
export default newItemsInFeed;
