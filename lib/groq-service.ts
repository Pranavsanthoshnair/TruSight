export interface BiasAnalysisResult {
  bias: string;
  confidence: number;
  owner: string;
  missingPerspectives: string[];
  reasoning?: string;
}

export interface GroqAnalysisRequest {
  content: string;
  title?: string;
  source?: string;
  url?: string;
}

class GroqService {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions";

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || "";
    if (!this.apiKey) {
      console.warn("GROQ_API_KEY not found in environment variables");
    }
  }

  async analyzeBias(request: GroqAnalysisRequest): Promise<BiasAnalysisResult> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY not configured");
    }

    const prompt = this.buildAnalysisPrompt(request);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // Using Llama 3.1 70B for better analysis
          messages: [
            {
              role: "system",
              content: `You are an expert media bias analyst with deep understanding of political leanings, language patterns, and media bias indicators. 

Your task is to analyze content for political bias and provide a comprehensive assessment. Consider:

1. **Language patterns**: Word choice, tone, framing
2. **Source selection**: Which sources are cited or referenced
3. **Story selection**: What topics are emphasized or omitted
4. **Framing**: How issues are presented and contextualized
5. **Balance**: Whether multiple perspectives are represented

Respond with a JSON object containing:
- bias: "Left-Leaning", "Center", "Right-Leaning", or "Neutral"
- confidence: A score between 0.0-1.0 based on how clear the bias indicators are
- owner: Inferred publisher name
- missingPerspectives: Array of viewpoints or perspectives that are missing
- reasoning: Brief explanation of your bias assessment

Be thorough but concise in your analysis.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1, // Low temperature for consistent analysis
          max_tokens: 1000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Groq API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from Groq API");
      }

      const result = JSON.parse(content) as BiasAnalysisResult;

      // Validate and normalize the result
      return this.validateAndNormalizeResult(result);
    } catch (error) {
      console.error("Error analyzing bias with Groq:", error);
      // Fallback to mock data if API fails
      return this.getFallbackResult();
    }
  }

  private buildAnalysisPrompt(request: GroqAnalysisRequest): string {
    const { content, title, source, url } = request;

    let prompt = `Please analyze the following content for media bias. Consider the language used, sources cited, story selection, and overall framing:\n\n`;

    if (title) {
      prompt += `Title: ${title}\n\n`;
    }

    prompt += `Content: ${content}\n\n`;

    if (source) {
      prompt += `Source: ${source}\n\n`;
    }

    if (url) {
      prompt += `URL: ${url}\n\n`;
    }

    prompt += `Please provide a comprehensive bias analysis in JSON format with the following structure:
{
  "bias": "Left-Leaning|Center|Right-Leaning|Neutral",
  "confidence": 0.0-1.0,
  "owner": "inferred publisher name",
  "missingPerspectives": ["perspective1", "perspective2"],
  "reasoning": "brief explanation of the bias assessment including key indicators found"
}

Consider:
- Left-Leaning: Liberal/progressive viewpoints, emphasis on social justice, government intervention
- Right-Leaning: Conservative viewpoints, emphasis on free markets, limited government
- Center: Balanced presentation, multiple viewpoints, neutral language
- Neutral: Factual reporting without clear political leanings

Confidence should reflect how clear and consistent the bias indicators are throughout the content.`;

    return prompt;
  }

  private validateAndNormalizeResult(result: any): BiasAnalysisResult {
    // Ensure bias is one of the expected values
    const validBiases = ["Left-Leaning", "Center", "Right-Leaning", "Neutral"];
    const bias = validBiases.includes(result.bias) ? result.bias : "Center";

    // Ensure confidence is between 0 and 1, with better validation
    let confidence = result.confidence || 0.5;
    if (typeof confidence !== "number" || isNaN(confidence)) {
      confidence = 0.5;
    }
    confidence = Math.max(0, Math.min(1, confidence));

    // Ensure owner is a string
    const owner = result.owner || "Unknown Publisher";

    // Ensure missingPerspectives is an array
    const missingPerspectives = Array.isArray(result.missingPerspectives)
      ? result.missingPerspectives.filter(
          (p: any) => typeof p === "string" && p.trim().length > 0
        )
      : [];

    // Ensure reasoning is a string
    const reasoning =
      typeof result.reasoning === "string" ? result.reasoning.trim() : "";

    return {
      bias,
      confidence,
      owner,
      missingPerspectives,
      reasoning,
    };
  }

  private getFallbackResult(): BiasAnalysisResult {
    // Fallback data when API is unavailable
    return {
      bias: "Center",
      confidence: 0.3, // Lower confidence for fallback
      owner: "Unknown Publisher",
      missingPerspectives: ["Additional context needed for accurate analysis"],
      reasoning:
        "Analysis unavailable - using fallback data. Please try again later.",
    };
  }

  // Method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "user",
              content: "Hello",
            },
          ],
          max_tokens: 10,
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const groqService = new GroqService();
