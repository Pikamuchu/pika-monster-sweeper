import { getSweepers, updateSweepers, deleteSweepers } from '../../../src/models/sweeperModel';

export default async function handler({ query, method }, res) {
  switch (method) {
    case 'GET': {
      const sweepers = await getSweepers(query);
      res.status(200).json(sweepers);
      break;
    }
    case 'POST':
    case 'PUT':
      await updateSweepers(query);
      res.status(200).json(null);
      break;
    case 'DELETE':
      await deleteSweepers(query);
      res.status(200).json(null);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
