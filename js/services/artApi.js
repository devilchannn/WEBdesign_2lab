
const API_URL = "https://openaccess-api.clevelandart.org/api/artworks/";

export async function getRandomArt(signal) {
  const params = new URLSearchParams({
    has_image: "1",
    cc0: "",
    limit: "30",
    skip: String(Math.floor(Math.random() * 300))
  });

  const response = await fetch(`${API_URL}?${params}`, {
    signal
  });

  if (!response.ok) {
    throw new Error(`Museum API: HTTP ${response.status}`);
  }

  const result = await response.json();

  const artworks = (result.data || []).filter(
    art => art.images?.web?.url
  );

  if (!artworks.length) {
    throw new Error("No artworks with images found.");
  }

  const art = artworks[Math.floor(Math.random() * artworks.length)];

  return {
    uid: `cleveland-${art.id}`,
    title: art.title || "Untitled",
    artist: art.creators?.map(c => c.description).join(", ") || "Unknown artist",
    date: art.creation_date || "",
    image: art.images.web.url,
    source: "Cleveland Museum of Art",
    url: art.url || `https://www.clevelandart.org/art/${art.id}`
  };
}
