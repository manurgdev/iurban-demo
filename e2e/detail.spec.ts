import { test, expect } from '@playwright/test';

test.describe('Detail Page', () => {
  test('should display point details', async ({ page }) => {
    // Ir a la home y navegar a un punto
    await page.goto('/es');
    await page.waitForSelector('article');
    
    // Click en el primer punto
    const firstPoint = page.getByRole('article').first().getByRole('link');
    await firstPoint.click();
    
    // Verificar elementos de la página de detalle
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /Volver al inicio/i })).toBeVisible();
  });

  test('should have back to home link that works', async ({ page }) => {
    await page.goto('/es');
    await page.waitForSelector('article');
    
    // Navegar a detalle
    await page.getByRole('article').first().getByRole('link').click();
    
    // Esperar a que cargue el detalle
    await page.waitForURL(/\/(point|event)\/\d+\//);
    
    // Click en volver
    await page.getByRole('link', { name: /Volver al inicio/i }).click();
    
    // Esperar navegación y verificar que volvemos a home
    await page.waitForURL('/es', { timeout: 10000 });
    await expect(page).toHaveURL('/es');
  });

  test('should change language on detail page', async ({ page }) => {
    await page.goto('/es');
    await page.waitForSelector('article');
    
    // Navegar a detalle
    await page.getByRole('article').first().getByRole('link').click();
    await page.waitForURL(/\/(point|event)\/\d+\//);
    
    // Cambiar idioma
    await page.getByRole('button', { name: /Español.*Selector de idioma/i }).click();
    await page.getByRole('option', { name: 'English' }).click();
    
    // Verificar que la UI cambió
    await expect(page.getByRole('link', { name: /Back to home/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible();
  });

  test('should display gallery when available', async ({ page }) => {
    await page.goto('/es');
    await page.waitForSelector('article');
    
    // Navegar a detalle
    await page.getByRole('article').first().getByRole('link').click();
    await page.waitForURL(/\/(point|event)\/\d+\//, { timeout: 10000 });
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // La galería debe existir (si hay imágenes)
    const gallery = page.getByRole('region', { name: /Galería/i }).first();
    // No todos los puntos tienen galería, así que verificamos si existe
    const hasGallery = await gallery.count() > 0;
    
    if (hasGallery) {
      await expect(gallery).toBeVisible();
    }
  });
});

test.describe('Detail Page - SEO', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('/es');
    await page.waitForSelector('article');
    
    // Navegar a detalle
    await page.getByRole('article').first().getByRole('link').click();
    await page.waitForURL(/\/(point|event)\/\d+\//);
    
    // El título debe incluir el nombre del punto y "Madrid Turismo"
    await expect(page).toHaveTitle(/.*\| Madrid Turismo/);
  });
});
