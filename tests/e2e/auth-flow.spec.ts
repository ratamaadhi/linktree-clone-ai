/**
 * E2E tests for authentication flow
 * Note: Most tests are skipped because they require database setup
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication UI', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test from sign-in page
    await page.goto('/sign-in');
  });

  test.describe('Sign In Page', () => {
    test('should display sign-in form', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check for "Sign In" heading (use first() to avoid strict mode violation with button)
      await expect(page.getByText(/Sign In/).first()).toBeVisible({
        timeout: 10000,
      });

      // Check for email input
      await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: 10000 });

      // Check for password input
      await expect(page.getByLabel(/password/i)).toBeVisible({
        timeout: 10000,
      });

      // Check for sign-in button
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible({
        timeout: 10000,
      });

      // Check for sign-up link
      await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible({
        timeout: 10000,
      });

      // Check for forgot password link
      await expect(
        page.getByRole('link', { name: /forgot password/i })
      ).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to sign-up page', async ({ page }) => {
      await page.getByRole('link', { name: /sign up/i }).click();

      await expect(page).toHaveURL(/\/sign-up/);
      // Use first() to avoid strict mode violation (heading and button both say "Create Account")
      await expect(page.getByText(/Create Account/i).first()).toBeVisible({
        timeout: 10000,
      });
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await page.getByRole('link', { name: /forgot password/i }).click();

      await expect(page).toHaveURL(/\/forgot-password/);
      await expect(page.getByText(/Forgot Password/i)).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe('Sign Up Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sign-up');
    });

    test('should display sign-up form', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check for "Create Account" heading (use first() to avoid strict mode violation with button)
      await expect(page.getByText(/Create Account/i).first()).toBeVisible({
        timeout: 10000,
      });

      // Check for name input
      await expect(page.getByLabel(/name/i)).toBeVisible({ timeout: 10000 });

      // Check for email input
      await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: 10000 });

      // Check for password input
      await expect(page.getByLabel(/password/i)).toBeVisible({
        timeout: 10000,
      });

      // Check for create account button
      await expect(
        page.getByRole('button', { name: /create account/i })
      ).toBeVisible({ timeout: 10000 });

      // Check for sign-in link (use first() to avoid strict mode violation - there are two "Sign in" links)
      await expect(
        page.getByRole('link', { name: /sign in/i }).first()
      ).toBeVisible({ timeout: 10000 });
    });

    test('should navigate back to sign-in', async ({ page }) => {
      // Use first() to avoid strict mode violation (there are multiple "Sign in" links)
      await page
        .getByRole('link', { name: /sign in/i })
        .first()
        .click();

      await expect(page).toHaveURL(/\/sign-in/);
    });
  });

  test.describe('Forgot Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/forgot-password');
    });

    test('should display forgot password form', async ({ page }) => {
      // Check for email input
      await expect(page.getByLabel(/email/i)).toBeVisible();

      // Check for submit button
      await expect(
        page.getByRole('button', { name: /send reset link/i })
      ).toBeVisible();

      // Check for back to sign-in link
      await expect(
        page.getByRole('link', { name: /back to sign in/i })
      ).toBeVisible();
    });

    test('should navigate back to sign-in', async ({ page }) => {
      await page.getByRole('link', { name: /back to sign in/i }).click();

      await expect(page).toHaveURL(/\/sign-in/);
    });
  });

  test.describe('Reset Password Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/reset-password?token=test-token');
    });

    test('should display reset password form', async ({ page }) => {
      // Check for password input
      await expect(page.getByLabel(/new password/i)).toBeVisible();

      // Check for confirm password input
      await expect(page.getByLabel(/confirm password/i)).toBeVisible();

      // Check for submit button
      await expect(
        page.getByRole('button', { name: /reset password/i })
      ).toBeVisible();
    });
  });
});

// Tests that require database - marked as skip
test.describe('Authentication Flow (Requires Database)', () => {
  test.describe('Sign In', () => {
    test('should redirect to dashboard on successful sign-in', async ({
      page,
    }) => {
      test.skip(true, 'Requires database setup with user table');

      await page.goto('/sign-in');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('testpassword123');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.getByText(/welcome/i)).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      test.skip(true, 'Requires database setup');

      await page.goto('/sign-in');
      await page.getByLabel(/email/i).fill('invalid@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    });
  });

  test.describe('Sign Up', () => {
    test('should create account and redirect to email verification', async ({
      page,
    }) => {
      test.skip(true, 'Requires database setup');

      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;

      await page.goto('/sign-up');
      await page.getByLabel(/name/i).fill('Test User');
      await page.getByLabel(/email/i).fill(email);
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /create account/i }).click();

      await expect(page).toHaveURL(/\/verify-email/);
      await expect(
        page.getByText(/check your email for a verification link/i)
      ).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users to sign-in', async ({
      page,
    }) => {
      test.skip(true, 'Requires database setup');

      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test('should sign out user and redirect to sign-in', async ({ page }) => {
      test.skip(true, 'Requires database setup');

      await page.goto('/sign-in');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('testpassword123');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

      await page.getByRole('button', { name: /sign out/i }).click();

      await expect(page).toHaveURL(/\/sign-in/);

      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/sign-in/);
    });
  });
});
