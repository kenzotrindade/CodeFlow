import OpenAI from "openai";

// #################################
// ### OpenAI Client
// #################################

export const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY as string,
});
