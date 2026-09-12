import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import RecipeCard, { RecipeImage } from '../components/RecipeCard.jsx';
import { recipes, getRecipe } from '../data/recipes.js';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  return <div className="container">
    <section className="home-hero">
      <div className="hero-copy"><p className="eyebrow"><span /> A FRESH TAKE ON EVERYDAY COOKING</p><h1 tabIndex={-1}>Good food.<br /><em>Less guesswork.</em></h1><p className="hero-description">Real ingredients. Simple recipes. Find something delicious that fits your day.</p><form className="hero-search" role="search" onSubmit={e => { e.preventDefault(); navigate(`/recipes${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`); }}><label className="sr-only" htmlFor="home-search">Search recipes or ingredients</label><Icon name="search" /><input id="home-search" placeholder="What are you in the mood for?" value={query} onChange={e => setQuery(e.target.value)} /><button type="submit" aria-label="Search recipes"><Icon name="arrow" /></button></form><div className="quick-filters"><span>A little inspiration:</span><Link to="/recipes?time=30">30 minutes or less</Link><Link to="/recipes?diet=Vegetarian">Vegetarian</Link></div></div>
      <div className="hero-visual"><Link to="/recipes/harvest-salad"><RecipeImage recipe={getRecipe('harvest-salad')} className="hero-photo" priority sizes="(max-width: 599px) 100vw, 50vw" /><div className="hero-label"><span className="hero-label-icon"><Icon name="leaf" /></span><div><span>ON THE MENU TODAY</span><strong>Chickpea harvest bowl</strong><small>30 min · Plant-based</small></div><Icon name="arrow" size={18} /></div></Link><span className="hero-caption">Make room for something good.</span></div>
    </section>
    <section className="section featured-section"><div className="section-heading"><div><p className="eyebrow">FROM OUR RECIPE COLLECTION</p><h2>Your next favorite meal</h2></div><Link className="text-link" to="/recipes">Explore all recipes <Icon name="arrow" size={18} /></Link></div><div className="recipe-grid">{recipes.filter(recipe => recipe.featured).map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div></section>
    <section className="browse-section"><div><p className="eyebrow">WHAT FITS YOUR DAY?</p><h2>A good place to start.</h2></div><div className="category-links"><Link to="/recipes?meal=Breakfast"><Icon name="sun" size={30} /><span>Easy mornings<small>Breakfast ideas</small></span><Icon name="arrow" /></Link><Link to="/recipes?time=30"><Icon name="clock" size={30} /><span>Short on time<small>30 minutes or less</small></span><Icon name="arrow" /></Link><Link to="/recipes?diet=Vegetarian"><Icon name="leaf" size={30} /><span>More plants, please<small>Vegetarian favorites</small></span><Icon name="arrow" /></Link></div></section>
    <section className="meal-promo"><div className="promo-image"><RecipeImage recipe={getRecipe('tomato-basil-pasta')} sizes="(max-width: 599px) 100vw, 40vw" /></div><div className="promo-copy"><p className="eyebrow">A LITTLE PLANNING GOES A LONG WAY</p><h2>Less “what’s for dinner?”<br />More time for you.</h2><p>A few familiar ingredients, a few fresh ideas. Our simple meal plans help bring your week together.</p><Link className="button primary" to="/meal-plans">Find your rhythm <Icon name="arrow" size={18} /></Link></div></section>
  </div>;
}
