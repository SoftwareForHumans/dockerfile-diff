import { buildImage, removeImage } from './containers';
import { dockerDiff } from './diff';

export const dockerfileDiff = async (dockerfile1: string, dockerfile2: string) => {
  const image1 = await buildImage(dockerfile1);
  const image2 = await buildImage(dockerfile2);

  const diff = dockerDiff(image1, image2);

  await Promise.all([removeImage(image1), removeImage(image2)]);

  return diff;
}
