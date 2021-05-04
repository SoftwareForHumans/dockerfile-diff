import storage from 'node-persist';
import path from 'path';

import { dockerfileDiff, markdownDockerfileDiff } from '../index';
import { printDatabase } from '../csv';

const dockerfileDiffCLI = async () => {
  const initStorage = storage.init({ dir: path.join(__dirname, '../.diff') });


  if (process.argv[2] == "print") {
    await initStorage;
    const items = await storage.values();
    await printDatabase(items);
    console.log("Database printed");
    return;
  }

  const dockerfile1 = process.argv[2] || "Dockerfile";
  const dockerfile2 = process.argv[3] || "Dockerfile.hermit";

  const report = await dockerfileDiff(dockerfile1, dockerfile2);

  const comparisonData = await markdownDockerfileDiff(dockerfile1, dockerfile2, report);

  await initStorage;
  await storage.setItem(comparisonData.name, comparisonData);
}

dockerfileDiffCLI();