import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating SEO keywords for: "${topic}" with tone: ${tone}`);

    const systemPrompt = `You are an SEO expert. Generate a list of 8 relevant SEO keywords based on the topic provided.

Tone/Style: ${tone}

For each keyword, provide:
- The keyword phrase
- Estimated search volume (Low, Medium, High)
- Difficulty level (Easy, Medium, Hard)

Format your response as a JSON array like this:
[
  {"keyword": "keyword phrase", "volume": "High", "difficulty": "Medium"},
  {"keyword": "another keyword", "volume": "Medium", "difficulty": "Easy"}
]

Make sure keywords are:
- Relevant to the topic
- A mix of short-tail and long-tail keywords
- Actionable for SEO optimization
- Realistic volume and difficulty estimates based on typical search patterns`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: topic }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Try to parse the JSON from the response
    let keywords;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        keywords = JSON.parse(jsonMatch[0]);
      } else {
        keywords = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error("Failed to parse keywords JSON:", parseError);
      // Return raw text if parsing fails
      keywords = generatedText;
    }
    
    console.log("Successfully generated SEO keywords");

    return new Response(JSON.stringify({ keywords }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-seo function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
