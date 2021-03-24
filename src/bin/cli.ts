import { dockerfileDiff } from '../index';

const dockerfileDiffCLI = async () => {
  const dockerfile1 = process.argv[2];
  const dockerfile2 = process.argv[3];

  await dockerfileDiff(dockerfile1, dockerfile2);
}

dockerfileDiffCLI();