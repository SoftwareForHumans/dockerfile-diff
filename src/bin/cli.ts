import { dockerfileDiff } from '../index';

const dockerfileDiffCLI = async () => {
  const dockerfile1 = process.argv[2];
  const dockerfile2 = process.argv[3];

  const report = await dockerfileDiff(dockerfile1, dockerfile2);

  console.log("Comparison report:");

  console.log("# Images");
  console.log(`${dockerfile1}: ${report.info1.images.join(', ')}`);
  console.log(`${dockerfile2}: ${report.info2.images.join(', ')}`);

  console.log("# Installation Steps");
  console.log(`${dockerfile1}: ${report.info1.installationSteps.join(', ')}`);
  console.log(`${dockerfile2}: ${report.info2.installationSteps.join(', ')}`);

  console.log("# Packages");
  report.diff.forEach((topic: any) => {
    console.log(`## ${topic.DiffType}`);

    console.log(`${dockerfile1}: ${topic.Diff.Packages1}`);
    console.log(`${dockerfile2}: ${topic.Diff.Packages1}`);
    console.log(`Info Diff: ${topic.Diff.InfoDiff}`);
  });


  console.log("# Ports");
  console.log(`${dockerfile1}: ${report.info1.ports.join(', ')}`);
  console.log(`${dockerfile2}: ${report.info2.ports.join(', ')}`);

  console.log("# Entrypoint");
  console.log(`${dockerfile1}: ${report.info1.entrypoint}`);
  console.log(`${dockerfile2}: ${report.info2.entrypoint}`);
}

dockerfileDiffCLI();