Create a RAG application using Next.JS, Supabase and OpenAI’s text-embedding-3-small model

==========================================================================================


_TLDR - see the code here 👉_ [_https://github.com/Leggit/nextjs-rag_](https://github.com/Leggit/nextjs-rag)

One of the limitations of large language models (LLMs) is that they are trained on publicly available data with a fixed cutoff date. So what do you do when you need an AI application to respond based on the latest updates — or proprietary, internal data that wasn’t part of the model’s training set?

**The solution is Retrieval-Augmented Generation (RAG).** Instead of relying only on what the model itself “knows”, RAG is a technique that lets you retrieve relevant content from your own data sources and include it in prompts as context for the model to use when generating responses.

At a high level, RAG has two main steps:

1.  **Indexing data**: First, content must be converted (e.g. documents, web pages) into vector embeddings — high-dimensional representations of semantic meaning — and then stored in a database along with the original content.
2.  **Retrieving relevant context**: When a user asks a question, that prompt is also converted into an embedding, which is then used to search through the database to find the most semantically similar pieces of content which can then be passed to the model to provide context to the LLM that relates to the prompt.

In this guide, I’ll show you how to build your own RAG App using:

*   **Next.js** for the frontend and API routes
*   **Supabase** with pgvector to store and query embeddings
*   **OpenAI** for creating text embeddings and response generation
*   **Puppeteer** to scrape fresh data from the web

The final result will be a chatbot that gives responses to prompts based on data from your own database, rather than responses created purely from the model’s original training data.

_Note: you will need an OpenAI API platform account with some credit to follow along._

### Step 1: Setup a Next.JS and Supabase project

Run the following command in a command prompt to create a Next.JS app using the default options:

```
npx create-next-app@latest nextjs-rag --yes
```

Open the newly created _nextjs-rag_ directory in your command prompt and run the following command to install shadcn:

```
npx shadcn@latest init
```

Then, create a [Supabase](https://supabase.com/) project, making a note of the project URL and API key for later.

### Step 2: Scrape data from the web and store it in vector form

To make this app work we will first need to scrape data from some web pages, split it into chunks of text, generate vector representations of that text, and then store the text chunks and vectors together in Supabase.

To work with vectors in Supabase the PostreSQL [vector extension](https://supabase.com/docs/guides/database/extensions/pgvector) must first be enabled. You can either do this through the UI, or run this in the SQL editor:

```
create extension vector
with schema extensions;
```

Now we can create a table to store the chunks of data, including a column for the vector embedding that we will be generating later:

```
create table chunks (
  id uuid not null default gen_random_uuid (),
  content text null,
  vector extensions.vector null,
  url text null,
  date_updated timestamp default now(),
  constraint data_chunks primary key (id)
);
```

The table definition above has _url_ and _date_updated_ columns, as these are useful pieces of metadata than can be provided to the LLM along with the text content to further enhance the responses it generates.

_Quick side note — in this example I’m leaving_ [_Row Level Security (RLS)_](https://supabase.com/docs/guides/database/postgres/row-level-security) _off. This is to keep things simple; in a real world application you should be using appropriate RLS policies to control access to your data._

The next step is to create a script to populate this table. In the _nextjs-rag_ directory, run the following command to install the dependencies that we will need for this:

```
npm i ai @ai-sdk/openai @langchain/community @langchain/core @supabase/supabase-js dotenv langchain puppeteer ts-node
```

You will also need to create a _.env_ file in the project, with these variables:

```
OPENAI_API_KEY=your-open-ai-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Now that the decencies and environment variables are in place, go ahead and create a _seed.ts_ file at the top level of the project., then add these imports to the top of _seed.ts_:

```
// seed.ts
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { createClient } from "@supabase/supabase-js";
import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";
import "dotenv/config";
```

After adding the imports create the Supabase and OpenAI clients, and a recursive text splitter (Which will be used to split web page content into small chunks to be turned into embeddings and stored in the database):

```
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});
```

Beneath that add this _scrapePage_ function that uses Puppeteer to get text content from the webpage at the URL passed to it:

```
const scrapePage = async (url: string): Promise<string> => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape()).replace(/<[^>]*>?/gm, "");
};
```

Now we can tie everything together in a function that iterates through webpages, scrapes the content of the pages, uses the OpenAI API to create vector representations of the content, and then loads the vector and text content into the database:

```
const loadData = async (webpages: string[]) => {
  for await (const url of webpages) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      // Use the OpenAI text-embedding-3-small model to convert the chunk
      // into a vector
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: chunk,
      });
      // Save the chunk of text and url along with the corresponding vector embedding
      const { error } = await supabase.from("chunks").insert({
        content: chunk,
        vector: embedding,
        url: url,
      });
      if (error) {
        console.error("Error inserting chunk:", error);
      }
    }
  }
};
```

The last step is to call _loadData_ at the bottom of the page, passing in an array of the URLs to scrape. For this example I have chosen the Wikipedia pages for recently released Samsung and Apple smartphones as this demonstrates how this type of application can circumvent the limitations introduced by LLM training data cutoffs.

```
// Call loadData to populate the database
loadData([  "https://en.wikipedia.org/wiki/Samsung_Galaxy_S25",
  "https://en.wikipedia.org/wiki/Samsung_Galaxy_S24",
  "https://en.wikipedia.org/wiki/IPhone_16",
  "https://en.wikipedia.org/wiki/IPhone_16_Pro",
  "https://en.wikipedia.org/wiki/IPhone_15",
  "https://en.wikipedia.org/wiki/IPhone_15_Pro",
]);
```

_Important note — Always check a website’s terms of service or robots.txt file before scraping. Not all sites allow automated scraping, and some may restrict how the content can be reused. Wikipedia is open under a Creative Commons license—ideal for this demo._

To run the _seed.ts_ file, add the following line to the _package.json_ scripts entry:

```
"scripts": {
   ...
    "seed": "ts-node seed.ts",
   ...
}
```

So that the seed.ts file can be compiled properly you must also add the following to the bottom of the _tsconfig.json_ file, found at the root level of the project:

```
"ts-node": {
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

Then run the following command in your terminal:

```
npm run seed
```

**It can take a while**! Be patient…you should start to see the _chunks_ table being populated like this:

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*LX8qi-WHXgSFw1qZpF725A.png)

### Step 3: Create the chat interface

To start with, add the button and input components from shadcn by running this command:

```
npx shadcn@latest add input button
```

In the _app/page.tsx_ component, paste the code below (replacing anything that might already be there):

```
"use client";
import { useChat } from "@ai-sdk/react";
import ChatOutput from "@/components/ChatOutput";
import ChatInput from "@/components/ChatInput";
import Footer from "@/components/Footer";
export default function Home() {
  const { input, handleInputChange, handleSubmit, messages, status } =
    useChat();
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">PhoneGPT</h1>
      <div className="space-y-4 mb-4 max-h-[80vh] overflow-y-auto">
        <ChatOutput messages={messages} status={status} />
      </div>
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Output genarated using content from{" "}
        <a
          href="https://www.wikipedia.org/"
          target="_blank"
          className="font-bold"
        >
          Wikipedia
        </a>{" "}
        available under the{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          className="font-bold"
        >
          Creative Commons Licence
        </a>
    </main>
  );
}
```

This page ties together all the UI related parts of the application, displaying chats in a scrollable div and accepting prompts from the _ChatInput_ component. The _useChat_ hook from the AI SDK does a lot of the heavy lifting in the background when it comes to managing state and sending/receiving data from the chat API route that we will write in step 4.

Before implement the _ChatInput_ and _ChatOutput_ components we need to install two further dependencies for displaying generated markdown responses:

```
npm i react-markdown @tailwindcss/typography
```

You will also need to add the Tailwind typography plugin to the _global.css_ file in the app directory:

```
@plugin "@tailwindcss/typography";
```

This allows the response to be displayed with basic formatting rather than as plain text, improving the readability and usefulness of the output.

Next, create the _ChatOutput_ file in the components folder, and add the following code to it:

```
import { Message } from "ai";
import ReactMarkdown from "react-markdown";
const ChatOutput = ({
  messages,
  status,
}: {
  messages: Message[];
  status: string;
}) => {
  return (
    <>
      {messages.map((message, index) =>
        message.role === "user" ? (
          <UserChat key={index} content={message.content} />
        ) : (
          <AssistantChat key={index} content={message.content} />
        )
      )}
      {status === "submitted" && (
        <div className="text-muted-foreground">Generating response...</div>
      )}
      {status === "error" && (
        <div className="text-red-500">An error occurred.</div>
      )}
    </>
  );
};
// Displays user prompts as plain text
const UserChat = ({ content }: { content: string }) => {
  return (
    <div className="bg-muted rounded-2xl ml-auto max-w-[80%] w-fit px-3 py-2 mb-6">
      {content}
    </div>
  );
};
// Displays responses with basic MarkDown formatting
const AssistantChat = ({ content }: { content: string }) => {
  return (
    <div className="pr-8 w-full mb-6 prose prose-neutral dark:prose-invert prose-sm">
      <ReactMarkdown
        components={{
          // You can override more components for further custom styling
          // This simply means links in the response will open in a new tab
          a: ({ href, children }) => (
            <a target="_blank" href={href}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export default ChatOutput;
```

Then create the _ChatInput_ component, which is a simple form containing a text input and a button to submit prompts:

```
"use client";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Input } from "./ui/input";
interface ChatInputProps {
  input: string;
  handleInputChange: (e: any) => void;
  handleSubmit: (e: any) => void;
}
export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        onChange={handleInputChange}
        value={input}
        placeholder="Ask me something..."
      />
      <Button type="submit">
        <ArrowUp />
        <span className="sr-only">Submit</span>
      </Button>
    </form>
  );
}
```

If you start the app by running _npm run dev_ in the terminal you should see something like this by opening a web page at _http://localhost:3000_

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tL0NEPTMWFgj0_KP9jsfbQ.png)

For now, you should just see an error if you type something in and submit it — the final step is what makes everything work together…

### Step 4: Create the chat API route

In the _app_ folder, create a folder called _api_, then inside that another folder called _chat_. The _useChat_ hook we used in the previous step expects there to be an API route that follows this naming which it can use to generate responses.

Inside the chat folder create a _route.ts_ file, and paste in the following code:

```
import { embed, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
// Setup OpenAI and Supabase clients
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);
// Take a user's prompt and convert it to an embedding (vector) so it can be 
// compared to vectors in the database
async function generateEmbedding(message: string) {
  return embed({
    model: openai.embedding("text-embedding-3-small"),
    value: message,
  });
}
// Fetch relevant chunks of information using the embedding generated embedding
async function fetchRelevantContext(embedding: number[]) {
  const { data, error } = await supabase.rpc("get_relevant_chunks", {
    query_vector: embedding,
    match_threshold: 0.5,
    match_count: 10,
  });
  if (error) throw error;
  return JSON.stringify(
    data.map(
      (item: any) => `
        Source: ${item.url}
        Date Updated: ${item.date_updated}
        Content: ${item.content}
        `
    )
  );
}
// Create a full prompt using the context and user inputted prompt
function createPrompt(context: string, userQuestion: string) {
  return {
    role: "system",
    content: `
      You are a helpful assistant that provides information about the latest smartphones. 
      Use the following context to answer questions: 
      ----------------
      START CONTEXT
      ${context}
      END CONTEXT
      ----------------
      
      Return the answer in markdown format including relevant links and the date when the information was last updated.
      Where the above context does not provide enough information relating to the question provide an answer based on your own knowledge but caveat it so the user
      knows that it may not be up to date.
      If the user asks a question that is not related to a smartphone, politely inform them that you can only answer questions about smartphones.
      
      ----------------
      QUESTION: ${userQuestion}
      ----------------`,
  };
}
// Calls the functions above to response to user input and return 
// AI generated responses using context from the database
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages.at(-1).content;
    const { embedding } = await generateEmbedding(latestMessage);
    const context = await fetchRelevantContext(embedding);
    const prompt = createPrompt(context, latestMessage);
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [prompt, ...messages],
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.log("Error generating response: " + error);
    throw error;
  }
}
```

Finally, run this SQL into the database to create a function to query the data and return the most relevant chunks of information:

```
create or replace function get_relevant_chunks(
  query_vector vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  url text,
  date_updated timestamp,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    url,
    date_updated,
    1 - (chunks.vector <=> query_vector) as similarity
  from chunks
  where 1 - (chunks.vector <=> query_vector) > match_threshold
  order by similarity desc
  limit match_count;
$$;
```

This function uses the _<=>_ operator to calculate the cosine similarity between the prompt embedding and the embedding generated for each chunk of text, so that information that is related to the given prompt is returned.

Now if you submit a prompt through the chat interface you should get a response back that uses the context from the database:

![Response generated using context from the database](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tqNNk8OYeB6AwwKzn0MqYg.png)

If you remove _${context}_ from the prompt in _createPrompt_ you should get a less helpful response that looks like the one shown below, which hopefully demonstrates the usefulness of RAG! —

![No context — not such a good response](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*uzAIZAVeTSlVZr_Wy1ymCA.png)

Conclusion
----------

I hope you found this useful, and that it has inspired you to create your own RAG applications. The full code for this project can be found here — [_https://github.com/Leggit/nextjs-rag_](https://github.com/Leggit/nextjs-rag)

