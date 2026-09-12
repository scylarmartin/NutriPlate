import { Link } from 'react-router-dom';
import credits from '../data/credits.json';
import Icon from './Icon.jsx';
import styles from './RecipeCard.module.css';

export function RecipeImage({ recipe, className, priority = false, sizes = '(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw' }) {
  const image = credits.find(item => item.id === recipe.id);
  const base = `${import.meta.env.BASE_URL}images/${recipe.id}`;
  return <img src={`${base}-960.webp`} srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w`} sizes={sizes} width="960" height="720" alt={image?.alt || recipe.title} className={className} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />;
}
export default function RecipeCard({ recipe }) {
  return <article className={styles.card}><Link className={styles.link} to={`/recipes/${recipe.id}`}><div className={styles.imageWrap}><RecipeImage recipe={recipe} className={styles.image} /><span className={styles.badge}>{recipe.diets.includes('Vegan') ? 'Plant-based' : recipe.diets.includes('Vegetarian') ? 'Vegetarian' : 'Everyday favorite'}</span></div><div className={styles.body}><div className={styles.meta}><span className={styles.meal}>{recipe.meal}</span><Icon name="clock" size={15} /><span>{recipe.time} min</span></div><h3 className={styles.title}>{recipe.title}</h3><p className={styles.subtitle}>{recipe.subtitle}</p></div></Link></article>;
}
