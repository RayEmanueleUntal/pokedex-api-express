function mapPokeApiToLocal(externalData, speciesData) {
  const englishEntry = speciesData?.flavor_text_entries?.find(
    (entry) => entry.language.name === "en",
  );

  // Clean up description
  const description = englishEntry
    ? englishEntry.flavor_text.replace(/[\n\f]/g, " ")
    : "No description available.";

  return {
    id: externalData.id,
    name: externalData.name,
    description: description,
    weight: externalData.weight,
    height: externalData.height,
    base_experience: externalData.base_experience,

    // stats
    hp: externalData.stats.find((s) => s.stat.name === "hp")?.base_stat,
    attack: externalData.stats.find((s) => s.stat.name === "attack")?.base_stat,
    defense: externalData.stats.find((s) => s.stat.name === "defense")
      ?.base_stat,
    special_attack: externalData.stats.find(
      (s) => s.stat.name === "special-attack",
    )?.base_stat,
    special_defense: externalData.stats.find(
      (s) => s.stat.name === "special-defense",
    )?.base_stat,
    speed: externalData.stats.find((s) => s.stat.name === "speed")?.base_stat,

    // sprites
    front_default: externalData.sprites?.front_default || null,
    front_shiny: externalData.sprites?.front_shiny || null,
    front_female: externalData.sprites?.front_female || null,
    front_shiny_female: externalData.sprites?.front_shiny_female || null,
    back_default: externalData.sprites?.back_default || null,
    back_shiny: externalData.sprites?.back_shiny || null,
    back_female: externalData.sprites?.back_female || null,
    back_shiny_female: externalData.sprites?.back_shiny_female || null,

    abilities: externalData.abilities.map((a) => a.ability.name),
    types: externalData.types.map((t) => t.type.name),

    cry_url: externalData.cries?.latest || null,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { mapPokeApiToLocal };
