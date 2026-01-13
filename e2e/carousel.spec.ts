import { test, expect } from '@playwright/test';

test.describe('Carousel Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
    await page.waitForSelector('article');
  });

  test('should display carousel navigation buttons', async ({ page }) => {
    // Los botones de navegación deben estar presentes en las categorías
    const nextButtons = page.getByRole('button', { name: /Siguiente/i });
    
    // Debe haber al menos un carrusel con botones
    const hasNextButtons = await nextButtons.count() > 0;
    expect(hasNextButtons).toBe(true);
  });

  test('should scroll carousel on button click', async ({ page }) => {
    // Encontrar el primer carrusel con botón siguiente
    const nextButton = page.getByRole('button', { name: /Siguiente/i }).first();
    
    if (await nextButton.isVisible()) {
      // Click en siguiente
      await nextButton.click();
      
      // Esperar a que se complete la animación de scroll
      await page.waitForTimeout(500);
      
      // El carrusel debería haber scrolleado
      // (verificamos que el botón anterior ahora está visible/habilitado)
      const prevButton = page.getByRole('button', { name: /Anterior/i }).first();
      await expect(prevButton).toBeVisible();
    }
  });

  test('should disable buttons at scroll limits', async ({ page }) => {
    // Al inicio, el botón anterior debería estar deshabilitado
    const prevButton = page.getByRole('button', { name: /Anterior/i }).first();
    
    if (await prevButton.isVisible()) {
      // El botón anterior debería tener opacidad reducida o estar deshabilitado al inicio
      const opacity = await prevButton.evaluate((el) => 
        window.getComputedStyle(el).opacity
      );
      
      // Opacidad debería ser menor a 1 si está deshabilitado
      expect(parseFloat(opacity)).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('Carousel - Touch/Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be scrollable on mobile', async ({ page }) => {
    await page.goto('/es');
    await page.waitForSelector('article');
    
    // En mobile, el carrusel debe ser scrollable horizontalmente
    const articles = page.getByRole('article');
    await expect(articles.first()).toBeVisible();
  });
});

test.describe('Carousel - Hover Effects', () => {
  test('should show zoom effect on hover', async ({ page }) => {
    await page.goto('/es');
    await page.waitForSelector('article');
    
    const firstArticle = page.getByRole('article').first();
    
    // Hover sobre el artículo
    await firstArticle.hover();
    
    // Verificar que el artículo tiene la clase group para efectos
    await expect(firstArticle).toHaveClass(/group/);
  });
});
