import { execSync } from 'child_process';

export const dockerDiff = (image1: string, image2: string) => {
  try {
    const packageName: any = JSON.parse(execSync(
      `container-diff diff --json --type=apt --type=pip --type=node daemon://${image1} daemon://${image2}`,
      { stdio: 'pipe', encoding: 'utf-8' }
    ));

    return packageName;
  }
  catch (e) { }

  return null;
}