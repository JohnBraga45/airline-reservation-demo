import { test, expect } from '@playwright/test';

const passenger = 'Teste Playwright';

// Pré-condição: backend em http://localhost:3000

test('fluxo de reserva de voo', async ({ page }) => {
  await page.goto('/');

  // Esperar a tabela carregar voos
  await expect(page.getByText('Sistema de Reserva de Voo')).toBeVisible();
  // Encontrar linha com assentos > 0
  const firstReservar = page.getByRole('button', { name: 'Reservar' }).first();
  await expect(firstReservar).toBeEnabled();

  // Abrir formulário
  await firstReservar.click();
  await page.getByPlaceholder('Nome do passageiro').fill(passenger);
  await page.getByRole('button', { name: 'Confirmar reserva' }).click();

  // Verificar mensagem de sucesso
  await expect(page.getByText('Reserva confirmada!')).toBeVisible();
  await expect(page.getByText(passenger)).toBeVisible();
});