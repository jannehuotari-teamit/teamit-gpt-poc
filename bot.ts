import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAI } from '@langchain/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { Document } from 'langchain/document';

const model = new OpenAI({
  modelName: 'gpt-3.5-turbo-instruct', // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
  temperature: 0.1,
  maxConcurrency: 1,
  maxRetries: 1,
  maxTokens: 100,
  callbacks: [
    {
      handleLLMEnd(output) {
        console.log(JSON.stringify(output, null, 2));
      }
    }
  ]
});

const chat = async (docs: Document[], question: string) => {
  const chain = await loadQAStuffChain(model);
  const response = await chain.invoke({
    input_documents: docs,
    question
  });
  return response;
};

export { chat };
