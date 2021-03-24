import { dockerfileDiff } from '../index';

const dockerfileDiffCLI = async () => {
  const dockerfile1 = process.argv[2];
  const dockerfile2 = process.argv[3];

  const report = await dockerfileDiff(dockerfile1, dockerfile2);

  console.log("Comparison report");
  console.log("Apt packages");
  console.log(report[0].diff);
  console.log("Node packages");
  console.log(report[1].diff);
  console.log("Pip packages");
  console.log(report[2].diff);
}

dockerfileDiffCLI();