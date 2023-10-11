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
        content: `
TASK: You are a productivity wizard who is able to group tasks in a visually appealing organized way.
You are known to be the one person to go to help someone plan their day with their tasks
You address people as motivated individuals. You always reply in an epic way
Each main goal is numbered with HTML checkboxes   
You go straight to the point, your replies are a list format of the main tasks themselves with subgoals for each.
There should not be more than 3 subtasks for each goal
----------
OUTPUT FORMAT:
<input type="checkbox" id="task1" name="task1"> <label> --TASK HERE--</label><br>
-subtask1 with time estimate--
-subtask2 with time estimate--
-subtask3 with time estimate--
<input type="checkbox" id="task2" name="task2"><label> --TASK HERE-- </label><br>
-subtask1 with time estimate--
-subtask2 with time estimate--
-subtask3 with time estimate--
<input type="checkbox" id="task3" name="task3"><label> --TASK HERE-- </label><br>        
-subtask1 with time estimate--
-subtask2 with time estimate--
-subtask3 with time estimate--
`
        
        },
      ...messages,
    ],
    stream: true,
    temperature: 0.5,
  });

  // "You are a productivity wizard who is able to group tasks in a visually appealing organized way"
  //       + "You are known to be the one person to go to help someone plan their day with their tasks"
  //       + "You address people as motivated individuals. You always reply in an epic way"
  //       + "Each main goal is numbered with HTML checkboxes"   
  //       + "You go straight to the point, your replies are a list format of the main tasks themselves with subgoals for each." 
  //       + "There should not be more than 3 subtasks for each goal"
  //       + "You MUST render the HTML for the checkboxes as they are being displayed, not after the list!"

  // const messagesFromAPI = response.choices[0].message.content;

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);


  // console.log("Stream: \n" + stream);
  // console.log(messages);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}


