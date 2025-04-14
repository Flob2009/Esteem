// /app/api/ai-answer/route.ts
export async function POST(req: Request) {
    const { question } = await req.json();
  
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'user',
            content: `Fournis une réponse complète et simple à cette question : ${question}`,
          },
        ],
      }),
    });
  
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'Aucune réponse trouvée';
  
    return Response.json({ answer });
  }