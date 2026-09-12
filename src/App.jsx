import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Icon from './components/Icon.jsx';
import Home from './pages/Home.jsx';
import Recipes from './pages/Recipes.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import MealPlans from './pages/MealPlans.jsx';
import Nutrition from './pages/Nutrition.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

const navigation = [['/', 'Home'], ['/recipes', 'Recipes'], ['/meal-plans', 'Meal plans'], ['/nutrition', 'Nutrition basics'], ['/contact', 'Contact']];

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    setMenuOpen(false);
    const navigated = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    if (navigated) window.scrollTo?.(0, 0);
    const heading = document.querySelector('main h1');
    if (heading) { document.title = `${heading.textContent} | NutriPlate`; if (navigated) heading.focus({ preventScroll: true }); }
  }, [location.pathname]);
  return <>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content').focus(); }}>Skip to content</a>
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="NutriPlate home"><span className="brand-mark"><Icon name="leaf" size={25} /></span>nutriplate<span className="brand-dot">.</span></Link>
        <button className="menu-toggle icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        <nav id="primary-navigation" aria-label="Main navigation" className={menuOpen ? 'navigation navigation-open' : 'navigation'} onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector('.menu-toggle').focus(); } }}>
          {navigation.map(([path, label]) => <NavLink key={path} end={path === '/'} to={path}>{label}</NavLink>)}
        </nav>
        <Link className="header-cta" to="/recipes">Find a recipe <Icon name="arrow" size={17} /></Link>
      </div>
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="container footer-top"><div><Link to="/" className="brand"><Icon name="leaf" size={25} />nutriplate.</Link><p>A little inspiration for your everyday plate.</p></div><div className="footer-links"><Link to="/recipes">Recipes</Link><Link to="/meal-plans">Meal plans</Link><Link to="/contact">Get in touch</Link><a href={`${import.meta.env.BASE_URL}recipes.html`}>Text-only recipes</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} NutriPlate</span><span>Simple ingredients. A little more possibility.</span></div></footer>
  </>;
}

export { Layout };
export default function App() { return <Layout><Routes><Route path="/" element={<Home />} /><Route path="/recipes" element={<Recipes />} /><Route path="/recipes/:id" element={<RecipeDetail />} /><Route path="/meal-plans" element={<MealPlans />} /><Route path="/nutrition" element={<Nutrition />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></Layout>; }
