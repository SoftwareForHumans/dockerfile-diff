import { dockerfileDiff, markdownDockerfileDiff } from '../index';

const dockerfileDiffCLI = async () => {
  const dockerfile1 = process.argv[2];
  const dockerfile2 = process.argv[3];

  const report = await dockerfileDiff(dockerfile1, dockerfile2);

  console.log(markdownDockerfileDiff(dockerfile1, dockerfile2, report));
}

dockerfileDiffCLI();