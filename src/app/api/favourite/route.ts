// pages/api/favorites/index.js
import db from '../../../../models/favorite';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const favorites = await db.Favorite.findAll();
			res.status(200).json(favorites);
		} catch (error) {
			console.error('Error fetching favorites:', error);
			res.status(500).json({ error: 'Error fetching favorites' });
		}
	} else {
		res.status(405).json({ error: 'Method not allowed' });
	}
}
