import fs from 'fs';

const readDockerfile = (dockerfile: string) => (
  fs.readFileSync(dockerfile, { encoding: 'utf8', flag: 'r' }).toString().split('\n')
);

export const extractInfo = (dockerfile: string) => {
  const images = new Array<string>();
  const installationSteps = new Array<string>();
  const ports = new Array<string>();

  let entrypoint: any;

  readDockerfile(dockerfile).forEach((line: string) => {
    if (line.includes("FROM")) {
      images.push(line.replace("FROM", "").trim());
    }

    if (line.includes("RUN")) {
      installationSteps.push(line.replace("RUN", "").trim());
    }


    if (line.includes("EXPOSE")) {
      ports.push(line.replace("EXPOSE", "").trim());
    }

    if (line.includes("ENTRYPOINT") || line.includes("CMD")) {
      const cmdRegex = RegExp('\\[.*?\\]').exec(line);
      if (cmdRegex == null) throw new Error('Dockerfile has no enrypoint');

      entrypoint = JSON.parse(cmdRegex[0]);
    }
  });

  return {
    images: images,
    installationSteps: installationSteps,
    ports: ports,
    entrypoint: entrypoint
  }
}