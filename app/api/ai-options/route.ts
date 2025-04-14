export async function POST(req: Request) {
  const { question, type } = await req.json();

  try {
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
            content: `Voici une question de quiz : "${question}". Propose 3 réponses plausibles, dont ${
              type === 'choix_multiples'
                ? 'une ou plusieurs peuvent être correctes'
                : 'une seule est correcte'
            }. Rends uniquement un tableau JSON avec ce format strict :
[
  { "text": "Réponse A", "isCorrect": false },
  { "text": "Réponse B", "isCorrect": true },
  { "text": "Réponse C", "isCorrect": false }
]`,
          },
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) return Response.json({ error: 'Aucune réponse IA' }, { status: 500 });

    // 🔍 Extraction automatique du bloc JSON
    const match = raw.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!match) {
      console.error('Bloc JSON introuvable :', raw);
      return Response.json({ error: 'Réponse IA invalide' }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (err) {
      console.error('Erreur de parsing final :', match[0]);
      return Response.json({ error: 'Erreur de parsing JSON' }, { status: 500 });
    }

    const options = parsed.map((item: any) => item.text);
    const correctAnswers = parsed.map((item: any) => item.isCorrect === true);
    const correctIndex = correctAnswers.findIndex((v: boolean) => v === true);

    return Response.json({
      options,
      correctIndex,
      correctAnswers,
    });

  } catch (error) {
    console.error('Erreur serveur ou fetch :', error);
    return Response.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}