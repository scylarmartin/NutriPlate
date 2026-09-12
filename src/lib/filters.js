export const filterOptions = {
  meal: ['Breakfast', 'Lunch', 'Dinner'],
  diet: ['Vegetarian', 'Vegan', 'Dairy-free'],
  protein: ['Beans & lentils', 'Chicken', 'Fish', 'Dairy & eggs', 'Nuts & seeds'],
  time: ['15', '30', '45'],
  sort: ['featured', 'quickest', 'name'],
};
export function readFilters(params) {
  return Object.fromEntries(['q', 'meal', 'diet', 'protein', 'time', 'sort'].map(key => [key, key === 'q' ? (params.get(key) || '').slice(0, 150) : filterOptions[key].includes(params.get(key)) ? params.get(key) : key === 'sort' ? 'featured' : '']));
}
export function filterRecipes(recipes, filters = {}) {
  const words = (filters.q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  const result = recipes.filter(recipe => {
    const searchable = [recipe.title, recipe.description, ...recipe.ingredients].join(' ').toLowerCase();
    return words.every(word => searchable.includes(word)) && (!filters.meal || recipe.meal === filters.meal) && (!filters.diet || recipe.diets.includes(filters.diet)) && (!filters.protein || recipe.protein === filters.protein) && (!filters.time || recipe.time <= Number(filters.time));
  });
  if (filters.sort === 'quickest') result.sort((a, b) => a.time - b.time);
  if (filters.sort === 'name') result.sort((a, b) => a.title.localeCompare(b.title));
  return result;
}
