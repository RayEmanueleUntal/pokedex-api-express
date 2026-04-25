const express = require("express");
const cors = require("cors");
const pokemonRoutes = require("./routes/pokemon.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/pokemon", pokemonRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
