import './App.css';
import '@mantine/core/styles.css';

import { useEffect, useRef, useState } from 'react';
// import { ChatWebLLM } from '@langchain/community/chat_models/webllm';
// import { HumanMessage } from '@langchain/core/messages';
import * as webllm from '@mlc-ai/web-llm';
import { createTheme, MantineProvider } from '@mantine/core';
import { Container, Textarea, Button } from '@mantine/core';
import Markdown from 'react-markdown';

import { CloseVectorWeb } from '@langchain/community/vectorstores/closevector/web';
import { OpenAIEmbeddings } from '@langchain/openai';

export const modelVersion = 'v0_2_43';
export const modelLibURLPrefix =
  'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/';

export const runVectorDB = async () => {
  const vectorStore = await CloseVectorWeb.fromTexts(
    ['Hello world', 'Bye bye', 'hello nice world'],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OpenAIEmbeddings(),
  );

  const resultOne = await vectorStore.similaritySearch('hello world', 1);
  console.log(resultOne);
};

const theme = createTheme({});

type States =
  | 'loading-engine'
  | 'idle'
  | 'loading-model'
  | 'loading-prompt'
  | 'ready'
  | 'error';

const App = () => {
  const loaded = useRef(false);
  const engine = useRef<webllm.MLCEngine | null>(null);
  const [loadingState, setLoadingState] = useState<States>('loading-engine');
  const [initProgress, setInitProgress] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    async function startWebLLM() {
      loaded.current = true;
      const initProgressCallback = (initProgress) => {
        console.log(initProgress);
      };
      const selectedModel = 'Llama-3-8B-Instruct-q4f32_1-MLC';

      const _engine = await webllm.CreateMLCEngine(
        selectedModel,
        { initProgressCallback: initProgressCallback }, // engineConfig
      );

      engine.current = _engine;

      setLoadingState('idle');

      console.log(engine);
      // const model = new ChatWebLLM({
      //   // model: 'Phi-3-mini-4k-instruct-q4f16_1-MLC',
      //   // model: 'Llama-3-8B-Instruct-q4f32_1-MLC-1k',
      //   model: 'Llama-3-8B-Instruct-q4f32_1-MLC-1k',
      //   chatOptions: {
      //     temperature: 0.1,
      //   },
      //   appConfig: {
      //     model_list: [
      //       {
      //         model:
      //           'https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f32_1-MLC',
      //         model_id: 'Llama-3-8B-Instruct-q4f32_1-MLC-1k',
      //         model_lib:
      //           modelLibURLPrefix +
      //           modelVersion +
      //           '/Llama-3-8B-Instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm',
      //         vram_required_MB: 5295.7,
      //         low_resource_required: true,
      //         overrides: {
      //           context_window_size: 1024,
      //         },
      //       },
      //     ],
      //     useIndexedDBCache: true,
      //   },
      // });
      // console.log(model);
      // await model.initialize((progress) => {
      //   console.log(progress);
      // });

      // const response = await model.invoke([
      //   new HumanMessage({ content: 'What is 1 + 1?' }),
      // ]);

      // console.log(response);
    }

    if (loaded.current) return;
    startWebLLM();
  }, []);

  useEffect(() => {
    runVectorDB();
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handlSubmitPrompt = () => {
    if (!engine.current) return;

    setLoadingState('loading-prompt');

    const messages = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    engine.current.chat.completions.create({ messages }).then((resp) => {
      console.log(resp);
      setLoadingState('ready');
      const newMarkdown = resp.choices[0].message.content;
      setMarkdown(newMarkdown || 'no response');
    });
    console.log('submitting prompt');
  };

  return (
    <MantineProvider theme={theme}>
      <Container>
        <div className="content">
          <div className="model-output-section">
            <Markdown>{markdown}</Markdown>
          </div>
          <div className="input-section">
            <Textarea
              className="prompt-textarea"
              placeholder="Type your message here"
              onChange={handlePromptChange}
            />
            <div className="submit-btn-wrapper">
              <Button onClick={handlSubmitPrompt}>Submit</Button>
            </div>
          </div>
        </div>
      </Container>
    </MantineProvider>
  );
};

export default App;
