import { generateMessages } from './utils/generateMessages';

function getSheetsWithData() {
  return SpreadsheetApp.getActive()
    .getSheets()
    .filter(
      sheet => sheet.getName() !== 'Wiadomości' && sheet.getName() !== 'Dane',
    );
}

function getTerritories(sheets) {
  return sheets.reduce((acc, sheet) => {
    const numberOfColumns = sheet.getDataRange().getLastColumn();
    const numberOfTerritories = numberOfColumns / 2;
    const territories = Array.from(new Array(numberOfTerritories)).map(
      (_, i) => {
        const row = 2;
        const column = 2 * (i + 1) - 1;
        const numRows = 53 - row;
        const numColumns = 1;
        return sheet.getRange(row, column, numRows, numColumns).getValues();
      },
    );
    return [...acc, territories];
  }, []);
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify(generateMessages()),
  ).setMimeType(ContentService.MimeType.JSON);
}
function test() {
  Logger.log(getTerritories(getSheetsWithData()));
}
