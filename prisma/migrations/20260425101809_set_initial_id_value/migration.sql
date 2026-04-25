-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "base_experience" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL DEFAULT 0,
    "attack" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "special_attack" INTEGER NOT NULL DEFAULT 0,
    "special_defense" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "front_default" TEXT,
    "front_shiny" TEXT,
    "front_female" TEXT,
    "front_shiny_female" TEXT,
    "back_default" TEXT,
    "back_shiny" TEXT,
    "back_female" TEXT,
    "back_shiny_female" TEXT,
    "abilities" TEXT[],
    "types" TEXT[],
    "sprite_url" TEXT,
    "cry_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletedPokemon" (
    "id" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedPokemon_pkey" PRIMARY KEY ("id")
);

ALTER SEQUENCE "Pokemon_id_seq" RESTART WITH 50001;