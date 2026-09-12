import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRecipe, recipes } from '../data/recipes.js';
import credits from '../data/credits.json';
import RecipeCard, { RecipeImage } from '../components/RecipeCard.jsx';
import Icon from '../components/Icon.jsx';
import NotFound from './NotFound.jsx';

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = getRecipe(id);
  const [checked, setChecked] = useState({});
  if (!recipe) return <NotFound />;
  const credit = credits.find(item => item.id === id);
  const related = recipes.filter(item => item.id !== id && (item.meal === recipe.meal || item.protein === recipe.protein)).slice(0, 3);
  return <div className="container page-content recipe-detail" key={id}>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><Icon name="chevron" size={13} /><Link to="/recipes">Recipes</Link><Icon name="chevron" size={13} /><span aria-current="page">{recipe.title}</span></nav>
    <section className="detail-hero"><div className="detail-intro"><p className="eyebrow">{recipe.meal.toUpperCase()} · EVERYDAY COOKING</p><h1 tabIndex={-1}>{recipe.title}</h1><p className="detail-description">{recipe.description}</p><div className="detail-tags">{recipe.diets.map(diet => <span className="tag" key={diet}>{diet}</span>)}</div><dl className="recipe-facts"><div><dt><Icon name="clock" size={16} /> Total time</dt><dd>{recipe.time} <span>min</span></dd></div><div><dt>Prep / Cook</dt><dd>{recipe.prep} / {recipe.cook} <span>min</span></dd></div><div><dt><Icon name="people" size={16} /> Serves</dt><dd>{recipe.servings}</dd></div></dl><button className="button secondary print-button" onClick={() => window.print()}><Icon name="print" size={18} /> Print recipe</button></div><figure className="detail-figure"><RecipeImage recipe={recipe} priority className="detail-image" sizes="(max-width: 899px) 100vw, 50vw" /><figcaption>Serving inspiration · Photo by <a href={credit.sourceUrl} target="_blank" rel="noreferrer">{credit.author}</a></figcaption></figure></section>
    <div className="recipe-method"><section className="ingredients-panel" aria-labelledby="ingredients-heading"><p className="eyebrow">GATHER YOUR INGREDIENTS</p><h2 id="ingredients-heading">What you’ll need</h2><p className="muted small">For {recipe.servings} servings. Check off as you go.</p><ul className="ingredient-list">{recipe.ingredients.map((ingredient, index) => <li key={ingredient}><label><input type="checkbox" checked={Boolean(checked[`${id}-${index}`])} onChange={event => setChecked({ ...checked, [`${id}-${index}`]: event.target.checked })} /><span>{ingredient}</span></label></li>)}</ul><div className="ingredient-note"><strong>Ingredient notes</strong><p>{recipe.allergens.length ? `Includes or may include: ${recipe.allergens.join(', ')}. Always check ingredient labels for your needs.` : 'Check stock and packaged ingredient labels for your needs.'}</p></div></section><section className="instructions-panel" aria-labelledby="method-heading"><p className="eyebrow">LET’S MAKE IT</p><h2 id="method-heading">A few simple steps</h2><ol className="method-list">{recipe.steps.map((step, index) => <li key={step}><span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol><aside className="kitchen-note"><Icon name="leaf" size={26} /><div><h3>A little kitchen wisdom</h3><p>{recipe.tip}</p></div></aside>{recipe.safety && <p className="safety-note">{recipe.safety} <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures" target="_blank" rel="noreferrer">FoodSafety.gov cooking guidance</a></p>}<p className="muted small">Cooking times are estimates. Photographs show serving ideas; your finished dish may look different.</p></section></div>
    {related.length > 0 && <section className="section related-recipes"><div className="section-heading"><div><p className="eyebrow">KEEP THE INSPIRATION GOING</p><h2>Something else you might like</h2></div><Link className="text-link" to="/recipes">All recipes <Icon name="arrow" size={18} /></Link></div><div className="recipe-grid">{related.map(item => <RecipeCard key={item.id} recipe={item} />)}</div></section>}
  </div>;
}
