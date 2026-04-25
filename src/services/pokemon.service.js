const prisma = require("./db.service");

exports.getAllPokemons = async () => {
  return await prisma.pokemon.findMany();
};

exports.getPokemonById = async (id) => {
  const user = await prisma.pokemon.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return user;
};

exports.createPokemon = async (data) => {
  return await prisma.pokemon.create({
    data,
  });
};

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

  await prisma.pokemon.update({
    where: { id: parseInt(id) },
    data: cleanData,
  });

  return { success: true };
};

exports.deletePokemon = async (id) => {
  await prisma.pokemon.delete({
    where: { id: parseInt(id) },
  });

  return { success: true };
};
