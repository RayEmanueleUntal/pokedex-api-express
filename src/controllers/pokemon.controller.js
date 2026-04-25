const pokemonService = require("../services/pokemon.service");

exports.getAllPokemons = async (req, res) => {
  try {
    const pokemons = await pokemonService.getAllPokemons();
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPokemonById = async (req, res) => {
  const { id } = req.params;
  try {
    const pokemon = await pokemonService.getPokemonById(id);

    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      res.status(404).json({ message: "Pokemon not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.createPokemon = async (req, res) => {
  const pokemonData = req.body;
  try {
    const newPokemon = await pokemonService.createPokemon(pokemonData);
    res.status(200).json(newPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.editPokemon = async (req, res) => {
  const { id } = req.params;
  const pokemonData = req.body;
  try {
    const edited = await pokemonService.editPokemon(id, pokemonData);
    res.status(200).json(edited);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePokemon = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pokemonService.deletePokemon(id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
