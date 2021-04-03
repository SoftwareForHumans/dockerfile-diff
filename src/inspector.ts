import fs from 'fs';

const readDockerfile = (dockerfile: string) => (
  fs.readFileSync(dockerfile, { encoding: 'utf8', flag: 'r' }).toString().split('\n')
);

export const extractInfo = (dockerfile: string) => {
  const images = new Array<string>();
  const installationSteps = new Array<string>();
  const ports = new Array<string>();

  let entrypoint: any;

  const dockerfileLines = readDockerfile(dockerfile);

  for (let i = 0; i < dockerfileLines.length; i++) {
    const line = dockerfileLines[i];

    if (line.includes("FROM")) {
      images.push(line.replace("FROM", "").trim().split(" ")[0]);
    }

    if (line.includes("RUN")) {
      let cmd = line.replace("RUN", "").trim();
      let index = i;

      while (cmd[cmd.length - 1] === '\\') {
        index++;
        cmd = cmd.replace("\\", dockerfileLines[index].trim());
      }

      installationSteps.push(cmd);
    }


    if (line.includes("EXPOSE")) {
      ports.push(line.replace("EXPOSE", "").trim());
    }

    if (line.includes("ENTRYPOINT") || line.includes("CMD")) {
      const cmdRegex = RegExp('\\[.*?\\]').exec(line);
      if (cmdRegex == null) throw new Error('Dockerfile has no enrypoint');

      entrypoint = JSON.parse(cmdRegex[0]);
    }
  };

  return {
    images: images,
    installationSteps: installationSteps,
    ports: ports,
    entrypoint: entrypoint
  }
}