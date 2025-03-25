"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../Navbar/page";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";

const CharacterId = () => {
  const params = useParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  interface Comic {
    thumbnail: {
      path: string;
      extension: string;
    };
    _id: string;
    title: string;
    description: string | null;
    __v: number;
  }

  interface ApiResponse {
    thumbnail: {
      path: string;
      extension: string;
    };
    comics: Comic[];
    _id: string;
    name: string;
    description: string;
    __v: number;
  }

  const handleFavoriteComic = (comicId: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = { ...prevFavorites };
      newFavorites[comicId] = !newFavorites[comicId];
      localStorage.setItem(
        `comic-favorites-${params.characterId}`,
        JSON.stringify(newFavorites)
      );
      return newFavorites;
    });
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem(`comic-favorites-${params.characterId}`) || "{}"
    );
    setFavorites(storedFavorites);
  }, [params.characterId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/characterId?characterId=${params.characterId}`,
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.characterId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-red-600">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        Error: {error.message}
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {data && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3">
                <Image
                  width={400}
                  height={400}
                  src={`${data.thumbnail.path}.${data.thumbnail.extension}`}
                  alt={data.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {data.name}
                </h1>
                <p className="text-gray-600 mb-4">
                  {data.description ||
                    "No description available for this character."}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Comics Featuring {data.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.comics && data.comics.length > 0 ? (
              data.comics.map((comic) => (
                <div
                  key={comic._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="relative">
                    <Image
                      width={300}
                      height={300}
                      src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                      alt={comic.title}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => handleFavoriteComic(comic._id)}
                      className="absolute top-2 right-2 bg-white/75 rounded-full p-2 hover:bg-white"
                    >
                      <CiHeart
                        className={`w-6 h-6 ${
                          favorites[comic._id]
                            ? "text-red-500 fill-current"
                            : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {comic.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {comic.description || "No description available"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No comics found for this character.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterId;
