export const getFullImageUrl = (subPath: string) => {
  if (subPath && subPath?.includes("https://")) {
    return subPath;
  }

  const path = `https://baccvs-bucket.s3.eu-north-1.amazonaws.com/${subPath}`;
  return path;
};
