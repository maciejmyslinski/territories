/* eslint-disable import/no-extraneous-dependencies */
import { sendMessage } from 'iMessageModule';
import axios from 'axios';

axios
  .get(
    'https://script.google.com/macros/s/AKfycbyDgF5PKATAdgVrTNkDNC5RILf58Mh7ACJiFLULfu-NkBkl2JXk/exec',
  )
  .then(response =>
    response.data.messages.forEach(message => {
      sendMessage(message.number, message.content);
    }),
  );
