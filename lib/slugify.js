export function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getBrandSlug(brand) {
  return slugify(brand);
}

export function getShoeSlug(brand, shoeName) {
  const modelName = shoeName.replace(new RegExp(`^${brand}\\s*`, 'i'), '').trim() || shoeName;
  return slugify(modelName);
}
