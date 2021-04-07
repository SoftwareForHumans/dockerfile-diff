import { compareTwoStrings } from 'string-similarity';

const portsDetectionEvaluation = (ports1: Array<number>, ports2: Array<number>) => {
  let portHits = 0;
  let portMisses = 0;

  ports1.forEach((port) => {
    if (ports2.includes(port)) portHits++;
  });

  ports2.forEach((port) => {
    if (!ports1.includes(port)) portMisses++;
  });

  const accuracy = (portHits === 0) ?
    (ports1.length === 0 ? 100 : 0)
    : (portHits * 100 / ports1.length).toFixed(1);

  const risk = (portMisses === 0) ? 0 : (portMisses * 100 / ports2.length).toFixed(1);

  return {
    accuracy: accuracy,
    risk: risk
  }
}


export const diffMarkdownReport = (dockerfile1: string, dockerfile2: string, report: any) => {
  let markdownReport: string = "";

  markdownReport += "# Comparison report\n";

  markdownReport += "## Images\n";
  markdownReport += `**${dockerfile1}**: ${report.info1.images.length == 0 ? "n/a" : ""}\n`;

  report.info1.images.forEach((dep: string) => {
    markdownReport += `* ${dep}\n`;
  });

  markdownReport += "\n";

  markdownReport += `**${dockerfile2}**: ${report.info2.images.length == 0 ? "n/a" : ""}\n`;

  report.info2.images.forEach((dep: string) => {
    markdownReport += `* ${dep}\n`;
  });

  markdownReport += "\n";

  markdownReport += "## Installation Steps\n";
  markdownReport += `**${dockerfile1}**: ${report.info1.installationSteps.length == 0 ? "n/a" : ""}\n`;
  let count1 = 0;

  report.info1.installationSteps.forEach((step: string) => {
    count1++;
    markdownReport += `${count1}. ${step}\n`;
  });

  markdownReport += "\n";

  markdownReport += `**${dockerfile2}**: ${report.info2.installationSteps.length == 0 ? "n/a" : ""}\n`;
  let count2 = 0;

  report.info2.installationSteps.forEach((step: string) => {
    count2++;
    markdownReport += `${count2}. ${step}\n`;
  });

  markdownReport += '\n';

  markdownReport += "## Packages\n";

  let containerSize = 0;
  let bloatSize = 0;
  let diffBalance = 0;

  report.diff.forEach((topic: any) => {
    if (topic.DiffType == "Size") {
      containerSize = topic.Diff[0].Size2;
      return;
    }

    markdownReport += `### Exclusive ${topic.DiffType} Packages\n`;
    markdownReport += `**${dockerfile1}**: ${topic.Diff.Packages1.length == 0 ? "n/a" : ""}\n`;

    topic.Diff.Packages1.forEach((dep: any) => {
      markdownReport += `* ${dep.Name}\n`;
    });

    markdownReport += "\n";

    markdownReport += `**${dockerfile2}**: ${topic.Diff.Packages2.length == 0 ? "n/a" : ""}\n`;

    topic.Diff.Packages2.forEach((dep: any) => {
      bloatSize += dep.Size;
      markdownReport += `* ${dep.Name}\n`;
    });

    markdownReport += '\n';

    markdownReport += `**Package Diff**: ${topic.Diff.InfoDiff.length == 0 ? "n/a" : ""}\n`;
    topic.Diff.InfoDiff.forEach((diff: any) => {
      markdownReport += `* **${diff.Package}**: \n`;

      const size1 = diff.Info1[0].Size;
      const size2 = diff.Info2[0].Size;
      diffBalance += size2 - size1;

      markdownReport += `\t* **${dockerfile1}**: Version: ${diff.Info1[0].Version}, Size: ${size1}\n`;
      markdownReport += `\t* **${dockerfile2}**: Version: ${diff.Info2[0].Version}, Size: ${size2}\n`;
    });
    markdownReport += '\n';
  });

  markdownReport += `### Dependencies Evaluation\n`;
  markdownReport += `**Bloat Ratio**: ${(bloatSize * 100 / containerSize).toFixed(1)}%\n`;
  markdownReport += `**Package Diff Balance**: ${diffBalance} B\n`;

  markdownReport += "## Ports\n";

  const ports1 = report.info1.ports;
  const ports2 = report.info2.ports;

  markdownReport += `**${dockerfile1}**: ${ports1.length === 0 ? "n/a" : ports1.join(', ')}\n`;
  markdownReport += `**${dockerfile2}**: ${ports2.length === 0 ? "n/a" : ports2.join(', ')}\n`;

  const portsEval = portsDetectionEvaluation(ports1, ports2);

  markdownReport += `**Accuracy Ratio**: ${portsEval.accuracy}%\n`;
  markdownReport += `**Risk Ratio**: ${portsEval.risk}%\n`;
  markdownReport += '\n';

  markdownReport += "## Entrypoint\n";

  const entrypoint1 = report.info1.entrypoint.join(" ");
  const entrypoint2 = report.info2.entrypoint.join(" ");
  const similarity = (compareTwoStrings(entrypoint1, entrypoint2) * 100).toFixed(1);

  markdownReport += `**${dockerfile1}**: ${report.info1.entrypoint.length === 0 ? "n/a" : entrypoint1}\n`;
  markdownReport += `**${dockerfile2}**: ${report.info2.entrypoint.length === 0 ? "n/a" : entrypoint2}\n`;
  markdownReport += `**Similarity**: ${similarity}%\n`;
  markdownReport += '\n';

  return markdownReport;
}