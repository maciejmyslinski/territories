/* eslint-disable import/no-extraneous-dependencies */
// const cron = require('node-schedule');
const imessagemodule = require('iMessageModule');
const axios = require('axios');

// cron.scheduleJob('*/1 * * * *', () => {
axios
  .get(
    'https://script.google.com/macros/s/AKfycbyDgF5PKATAdgVrTNkDNC5RILf58Mh7ACJiFLULfu-NkBkl2JXk/exec'
  )
  .then(response =>
    response.data.forEach(message => {
      imessagemodule.sendMessage(message.number, message.content);
    })
  );
// });
