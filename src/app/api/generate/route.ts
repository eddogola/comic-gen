import { NextResponse } from 'next/server';
import Replicate from "replicate";
import OpenAI from 'openai';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://models.inference.ai.azure.com"
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt);

    if (!process.env.REPLICATE_API_TOKEN || !process.env.OPENAI_API_KEY) {
      throw new Error('API tokens not configured');
    }

    // Get sequential captions from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a comic strip writer. Create 4 sequential panel descriptions that tell a coherent story based on the user's prompt. Each description should be brief but vivid.\
          Give only the description, no other text."
        },
        {
          role: "user",
          content: `Create 4 sequential comic panel descriptions for this story: ${prompt}`
        }
      ],
      model: "gpt-4o",
      temperature: 0.7,
    });

    const panelDescriptions = completion.choices[0].message.content
      ?.split('\n')
      .filter(line => line.trim())
      .slice(0, 4);

    console.log('Panel descriptions:', panelDescriptions);

    // Generate images for each panel description
    const imagePromises = panelDescriptions?.map(async (description) => {
      const output = await replicate.run(
        "black-forest-labs/flux-dev",
        {
          input: {
            prompt: description,
            num_outputs: 1,
            width: 768,
            height: 768,
          }
        }
      );

      if (!output || !Array.isArray(output) || !output[0]) {
        throw new Error('Invalid response from Replicate');
      }

      const imageUrl = output[0];
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return {
        description,
        image: `data:image/png;base64,${base64}`
      };
    }) ?? [];

    const panels = await Promise.all(imagePromises);

    return NextResponse.json({
      panels: panels.map((panel, index) => ({
        ...panel,
        panelNumber: index + 1
      }))
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate comic' },
      { status: 500 }
    );
  }
}