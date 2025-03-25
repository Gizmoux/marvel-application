"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import Navbar from "../Navbar/page";
import Link from "next/link";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load favorites from localStorage
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "{}"
    );

    // Function to load favorite characters
    const loadFavoriteCharacters = async () => {
      try {
        const response = await fetch("/api/characters");
        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }
        const data = await response.json();

        // Filter characters to keep only favorites
        const favoriteCharacters = data.results.filter(
          (char: Character) => storedFavorites[char._id]
        );
        setFavorites(favoriteCharacters);
        setLoading(false);
      } catch (error) {
        console.error("Error loading favorite characters:", error);
        setError("Failed to load favorite characters");
        setLoading(false);
      }
    };

    loadFavoriteCharacters();
  }, []);

  const removeFavorite = (characterId: string) => {
    // Remove character from favorites
    const updatedFavorites = favorites.filter(
      (char) => char._id !== characterId
    );
    setFavorites(updatedFavorites);

    // Update localStorage
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "{}"
    );
    delete storedFavorites[characterId];
    localStorage.setItem("favorites", JSON.stringify(storedFavorites));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-red-600">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <main className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Favorites
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-xl">No favorite characters yet.</p>
            <Link
              href="/characters"
              className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Explore Characters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((character) => (
              <div
                key={character._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  <Link href={`/comics/${character._id}`}>
                    <Image
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover"
                      src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                      alt={character.name}
                    />
                  </Link>
                  <button
                    onClick={() => removeFavorite(character._id)}
                    className="absolute top-2 right-2 bg-white/75 rounded-full p-2 hover:bg-white"
                  >
                    <CiHeart className="w-6 h-6 text-red-500 fill-current" />
                  </button>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {character.name}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {character.description || "No description available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
