import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const response = await fetch(
      "https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=o6GAkUgopwiunWCT"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from external API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
};
