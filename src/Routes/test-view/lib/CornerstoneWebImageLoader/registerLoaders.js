import { loadImage } from './loadImage.js';
import metaDataProvider from './metaDataProvider';

export default function (cornerstone) {
  // Register the http and https prefixes so we can use standard web urls directly
  cornerstone.registerImageLoader('http', loadImage);
  cornerstone.registerImageLoader('https', loadImage);

  cornerstone.metaData.addProvider(metaDataProvider);
}
