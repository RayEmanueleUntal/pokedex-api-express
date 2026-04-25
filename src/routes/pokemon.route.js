const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon.controller");

// ==== Routes ====

// GET
router.get("/", pokemonController.getAllPokemons);
router.get("/:id", pokemonController.getPokemonById);

// POST
router.post("/", pokemonController.createPokemon);

// UPDATE/PATCH
router.patch("/:id", pokemonController.editPokemon);

// DELETE
router.delete("/:id", pokemonController.deletePokemon);

module.exports = router;
