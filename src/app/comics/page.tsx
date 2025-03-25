"use client";
import Image from "next/image";
import Navbar from "../Navbar/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
// import Link from "next/link";

interface Thumbnail {
  path: string;
  extension: string;
}

interface Comic {
  _id: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
}

interface ApiResponse {
  results: Comic[];
}

export default function Comics() {
  const [data, setData] = useState<ApiResponse>({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<Comic[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const handleFavorite = (comicId: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = { ...prevFavorites };
      newFavorites[comicId] = !newFavorites[comicId];
      localStorage.setItem("comic-favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("comic-favorites") || "{}"
    );
    setFavorites(storedFavorites);
  }, []);

  const handleInputComics = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/comics", {
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
        (comic) =>
          comic.title?.toLowerCase().includes(search.toLowerCase()) ||
          comic.description?.toLowerCase().includes(search.toLowerCase())
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
              placeholder="Search Marvel Comics"
              value={search}
              onChange={handleInputComics}
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
          {filteredData.map((comic) => (
            <div
              key={comic._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative">
                <Image
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={`${comic.title} Comic Cover`}
                />
                <button
                  onClick={() => handleFavorite(comic._id)}
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
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {comic.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {comic.description || "No description available"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No comics found matching your search.
          </div>
        )}
      </div>
    </main>
  );
}
// "use client";
// import Image from "next/image";
// import Navbar from "../Navbar/page";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";

// interface Thumbnail {
//   path: string;
//   extension: string;
// }

// interface Comic {
//   _id: string;
//   title: string;
//   description: string;
//   thumbnail: Thumbnail;
// }

// interface ApiResponse {
//   results: Comic[];
// }

// export default function Comics() {
//   const [data, setData] = useState<ApiResponse>({ results: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState<Comic[]>([]);

//   const handleInputComics = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setSearch(value);
//     console.log(value);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/comics", {
//           method: "GET",
//         });
//         if (!res.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await res.json();
//         setData(data);
//         // setFilteredData(data.results);
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
//         (comic) =>
//           comic.title?.toLowerCase().includes(search.toLowerCase()) ||
//           false ||
//           comic.description?.toLowerCase().includes(search.toLowerCase()) ||
//           false
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
//             placeholder="Comics"
//             value={search}
//             onChange={handleInputComics}
//           />
//           <Button type="submit" className="text-white">
//             Rechercher
//           </Button>
//         </div>
//         <div className="grid grid-cols-3">
//           {filteredData.map((comic) => {
//             return (
//               <div
//                 key={comic._id}
//                 className="bg-primary items-center hover:bg-primary-foreground mb-2 mr-2 ml-2 flex flex-col  rounded-md"
//               >
//                 <h1 className="text-white scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl">
//                   {comic.title}
//                 </h1>
//                 <Image
//                   width={300}
//                   height={300}
//                   className="rounded-md"
//                   src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
//                   alt="Image des Comics"
//                 />
//                 <p className="text-white text-center leading-6 line-clamp-2 [&:not(:first-child)]:mt-6">
//                   {comic.description}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }
