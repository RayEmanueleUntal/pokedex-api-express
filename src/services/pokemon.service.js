const prisma = require("./db.service");
const { mapPokeApiToLocal } = require("../utils/Cleaner");
const baseAPIUrl = "https://pokeapi.co/api/v2";
const limit = 30;

// GET all pokemons from both the database (local) and pokeAPI
exports.getAllPokemons = async () => {
  const createdPokemons = await prisma.pokemon.findMany(); // pokemons from the database
  const createdIDs = new Set(createdPokemons.map((p) => Number(p.id))); // ids that already exist in the database

  const deletedPokemons = await prisma.deletedPokemon.findMany(); // deleted pokemons stored in the db
  const deletedIDs = new Set(deletedPokemons.map((p) => Number(p.id))); // deleted pokemons' ids

  const listResponse = await fetch(`${baseAPIUrl}/pokemon?limit=${limit}`); // fetch the pokeAPI
  const { results } = await listResponse.json();

  // Filter out pokemons from the API that already exist in the database or have been deleted(through ID)
  const filteredResults = results.filter((item) => {
    const id = parseInt(item.url.split("/").filter(Boolean).pop());
    return !createdIDs.has(id) && !deletedIDs.has(id);
  });

  // Fetch only the details needed
  const externalPokemons = await Promise.all(
    filteredResults.map(async (item) => {
      try {
        // Start both fetches at once
        const pokemonPromise = fetch(item.url).then((res) => res.json());
        const speciesPromise = fetch(
          `${baseAPIUrl}/pokemon-species/${item.name}`,
        ).then((res) => res.json());

        // Wait for both to finish
        const [pokemonData, speciesData] = await Promise.all([
          pokemonPromise,
          speciesPromise,
        ]);

        return mapPokeApiToLocal(pokemonData, speciesData);
      } catch (e) {
        console.error(
          `Failed to fetch full details for ${item.name}:`,
          e.message,
        );
        return null;
      }
    }),
  );

  const combined = [
    ...createdPokemons,
    ...externalPokemons.filter(Boolean),
  ].sort((a, b) => a.id - b.id);

  return combined;
};

// GET a pokemon by its id. Checks first if it exists in the local db; pokeAPI, otherwise
exports.getPokemonById = async (id) => {
  const pokemon = await prisma.pokemon.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  // If pokemon ID exists in the database
  if (pokemon) {
    return pokemon;
  }

  // Fetch the pokemon
  const pokemonRes = await fetch(`${baseAPIUrl}/pokemon/${id}`);
  if (!pokemonRes.ok) throw new Error("Failed to fetch Pokemon");
  const pokemonData = await pokemonRes.json();

  // Fetch the pokemon's species
  const speciesRes = await fetch(pokemonData.species.url);
  if (!speciesRes.ok) throw new Error("Failed to fetch Species");
  const speciesData = await speciesRes.json();

  return mapPokeApiToLocal(pokemonData, speciesData);
};

// POST / Create a pokemon
exports.createPokemon = async (data) => {
  return await prisma.pokemon.create({
    data,
  });
};

// PATCH / Edit a pokemon
exports.editPokemon = async (id, data) => {
  const { name, description, weight, height, abilities, base_experience } =
    data;

  const cleanData = {
    name,
    description,
    weight,
    height,
    abilities,
    base_experience,
  };

  // Check if id exists in the database
  const pokemon = await prisma.pokemon.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (pokemon) {
    await prisma.pokemon.update({
      where: { id: parseInt(id) },
      data: cleanData,
    });

    return { success: true };
  }

  // If id doesn't exist in the db, fetch the pokemon from pokeAPI,
  // add to the DB with the edited values

  // Fetch the pokemon
  const pokemonRes = await fetch(`${baseAPIUrl}/pokemon/${id}`);
  if (!pokemonRes.ok) throw new Error("Failed to fetch Pokemon");
  const pokemonData = await pokemonRes.json();

  const fetchedPokemon = mapPokeApiToLocal(pokemonData, null);
  // Change the values
  fetchedPokemon.name = name;
  fetchedPokemon.description = description;
  fetchedPokemon.weight = weight;
  fetchedPokemon.height = height;
  fetchedPokemon.abilities = abilities;
  fetchedPokemon.base_experience = base_experience;

  // Save the pokemon to the database
  await this.createPokemon(fetchedPokemon);

  return { success: true };
};

// DELETE pokemon. If pokemon is in the pokemon db, directly delete.
// also, add to deletedPokemon table
exports.deletePokemon = async (id) => {
  // Check if id exists in the database
  const pokemon = await prisma.pokemon.findUnique({
    where: { id: parseInt(id) },
  });

  if (pokemon) {
    await prisma.pokemon.delete({
      where: { id: parseInt(id) },
    });

    if (parseInt(id) > 5000) {
      // if pokemon is just from db, just skip
      return { success: true };
    }
  }

  // If id doesn't exist in the db, add the id in the deletedPokemons table
  await prisma.deletedPokemon.create({
    data: {
      id: parseInt(id),
    },
  });

  return { success: true };
};
