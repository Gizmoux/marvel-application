"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import Navbar from "../Navbar/page";
import { useState, useEffect, useCallback } from "react";
import { CiStar, CiHeart } from "react-icons/ci";
import Navbar from "../Navbar/page";

interface Thumbnail {
  path: string;
  extension: string;
}

interface Character {
  _id: string;
  name: string;
  description: string;
  thumbnail: Thumbnail;
}

interface ApiResponse {
  results: Character[];
}

export default function Characters() {
  const [data, setData] = useState<ApiResponse>({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Character[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const handleClick = useCallback((characterId: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = { ...prevFavorites };
      newFavorites[characterId] = !newFavorites[characterId];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "{}"
    );
    setFavorites(storedFavorites);
  }, []);

  const handleInputCharacters = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearch(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/characters", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setData(data);
        setFilteredData(data.results);
      } catch (error) {
        setError("error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.results) {
      const filtered = data.results.filter(
        (character) =>
          character.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
          character.description
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

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
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Search Marvel Characters"
              value={search}
              onChange={handleInputCharacters}
              className="flex-grow shadow-md focus:ring-2 focus:ring-red-500"
            />
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-300"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.map((character) => (
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
                    alt={`${character.name} Marvel Character`}
                  />
                </Link>
                <button
                  onClick={() => handleClick(character._id)}
                  className="absolute top-2 right-2 bg-white/75 rounded-full p-2 hover:bg-white"
                >
                  <CiHeart
                    className={`w-6 h-6 ${
                      favorites[character._id]
                        ? "text-red-500 fill-current"
                        : "text-gray-500"
                    }`}
                  />
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

        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No characters found matching your search.
          </div>
        )}
      </div>
    </main>
  );
}
// "use client";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Navbar from "../Navbar/page";
// import { useState, useEffect, useCallback } from "react";
// import { CiStar } from "react-icons/ci";

// interface Thumbnail {
//   path: string;
//   extension: string;
// }

// interface Character {
//   _id: string;
//   name: string;
//   description: string;
//   thumbnail: Thumbnail;
// }

// interface ApiResponse {
//   results: Character[];
// }

// export default function Character() {
//   const [data, setData] = useState<ApiResponse>({ results: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState<Character[]>([]);
//   const [filledStars, setFilledStars] = useState<Character[]>([]);
//   const [favorites, setFavorites] = useState<Record<string, boolean>>({});

//   const handleClick = useCallback((characterId: string) => {
//     setFavorites((prevFavorites) => {
//       const newFavorites = { ...prevFavorites };
//       newFavorites[characterId] = !newFavorites[characterId];
//       localStorage.setItem("favorites", JSON.stringify(newFavorites));
//       return newFavorites;
//     });
//   }, []);
//   useEffect(() => {
//     // Charger les favoris depuis le localStorage
//     const storedFavorites = JSON.parse(
//       localStorage.getItem("favorites") || "{}"
//     );
//     setFavorites(storedFavorites);
//   }, []);

//   const handleInputCharacters = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = event.target.value;
//     setSearch(value);
//     // console.log('value', value);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/characters", {
//           method: "GET",
//         });
//         if (!res.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await res.json();
//         setData(data);
//         setFilteredData(data.results);
//       } catch (error) {
//         setError("error");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);
//   useEffect(() => {
//     if (data.results) {
//       const filtered = data.results.filter(
//         (character) =>
//           character.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
//           character.description
//             .toLowerCase()
//             .includes(search.toLocaleLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   }, [search, data]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <main>
//       <Navbar />

//       <div>
//         <div className="items-center flex max-w-sm space-x-2 m-2">
//           <Input
//             type="text"
//             placeholder="Personnage"
//             value={search}
//             onChange={handleInputCharacters}
//           />
//           <Button type="submit">Rechercher</Button>
//         </div>
//         <div className="grid grid-cols-3">
//           {filteredData.map((character) => {
//             return (
//               <div
//                 key={character._id}
//                 className="bg-primary hover:bg-primary-foreground mb-2 mr-2 ml-2 flex flex-col items-center rounded-md"
//               >
//                 <h1 className="text-white scroll-m-20 text-2xl font-semibold tracking-tight lg:text-2xl">
//                   {character.name}
//                 </h1>
//                 <CiStar
//                   className={`fill-current ${
//                     favorites[character._id] ? "fill-red-500" : "fill-gray-300"
//                   } w-10 h-10 cursor-pointer`}
//                   onClick={() => handleClick(character._id)}
//                 />
//                 <Link href={`/comics/${character._id}`}>
//                   <Image
//                     width={300}
//                     height={300}
//                     className="rounded-md"
//                     src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
//                     alt="Personnage Marvel"
//                   />
//                 </Link>

//                 <p className=" text-white text-center leading-6 line-clamp-2 [&:not(:first-child)]:mt-6">
//                   {character.description}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }

// import Image from 'next/image';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import Navbar from '../Navbar/page';

// async function getData() {
// 	const res = await fetch(
// 		'https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=o6GAkUgopwiunWCT'
// 	);
// 	// The return value is *not* serialized
// 	// You can return Date, Map, Set, etc.

// 	if (!res.ok) {
// 		// This will activate the closest `error.js` Error Boundary
// 		throw new Error('Failed to fetch data');
// 	}
// 	console.log('res.json', res.json);
// 	return res.json();
// }

// export default async function Page() {
// 	const data = await getData();

// 	return (
// 		<main>
// 			<Navbar />

// 			<div>
// 				<div className="items-center flex  max-w-sm  space-x-2 m-2">
// 					<Input type="text" placeholder="Personnage" />
// 					<Button type="submit">Rechercher</Button>
// 				</div>
// 				<div className="grid grid-cols-3">
// 					{data.results.map((character: any) => {
// 						return (
// 							<div
// 								key={character._id}
// 								className="bg-black mb-2 mr-2 flex flex-col items-center"
// 							>
// 								<h1 className="text-white">{character.name}</h1>
// 								<Image
// 									width={300}
// 									height={300}
// 									src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
// 									alt="Personnage Marvel"
// 								/>
// 								<p className="text-center text-white">
// 									{character.description}
// 								</p>
// 							</div>
// 						);
// 					})}
// 				</div>
// 			</div>
// 		</main>
// 	);
// }
