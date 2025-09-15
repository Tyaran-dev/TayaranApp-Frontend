export async function POST(req) {
    // try {
        const { text } = await req.json();

        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: 'en', // Translate to English
                format: 'text',
            }),
        });

        const data = await response.json();
console.log(data)
        return new Response(JSON.stringify({ translatedText: data.translatedText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    // } catch (error) {
    //     console.error('Translation error:', error);
    //     return new Response(JSON.stringify({ error: 'Translation failed' }), {
    //         status: 500,
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // }
}
