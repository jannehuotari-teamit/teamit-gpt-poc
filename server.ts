import express from 'express';
import cors from 'cors';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';

import { chat } from './bot';
import { apiConfig, getToken, tokenRequest } from './auth';
import { callApi } from './fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const getFile = async (useTest: boolean) => {
  try {
    const authResponse = await getToken(tokenRequest);
    const file = await callApi(
      useTest ? apiConfig.test : apiConfig.uri,
      authResponse.accessToken
    );
    return file;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
};

const loadFileToBlob = async () => {
  try {
    const file = await getFile(false);
    const files = [];

    const downloadUrl = file.value[0]['@microsoft.graph.downloadUrl'];
    const data = await fetch(downloadUrl);
    const dataBlob = await data.blob();

    const loader = new WebPDFLoader(dataBlob);
    const docs = await loader.load();
    return docs;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
};

app.post('/question', async (req, res) => {
  const question = req.body.question;
  try {
    const docs = await loadFileToBlob();
    const response = await chat(docs, question);
    res.send(response);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
    res.sendStatus(500);
  }
});

/** Test api call to sharepoint though Microsoft Graph Api */
app.get('/getFile', async (req, res) => {
  try {
    const file = await getFile(true);
    res.send(file);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
