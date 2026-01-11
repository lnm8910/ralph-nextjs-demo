import { test, expect } from '@playwright/test'

test.describe('Notes App', () => {
  test('create and view note', async ({ page }) => {
    // Navigate to home page
    await page.goto('/')

    // Wait for the page to load (notes list or empty state should be visible)
    await expect(page.locator('main')).toBeVisible()

    // Click on the "Take a note..." placeholder to expand the form
    await page.click('text=Take a note...')

    // Fill in the note title - use first() since the form's input appears before the dialog's
    const createForm = page.locator('form').first()
    const titleInput = createForm.locator('input[placeholder="Title"]')
    await expect(titleInput).toBeVisible()
    await titleInput.fill('My Test Note')

    // Fill in the note content
    const contentTextarea = createForm.locator('textarea[placeholder="Take a note..."]')
    await expect(contentTextarea).toBeVisible()
    await contentTextarea.fill('This is the content of my test note')

    // Click the Save button within the form
    await createForm.locator('button:has-text("Save")').click()

    // Wait for the form to collapse (the "Take a note..." placeholder should reappear)
    await expect(page.locator('text=Take a note...')).toBeVisible()

    // Verify the note appears in the grid
    await expect(page.locator('h3:has-text("My Test Note")')).toBeVisible()
    await expect(page.locator('text=This is the content of my test note')).toBeVisible()
  })
})
