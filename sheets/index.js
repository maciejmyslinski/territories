import { generateMessages } from './utils/generateMessages';

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify(generateMessages()),
  ).setMimeType(ContentService.MimeType.JSON);
}
function test() {
  Logger.log(doGet().getContent());
}
