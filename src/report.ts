export const diffMarkdownReport = (dockerfile1: string, dockerfile2: string, report: any) => {
  let markdownReport: string = "";

  markdownReport += "# Comparison report\n";

  markdownReport += "## Images\n";
  markdownReport += `**${dockerfile1}**: ${report.info1.images.length == 0 ? "n/a" : ""}\n`;

  report.info1.images.forEach((dep: string) => {
    markdownReport += `* ${dep}\n`;
  });

  markdownReport += `**${dockerfile2}**: ${report.info2.images.length == 0 ? "n/a" : ""}\n`;

  report.info2.images.forEach((dep: string) => {
    markdownReport += `* ${dep}\n`;
  });

  markdownReport += "\n";

  markdownReport += "## Installation Steps\n";
  markdownReport += `**${dockerfile1}**: ${report.info1.installationSteps.length == 0 ? "n/a" : ""}\n`;

  report.info1.installationSteps.forEach((step: string) => {
    markdownReport += `* ${step}\n`;
  });

  markdownReport += `**${dockerfile2}**: ${report.info2.installationSteps.length == 0 ? "n/a" : ""}\n`;

  report.info2.installationSteps.forEach((step: string) => {
    markdownReport += `* ${step}\n`;
  });

  markdownReport += '\n';

  markdownReport += "## Packages\n";

  report.diff.forEach((topic: any) => {
    markdownReport += `### Exclusive ${topic.DiffType} Packages\n`;
    markdownReport += `${dockerfile1}: ${topic.Diff.Packages1.length == 0 ? "n/a" : ""}\n`;

    topic.Diff.Packages1.forEach((dep: any) => {
      markdownReport += `* ${dep.Name}\n`;
    });

    markdownReport += `${dockerfile1}: ${topic.Diff.Packages2.length == 0 ? "n/a" : ""}\n`;

    topic.Diff.Packages2.forEach((dep: any) => {
      markdownReport += `* ${dep.Name}\n`;
    });

    markdownReport += '\n';

    markdownReport += `**Package Diff**: ${topic.Diff.InfoDiff.length == 0 ? "n/a" : ""}\n`;
    topic.Diff.InfoDiff.forEach((diff: any) => {
      markdownReport += `* **${diff.Package}**: \n`;
      markdownReport += `\t* **${dockerfile1}**: Version: ${diff.Info1[0].Version}, Size: ${diff.Info1[0].Size}\n`;
      markdownReport += `\t* **${dockerfile2}**: Version: ${diff.Info2[0].Version}, Size: ${diff.Info2[0].Size}\n`;
    });
    markdownReport += '\n';
  });

  markdownReport += "## Ports: \n";
  markdownReport += `**${dockerfile1}**: ${report.info1.ports.length === 0 ? "n/a" : report.info1.ports.join(', ')}\n`;
  markdownReport += `**${dockerfile2}**: ${report.info2.ports.length === 0 ? "n/a" : report.info2.ports.join(', ')}\n`;
  markdownReport += '\n';

  markdownReport += "## Entrypoint: \n";
  markdownReport += `**${dockerfile1}**: ${report.info1.entrypoint.length === 0 ? "n/a" : report.info1.entrypoint.join(" ")}\n`;
  markdownReport += `**${dockerfile2}**: ${report.info2.entrypoint.length === 0 ? "n/a" : report.info2.entrypoint.join(" ")}\n`;
  markdownReport += '\n';

  return markdownReport;
}