import isEven from 'is-even';
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
        const numRows = 54 - row;
        const numColumns = 2;
        return sheet.getRange(row, column, numRows, numColumns).getValues();
      },
    );
    return [...acc, ...territories];
  }, []);
}

function parseTerritory(territory) {
  const number = territory[0][0];
  const name = territory[1][0];
  const assignmentsData = territory.slice(2);
  const assignments = assignmentsData.reduce((acc, row, index, array) => {
    const isName = isEven(index);
    if (isName) {
      return [
        ...acc,
        {
          name: row[0],
          startDate: array[index + 1][0],
          endDate: array[index + 1][1],
        },
      ];
    }
    return acc;
  }, []);
  const lastAssignment = assignments.reduce((acc, assignment) => {
    if (assignment.name) return assignment;
    return acc;
  }, undefined);
  return {
    number,
    name,
    assignment: lastAssignment,
  };
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify(generateMessages()),
  ).setMimeType(ContentService.MimeType.JSON);
}
function test() {
  Logger.log(
    JSON.stringify(parseTerritory(getTerritories(getSheetsWithData())[0])),
  );
}
