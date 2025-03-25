import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url);
		const characterId = searchParams.get('characterId');
		const response = await fetch(
			`https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=o6GAkUgopwiunWCT`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch data from external API');
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: error.message });
	}
};
