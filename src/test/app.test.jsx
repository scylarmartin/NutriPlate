import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import { recipes, mealPlanDays, getRecipe } from '../data/recipes.js';
import { filterRecipes } from '../lib/filters.js';

function renderPage(path = '/recipes') { return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }

describe('Recipe discovery', () => {
  it('renders the complete collection with accessible recipe links', () => {
    renderPage();
    expect(screen.getByRole('status')).toHaveTextContent('12 recipes');
    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(screen.getByRole('link', { name: /Chickpea harvest bowl/ })).toHaveAttribute('href', '/recipes/harvest-salad');
  });
  it('waits 300ms before filtering a typed query', () => {
    vi.useFakeTimers(); renderPage();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'quinoa' } });
    act(() => vi.advanceTimersByTime(299));
    expect(screen.getByRole('status')).toHaveTextContent('12 recipes');
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('status')).toHaveTextContent('1 recipe');
    expect(screen.getByRole('link', { name: /Lemon salmon & quinoa/ })).toBeVisible();
  });
  it('combines time and diet filters from a shareable URL', () => {
    renderPage('/recipes?time=15&diet=Vegan');
    expect(screen.getByRole('status')).toHaveTextContent('2 recipes');
    expect(screen.getByLabelText('Ready in')).toHaveValue('15');
    expect(screen.getByLabelText('Dietary preference')).toHaveValue('Vegan');
  });
  it('shows an empty state and restores the full collection', async () => {
    const user = userEvent.setup(); renderPage('/recipes?diet=Vegan&protein=Chicken');
    expect(screen.getByRole('heading', { name: 'No recipes just yet.' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /Show all recipes/ }));
    expect(screen.getByRole('status')).toHaveTextContent('12 recipes');
    expect(screen.getByLabelText('Dietary preference')).toHaveValue('');
  });
  it('filters ingredients case-insensitively and sorts without mutating source data', () => {
    const order = recipes.map(recipe => recipe.id);
    expect(filterRecipes(recipes, { q: 'TAHINI lemon' }).map(recipe => recipe.id)).toEqual(['harvest-salad']);
    expect(filterRecipes(recipes, { sort: 'quickest' })[0].id).toBe('yogurt-fruit');
    expect(recipes.map(recipe => recipe.id)).toEqual(order);
  });
});

describe('Details, plans, and navigation', () => {
  it('opens a complete recipe and lets a cook check an ingredient', async () => {
    const user = userEvent.setup(); renderPage('/recipes/harvest-salad');
    expect(screen.getByRole('heading', { name: 'Chickpea harvest bowl', level: 1 })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'A few simple steps' })).toBeVisible();
    const ingredient = screen.getByRole('checkbox', { name: '1 tbsp olive oil' });
    await user.click(ingredient); expect(ingredient).toBeChecked();
  });
  it('handles a missing recipe with a useful recovery link', () => {
    renderPage('/recipes/does-not-exist');
    expect(screen.getByRole('heading', { name: 'This page isn’t on the menu.' })).toBeVisible();
    expect(screen.getByRole('link', { name: /Explore the recipes/ })).toHaveAttribute('href', '/recipes');
  });
  it('switches a meal plan from three to seven days using native radios', async () => {
    const user = userEvent.setup(); renderPage('/meal-plans');
    expect(screen.getByRole('status')).toHaveTextContent('3 days');
    await user.click(screen.getByRole('radio', { name: '7-day plan' }));
    expect(screen.getByRole('status')).toHaveTextContent('7 days');
    expect(screen.getByRole('heading', { name: 'Sunday' })).toBeVisible();
    for (const day of mealPlanDays) for (const meal of ['breakfast', 'lunch', 'dinner']) expect(getRecipe(day[meal])).toBeDefined();
  });
});

describe('Accessible local form', () => {
  it('describes errors and associates them with invalid fields', async () => {
    const user = userEvent.setup(); renderPage('/contact');
    await user.click(screen.getByRole('button', { name: /Check message/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Please check your details.');
    expect(screen.getByLabelText('Your name *')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Email address *')).toHaveAttribute('aria-describedby', 'email-error');
  });
  it('validates a message while clearly saying nothing was sent', async () => {
    const user = userEvent.setup(); renderPage('/contact');
    await user.type(screen.getByLabelText('Your name *'), 'Alex Cook');
    await user.type(screen.getByLabelText('Email address *'), 'alex@example.com');
    await user.type(screen.getByLabelText('Your message *'), 'I would love more quick lunch recipes.');
    await user.click(screen.getByRole('button', { name: /Check message/ }));
    expect(screen.getByRole('status')).toHaveTextContent('has not sent or saved your message');
    await user.click(screen.getByRole('button', { name: /Try another message/ }));
    expect(screen.getByLabelText('Your name *')).toHaveValue('');
  });
});
