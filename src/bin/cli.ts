import { dockerfileDiff } from '../index';

const dockerfileDiffCLI = async () => {
  const dockerfile1 = process.argv[2];
  const dockerfile2 = process.argv[3];

  const report = await dockerfileDiff(dockerfile1, dockerfile2);

  console.log("Comparison report");

  report.forEach((topic: any) => {
    console.log(topic.DiffType);
    console.log(topic.Diff);
  });
}

dockerfileDiffCLI();