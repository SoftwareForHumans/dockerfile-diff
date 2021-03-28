import { dockerfileDiff } from '../index';

const dockerfileDiffCLI = async () => {
  const dockerfile1 = process.argv[2];
  const dockerfile2 = process.argv[3];

  const report = await dockerfileDiff(dockerfile1, dockerfile2);

  console.log("Comparison report:");

  console.log("# Images");
  console.log(`${dockerfile1}: [${report.info1.images.join(', ')}]`);
  console.log(`${dockerfile2}: [${report.info2.images.join(', ')}]`);

  console.log("# Installation Steps");
  console.log(`${dockerfile1}: [${report.info1.installationSteps.join('; ')}]`);
  console.log(`${dockerfile2}: [${report.info2.installationSteps.join('; ')}]`);

  console.log("# Packages");
  report.diff.forEach((topic: any) => {
    console.log(`## Exclusive ${topic.DiffType} Packages`);

    const packages1 = topic.Diff.Packages1.map((dep: any) => (
      dep.Name
    ));

    const packages2 = topic.Diff.Packages2.map((dep: any) => (
      dep.Name
    ));

    console.log(`${dockerfile1}: ${packages1}`);
    console.log(`${dockerfile2}: ${packages2}`);
    console.log(`Info Diff: ${topic.Diff.InfoDiff}`);
  });

  console.log("# Ports");
  console.log(`${dockerfile1}: ${report.info1.ports.join(', ')}`);
  console.log(`${dockerfile2}: ${report.info2.ports.join(', ')}`);

  console.log("# Entrypoint");
  console.log(`${dockerfile1}: ${report.info1.entrypoint.join(" ")}`);
  console.log(`${dockerfile2}: ${report.info2.entrypoint.join(" ")}`);
}

dockerfileDiffCLI();