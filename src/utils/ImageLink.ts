const ImageLink = (links: string): string[] => {
  const imagesLink = [];
  links.split(",").map((image) => {
    imagesLink.push(`http://localhost:3333/temp/uploads/${image}`);
  });

  return imagesLink;
};

export default ImageLink;
