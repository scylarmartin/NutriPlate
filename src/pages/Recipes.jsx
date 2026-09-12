import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { recipes } from '../data/recipes.js';
import { filterOptions, filterRecipes, readFilters } from '../lib/filters.js';
import Icon from '../components/Icon.jsx';
import RecipeCard from '../components/RecipeCard.jsx';

export default function Recipes() {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);
  const [query, setQuery] = useState(filters.q);
  const timer = useRef();
  const results = filterRecipes(recipes, filters);
  useEffect(() => { setQuery(filters.q); return () => clearTimeout(timer.current); }, [filters.q]);
  useEffect(() => () => clearTimeout(timer.current), []);
  function changeFilter(key, value, replace = false) {
    setParams(previous => { const next = new URLSearchParams(previous); value ? next.set(key, value) : next.delete(key); return next; }, { replace });
  }
  function changeQuery(value) {
    setQuery(value); clearTimeout(timer.current);
    timer.current = setTimeout(() => changeFilter('q', value.trim(), true), 300);
  }
  function clearAll() { clearTimeout(timer.current); setQuery(''); setParams({}); }
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(context.registerTool({
        name: 'filter_nutriplate_recipes', title: 'Filter NutriPlate recipes',
        description: 'Set the visible recipe search and filters, replacing previous filters, and return matching recipes.',
        inputSchema: { type: 'object', properties: { q: { type: 'string', maxLength: 150 }, ...Object.fromEntries(Object.entries(filterOptions).map(([key, values]) => [key, { type: 'string', enum: ['', ...values] }])) }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a filter object.');
          for (const [key, value] of Object.entries(input)) {
            if (typeof value !== 'string' || (key === 'q' ? value.length > 150 : !filterOptions[key] || (value !== '' && !filterOptions[key].includes(value)))) throw new Error(`Invalid filter: ${key}`);
          }
          clearTimeout(timer.current);
          flushSync(() => { setQuery(input.q || ''); setParams(Object.fromEntries(Object.entries(input).filter(([, value]) => value))); });
          return { count: filterRecipes(recipes, input).length, recipes: filterRecipes(recipes, input).map(({ id, title, time }) => ({ id, title, minutes: time })) };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* The visual controls remain the primary interface. */ }
    return () => lifecycle.abort();
  }, [setParams]);
  const activeFilters = Object.entries(filters).filter(([key, value]) => value && key !== 'sort' && key !== 'q');
  return <div className="container page-content">
    <header className="page-heading"><p className="eyebrow">THE RECIPE COLLECTION</p><h1 tabIndex={-1}>Something good is cooking.</h1><p>Find a meal for your time, your taste, and what’s in your kitchen.</p></header>
    <div className="recipe-toolbar"><form className="library-search" role="search" onSubmit={e => { e.preventDefault(); clearTimeout(timer.current); changeFilter('q', query.trim()); }}><Icon name="search" /><label className="sr-only" htmlFor="recipe-search">Search recipes or ingredients</label><input id="recipe-search" type="search" maxLength={150} placeholder="Search recipes or ingredients…" value={query} onChange={e => changeQuery(e.target.value)} /><button className="search-submit" type="submit">Search</button></form><label className="sort-control">Sort by<select aria-label="Sort recipes" value={filters.sort} onChange={e => changeFilter('sort', e.target.value)}><option value="featured">Our collection</option><option value="quickest">Quickest first</option><option value="name">Recipe name A–Z</option></select></label></div>
    <div className="library-layout"><aside className="filter-panel" aria-label="Recipe filters"><div className="filter-title"><h2>Make it your own</h2><button type="button" className="plain-button" onClick={clearAll}>Reset all</button></div><p className="filter-help">A few choices to find your next meal.</p>
      {[['meal', 'Meal type', 'All meals'], ['time', 'Ready in', 'Any time'], ['diet', 'Dietary preference', 'All preferences'], ['protein', 'Protein source', 'All sources']].map(([key, label, all]) => <label className="filter-field" key={key} htmlFor={`filter-${key}`}>{label}<select id={`filter-${key}`} value={filters[key]} onChange={e => changeFilter(key, e.target.value)}><option value="">{all}</option>{filterOptions[key].map(value => <option key={value} value={value}>{key === 'time' ? `${value} minutes or less` : value}</option>)}</select></label>)}
      <div className="filter-note"><Icon name="leaf" /><p>Good food starts with what works for you.</p></div></aside>
      <section className="library-results" aria-label="Matching recipes"><div className="results-meta"><p role="status" aria-live="polite" aria-atomic="true"><strong>{results.length}</strong> {results.length === 1 ? 'recipe' : 'recipes'}{filters.q && <> for “{filters.q}”</>}</p><span>Made for real life</span></div>{activeFilters.length > 0 && <div className="active-filters">{activeFilters.map(([key, value]) => <button key={key} onClick={() => changeFilter(key, '')} aria-label={`Remove ${key === 'time' ? `${value} minute` : value} filter`}>{key === 'time' ? `≤ ${value} min` : value}<Icon name="close" size={14} /></button>)}</div>}
        {results.length ? <div className="recipe-grid library-grid">{results.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div> : <div className="empty-state"><Icon name="bowl" size={42} /><h2>No recipes just yet.</h2><p>Try another ingredient or loosen a filter. There’s something good in the collection.</p><button className="button primary" onClick={clearAll}>Show all recipes <Icon name="arrow" size={18} /></button></div>}
      </section>
    </div>
  </div>;
}
