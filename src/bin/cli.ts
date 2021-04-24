import { dockerfileDiff, markdownDockerfileDiff } from '../index';
import storage, { init } from 'node-persist';

const dockerfileDiffCLI = async () => {
  const initStorage = storage.init();

  const dockerfile1 = process.argv[2];
  const dockerfile2 = process.argv[3];

  const report = await dockerfileDiff(dockerfile1, dockerfile2);

  const comparisonData = await markdownDockerfileDiff(dockerfile1, dockerfile2, report);

  await initStorage;
  await storage.setItem(comparisonData.name, comparisonData);
}

dockerfileDiffCLI();