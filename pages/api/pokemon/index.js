import { getMonsters } from '../../../src/models/monsterModel';

export default async function handler({ query }, res) {
  const monsters = await getMonsters(query);
  res.status(200).json(monsters);
}
