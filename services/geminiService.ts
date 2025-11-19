import { GoogleGenAI } from '@google/genai';
import type { BusinessData, AnalysisResponse, ManualType } from '../types';
import { getPrompts, getManualPrompts } from './prompts';

export async function generateAnalysis(data: BusinessData, lang: string): Promise<AnalysisResponse> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Please check your environment configuration.");
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompts = getPrompts(lang);

  const userPrompt = prompts.user(data);
  // Pass system instruction via config, separating it from user content for better adherence
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction: prompts.system,
    }
  });
  
  return response.text || '';
}

export async function generateManual(
  businessData: BusinessData, 
  analysisResult: string, 
  manualType: ManualType, 
  lang: string
): Promise<AnalysisResponse> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
     console.error("API Key is missing.");
     throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompts = getManualPrompts(lang);

  const systemPrompt = prompts.system[manualType];
  const userPrompt = prompts.user(businessData, analysisResult);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2, // Lower temperature for more deterministic, structured output
    }
  });

  return response.text || '';
}