import markdownpdf from 'markdown-pdf';

import { buildImage, removeImage } from './containers';
import { dockerDiff } from './diff';
import { extractInfo } from './inspector';
import { diffMarkdownReport } from './report';

import ComparisonData from './lib/ComparisonData';

const DIFF_REPORT_NAME = "diff-report.pdf";

export const dockerfileDiff = async (dockerfile1: string, dockerfile2: string) => {
  console.log(`Inspecting ${dockerfile1}`);
  const dockerfile1Info = extractInfo(dockerfile1);

  console.log(`Inspecting ${dockerfile2}`);
  const dockerfile2Info = extractInfo(dockerfile2);

  console.log("Creating images from dockerfiles");

  const image1 = await buildImage(dockerfile1);
  console.log(`Image with tag ${image1} created`);
  const image2 = await buildImage(dockerfile2);
  console.log(`Image with tag ${image2} created`);

  console.log("Comparing images. This operation may take a few minutes...");
  const diff = dockerDiff(image1, image2);
  console.log("Comparison finished");

  console.log("Removing images");

  removeImage(image1)
  console.log(`Image with tag ${image1} removed`);
  removeImage(image2)
  console.log(`Image with tag ${image2} removed`);

  return {
    diff: diff,
    info1: dockerfile1Info,
    info2: dockerfile2Info
  };
}

export const markdownDockerfileDiff = (dockerfile1: string, dockerfile2: string, report: any) => new Promise<ComparisonData>(
  (resolve, _reject) => {
    const comparisonReport = diffMarkdownReport(dockerfile1, dockerfile2, report);

    markdownpdf().from.string(comparisonReport.markdownReport).to(DIFF_REPORT_NAME, () => {
      console.log(`Comparison report successfully generated with name ${DIFF_REPORT_NAME}`);
      resolve(comparisonReport.comparisonData);
    });
  });