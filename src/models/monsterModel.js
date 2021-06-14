import preferences from '../preferences';

const Sweeper = require('sweeper-promise-v2');

const P = new Sweeper({
  protocol: 'https',
  hostName: 'pokeapi.co',
  versionPath: '/api/v2/',
  cacheLimit: 100 * 1000, // 100s
  timeout: 5 * 1000 // 5s
});

const SEARCH_LIMIT = 893; // Excluding monsters 100xx (No images available)
const LIST_CHUNK_SIZE = preferences.pageSize;
const DEFAULT_LANG = 'en';

const searchMonstersList = require('./data/searchMonstersData.json');
const customMonstersList = require('./data/customMonstersData.json');
const defaultData = require('./data/defaultMonsterData.json');

export const getMonsters = async (query) => {
  let list;
  const params = parseParams(query);
  if (params?.q) {
    list = await searchListItems(params);
  } else {
    list = await getListItems(params);
  }
  return list ?? [];
};

export const getMonsterDetails = async (query) => {
  return getDetails(query?.id, query?.lang);
};

export const getListItems = async (params) => {
  let list = await getMonstersList();
  if (params.ids) {
    const idsArray = params.ids.split(',');
    list = list.filter((item) => idsArray.includes(item.name));
  }
  if (params.listType === 'random') {
    list = getRandomList(list);
  }
  list = getChunk(list, params.limit, params.offset);
  return getItems(list, params);
};

export const searchListItems = async (params, limit, offset) => {
  const searchTerm = params.q?.toLowerCase();
  const results = searchMonstersList.filter(
    (item) => item.name?.includes(searchTerm) || item.types?.some((type) => type.name === searchTerm)
  );
  const list = getChunk(results, params.limit, params.offset);
  return getItems(list, params);
};

export const getDetails = async (id, lang) => {
  const [monster, species] = await Promise.all([getMonsterByName(id), getMonsterSpeciesByName(id)]);
  const code = formatCode(monster?.id);
  return (
    (monster && {
      id,
      code,
      name: monster.name,
      slug: monster.name,
      types: mapTypes(monster.types) ?? null,
      image: getMonsterImage(monster, code),
      imageRatio: monster.image_ratio ?? 1,
      tName: translateName(species?.names, lang) ?? null,
      color: species?.color?.name ?? null,
      evolvesFromId: species?.evolves_from_species?.name ?? null,
      abilities: monster.abilities?.map((item) => item.ability.name) ?? null,
      weight: monster.weight,
      height: monster.height,
      stats: mapStats(monster.stats) ?? null,
      category: '',
      description: getMonsterDescription(species, lang),
      gameConfig: mapGameConfig(monster.game_config) ?? null
    }) ??
    null
  );
};

const getMonstersList = async () => {
  let monstersList = [...customMonstersList];
  try {
    const pokeList = await P.getMonstersList({
      limit: SEARCH_LIMIT
    });
    monstersList = [...pokeList.results, ...customMonstersList];
  } catch (error) {
    console.error(error);
  }
  return monstersList;
};

const getMonsterByName = async (name) => {
  let monster = getCustomMonsterByName(name);
  if (!monster) {
    try {
      monster = await P.getMonsterByName(name);
    } catch (error) {
      console.error(error);
    }
  }
  return monster;
};

const getMonsterSpeciesByName = async (name) => {
  let monsterSpecies = getCustomMonsterByName(name);
  if (!monsterSpecies) {
    try {
      monsterSpecies = await P.getMonsterSpeciesByName(name);
    } catch (error) {
      console.error(error);
    }
  }
  return monsterSpecies;
};

const getCustomMonsterByName = (name) => {
  return customMonstersList.find((item) => item.name === name);
};

const parseParams = (query) => {
  const params = { ...query };
  params.limit = query.limit ?? query.pageSize ?? LIST_CHUNK_SIZE;
  params.offset = query.offset ?? (query.pageIndex && params.limit * (query.pageIndex - 1)) ?? 0;
  return params;
};

const getItem = async (id) => {
  const monster = await getMonsterByName(id);
  const code = formatCode(monster?.id);
  return (
    (monster && {
      id,
      code,
      name: monster.name,
      slug: monster.name,
      types: mapTypes(monster.types),
      image: getMonsterImage(monster, code)
    }) ??
    null
  );
};

const getItems = async (list, params) => {
  const items = await Promise.all(
    list.map(async (item) => {
      return getItem(item?.name, params?.lang || DEFAULT_LANG);
    })
  );
  // TODO: param filters
  return items.filter((monster) => monster && !monster.evolvesFromId);
};

const getRandomList = (list) => {
  return list.slice().sort(() => Math.random() - Math.random());
};

const getChunk = (list, limit, offset) => {
  const chunkSize = limit || LIST_CHUNK_SIZE;
  const chunkOffset = offset ?? 0;
  return list.slice(chunkOffset, chunkSize + chunkOffset);
};

const formatCode = (code) => code && code.toString().padStart(3, '0');

const translateName = (translations, lang) => {
  const translation = translations && translations.filter((item) => item.language && item.language.name === lang);
  return translation && translation.length > 0 ? translation[0].name : null;
};

const mapTypes = (types) => {
  return types?.map((item) => {
    return item && { id: item.type?.name, name: item.type?.name };
  });
};

const mapStats = (stats) => {
  return stats?.map((item) => {
    return item && { name: item.stat?.name, value: item.base_stat };
  });
};

const getMonsterImage = (monster, code) => {
  return monster?.image ? monster.image : `${preferences.monsterImageUrlPrefix}${code}.${preferences.monsterImageType}`;
};

const getMonsterDescription = (species, lang) => {
  var descriptionEntry = species?.flavor_text_entries?.length
    ? species.flavor_text_entries.find((entry) => entry?.language?.name === lang)
    : null;
  if (!descriptionEntry) {
    descriptionEntry = species?.flavor_text_entries?.length
      ? species.flavor_text_entries.find((entry) => entry?.language?.name === DEFAULT_LANG)
      : null;
  }
  return descriptionEntry?.flavor_text ?? '';
};

const mapGameConfig = (gameConfig) => {
  return {
    attacks: gameConfig?.attacks || null,
    audio: gameConfig?.audio || null,
    motionPath: gameConfig?.motionPath || defaultData.gameConfig.motionPath,
    maxSuccesRate: gameConfig?.maxSuccesRate || defaultData.gameConfig.maxSuccesRate
  };
};
