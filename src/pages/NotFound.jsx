import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
export default function NotFound() { return <div className="container empty-state not-found"><p className="eyebrow">A LITTLE DETOUR</p><h1 tabIndex={-1}>This page isn’t on the menu.</h1><p>The link may have changed. Let’s find you something good.</p><Link to="/recipes" className="button primary">Explore the recipes <Icon name="arrow" size={18} /></Link></div>; }
