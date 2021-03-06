import isEven from 'is-even';
import moment from 'moment';
import Mustache from 'mustache';
import { generateMessages } from './utils/generateMessages';

function getSheetsWithData() {
  return SpreadsheetApp.getActive()
    .getSheets()
    .filter(
      sheet => sheet.getName() !== 'Wiadomości' && sheet.getName() !== 'Dane'
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
      }
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
          endDate: array[index + 1][1]
        }
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
    assignment: lastAssignment
  };
}

function filterOutReturned(territory) {
  return !territory.assignment.endDate;
}

function calculateDaysSinceAssigned(territory) {
  const startDate = new Date(territory.assignment.startDate);
  return moment().diff(moment(startDate), 'days');
}

function filterOutEmptyRows(row) {
  return row[0];
}

function getMessageTemplates() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Wiadomości');
  const row = 2;
  const column = 1;
  const rowsNo = sheet.getDataRange().getLastRow();
  const columnsNo = 3;
  const allTemplates = sheet
    .getRange(row, column, rowsNo, columnsNo)
    .getValues()
    .filter(filterOutEmptyRows)
    .map(templateRow => ({
      days: templateRow[0],
      brothers: templateRow[1],
      sisters: templateRow[2]
    }));
  return allTemplates;
}

function getPeopleData() {
  function filterOutGroups(row) {
    const startsWith = 'Grupa';
    return row[0].substr(0, startsWith.length) !== startsWith;
  }

  const sheet = SpreadsheetApp.getActive().getSheetByName('Dane');
  const row = 2;
  const column = 1;
  const rowsNo = sheet.getDataRange().getLastRow();
  const columnsNo = 3;
  const allPeople = sheet
    .getRange(row, column, rowsNo, columnsNo)
    .getValues()
    .filter(filterOutEmptyRows)
    .filter(filterOutGroups)
    .map(person => ({
      name: person[0],
      sex: person[1] === 'kobieta' ? 'female' : 'male',
      phoneNumber: person[2]
    }));
  return allPeople;
}

function getOngoingTerritories() {
  return getTerritories(getSheetsWithData())
    .map(territory => parseTerritory(territory))
    .filter(filterOutReturned);
}

function generateTextMessages() {
  const peopleData = getPeopleData();
  const messageTemplates = getMessageTemplates();
  const messagableDays = messageTemplates.map(template => template.days);
  return getOngoingTerritories()
    .map(territory => ({
      ...territory,
      daysSinceAssigned: calculateDaysSinceAssigned(territory)
    }))
    .filter(
      territory => messagableDays.indexOf(territory.daysSinceAssigned) > -1
    )
    .map(territory => ({
      ...territory,
      person: peopleData.filter(
        person => person.name === territory.assignment.name
      )[0]
    }))
    .map(territory => {
      const template = messageTemplates.filter(
        messageTemplate => messageTemplate.days === territory.daysSinceAssigned
      )[0][territory.person.sex === 'male' ? 'brothers' : 'sisters'];
      return {
        content: Mustache.render(template, { numer_terenu: territory.number }),
        number: territory.person.phoneNumber
      };
    });
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify(generateTextMessages())
  ).setMimeType(ContentService.MimeType.JSON);
}

function test() {
  Logger.log(JSON.stringify(generateTextMessages()));
}
