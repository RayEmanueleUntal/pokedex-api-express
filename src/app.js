const express = require("express");
const pokemonRoutes = require("./routes/pokemon.route");

const app = express();

app.use(express.json());

app.use("/pokemon", pokemonRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
