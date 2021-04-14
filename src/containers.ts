import tar from 'tar-fs';
import Docker from 'dockerode';

const docker = new Docker();

export const buildImage = (dockerfile: string) => new Promise<string>((resolve, reject) => {
  const path = process.env.PWD || '.';
  const tarDir = tar.pack(path);

  const imageKey = Math.random().toString(36).substr(2, 3)
    + Math.random().toString(36).substr(2, 3)
    + Math.random().toString(36).substr(2, 4);

  docker.buildImage(tarDir, { t: imageKey, dockerfile: dockerfile, q: true }, (error, stream) => {
    if (error) {
      reject(error);
    }

    if (stream) {
      stream.on('error', (error: Buffer) => {
        console.log(error.toString());
      });

      stream.on('data', (dataBuffer: Buffer) => {
        try {
          const msg = JSON.parse(dataBuffer.toString())['stream'].replace("\n", "");
          console.log(`Docker Message - ${msg}`);
        }
        catch (_e) {
          console.log(`Container Stream - ${dataBuffer.toString()}`);
        }
      });

      stream.on('end', () => {
        resolve(imageKey);
      });
    }
    else {
      reject(Error('Failed to stream from the docker socket'));
    }
  });
});

export const removeImage = (imageId: string) => docker.getImage(imageId).remove({ force: true });