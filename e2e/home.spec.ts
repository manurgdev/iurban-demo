import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
  });

  test('should display the hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByPlaceholder('¿Dónde quieres viajar?')).toBeVisible();
  });

  test('should display points of interest section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Puntos de Interés' })).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: 'Inicio' });
    await expect(homeLink).toBeVisible();
  });

  test('should display category sections', async ({ page }) => {
    // Esperar a que cargue el contenido
    await page.waitForSelector('article');
    
    // Debe haber tarjetas de puntos
    const articles = page.getByRole('article');
    await expect(articles.first()).toBeVisible();
  });

  test('should navigate to detail page when clicking a point', async ({ page }) => {
    // Esperar a que cargue el contenido
    await page.waitForSelector('article');
    
    // Click en el primer punto de interés
    const firstPoint = page.getByRole('article').first().getByRole('link');
    await firstPoint.click();
    
    // Verificar que navegamos a una página de detalle
    await expect(page).toHaveURL(/\/(point|event)\/\d+\//);
  });
});

test.describe('Language Switching', () => {
  test('should switch from Spanish to English', async ({ page }) => {
    await page.goto('/es');
    
    // Abrir selector de idioma
    await page.getByRole('button', { name: /Español.*Selector de idioma/i }).click();
    
    // Seleccionar inglés
    await page.getByRole('option', { name: 'English' }).click();
    
    // Verificar que la UI cambió a inglés
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByPlaceholder('Where do you want to travel?')).toBeVisible();
  });

  test('should switch from English to Spanish', async ({ page }) => {
    await page.goto('/en');
    
    // Abrir selector de idioma
    await page.getByRole('button', { name: /English.*Language selector/i }).click();
    
    // Seleccionar español
    await page.getByRole('option', { name: 'Español' }).click();
    
    // Verificar que la UI cambió a español
    await expect(page.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(page.getByPlaceholder('¿Dónde quieres viajar?')).toBeVisible();
  });

  test('should update page title on language change', async ({ page }) => {
    await page.goto('/es');
    
    // Verificar título inicial en español
    await expect(page).toHaveTitle(/Madrid Turismo/);
    
    // Cambiar a inglés
    await page.getByRole('button', { name: /Español.*Selector de idioma/i }).click();
    await page.getByRole('option', { name: 'English' }).click();
    
    // Verificar título en inglés
    await expect(page).toHaveTitle(/Madrid Tourism/);
  });
});

test.describe('Accessibility', () => {
  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/es');
    
    const skipLink = page.getByRole('link', { name: 'Saltar al contenido principal' });
    await expect(skipLink).toBeAttached();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/es');
    
    // Debe haber un h1
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Debe haber h2s para las secciones
    const h2s = page.getByRole('heading', { level: 2 });
    await expect(h2s.first()).toBeVisible();
  });
});
