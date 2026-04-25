const prisma = require("./db.service");

exports.getAllPokemons = async () => {
  return await prisma.pokemon.findMany();
};

exports.getPokemonById = async (id) => {
  const user = await prisma.pokemon.findUnique({
    where: {
      id: Number(id),
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
  await prisma.pokemon.update({
    where: { id },
    data,
  });

  return { success: true };
};

exports.deletePokemon = async (id) => {
  await prisma.pokemon.delete({
    where: { id },
  });

  return { success: true };
};
