import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }


  try {
    //   const completion = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: generatePrompt(),
    //     temperature: 1,
    //       max_tokens: 1500
    //   });

    const completion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", "content": generatePrompt(request.body.idea, request.body.tech) }],
        max_tokens: 1900,
        temperature: 0.9,
      }
    )


    return NextResponse.json({ result: completion.data.choices[0].message });

  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      NextResponse.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      NextResponse.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(idea, tech) {
  return `You are a programming teacher. Provide me set of simple questions that will guid me through process of creating ${idea}. By answering those questions and implementing the solutions in ${tech} I will be able to build my website. Please only give questions, not any other extra text. and also implementation of each questions should be less than or equal to 100 lines of code.`;
}
