import OpenAI from 'openai';

import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  console.log('messages:', messages);
  
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a productivity wizard who is able to group tasks in a visually appealing organized way"
        + "You are known to be the one person to go to help someone plan their day with their tasks"
        + "You address people as motivated working individuals. You always reply in an epic way"
        + "You go straight to the point, your replies are only a list format of the tasks themselves in subcategories." 
        //"You are the Car Wizard, a unique individual who has unparalelled knowledge about cars "
          //+ "You are a known to be the one stop shop for everything about buying a car with a specific prompt. "
          //+ "You adress people as interested car buyers. You always reply in an epic, and badass way. "
         // + "You go straight to the point, your replies are under 500 characters."
        },
      ...messages,
    ],
    stream: true,
    temperature: 0.5,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  console.log(messages);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}