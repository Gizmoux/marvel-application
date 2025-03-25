'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CiStar } from 'react-icons/ci';
import Navbar from '../Navbar/page';

interface Character {
	_id: string;
	name: string;
	description: string;
	thumbnail: {
		path: string;
		extension: string;
	};
}

export default function Favourites() {
	const [favorites, setFavorites] = useState<Character[]>([]);

	useEffect(() => {
		// Charger les favoris depuis le localStorage
		const storedFavorites = JSON.parse(
			localStorage.getItem('favorites') || '{}'
		);

		// Fonction pour charger les détails des personnages favoris
		const loadFavoriteCharacters = async () => {
			try {
				const response = await fetch('/api/characters');
				if (!response.ok) {
					throw new Error('Failed to fetch characters');
				}
				const data = await response.json();

				// Filtrer les personnages pour ne garder que les favoris
				const favoriteCharacters = data.results.filter(
					(char: Character) => storedFavorites[char._id]
				);
				setFavorites(favoriteCharacters);
			} catch (error) {
				console.error('Error loading favorite characters:', error);
			}
		};

		loadFavoriteCharacters();
	}, []);

	const removeFavorite = (characterId: string) => {
		// Retirer le personnage des favoris
		const updatedFavorites = favorites.filter(char => char._id !== characterId);
		setFavorites(updatedFavorites);

		// Mettre à jour le localStorage
		const updatedIds = updatedFavorites.map(char => char._id);
		localStorage.setItem('favorites', JSON.stringify(updatedIds));
	};

	return (
		<main>
			<Navbar />
			<h1>Mes Favoris</h1>
			<div className="grid grid-cols-3">
				{favorites.map(character => (
					<div
						key={character._id}
						className="bg-primary hover:bg-primary-foreground mb-2 mr-2 ml-2 flex flex-col items-center rounded-md"
					>
						<h2 className="text-white">{character.name}</h2>
						<CiStar
							className="fill-current text-red-500 w-10 h-10 cursor-pointer"
							onClick={() => removeFavorite(character._id)}
						/>
						<Image
							width={300}
							height={300}
							className="rounded-md"
							src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
							alt={character.name}
						/>
						<p className="text-white text-center">{character.description}</p>
					</div>
				))}
			</div>
		</main>
	);
}
