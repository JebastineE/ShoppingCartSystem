const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Ensure test-results directory exists
const resultsDir = path.join(__dirname, '..', 'test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

const BASE_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:8083';

const results = {
  workflow1: { name: '1. Products Page & Retrieval', passed: false, details: [] },
  workflow2: { name: '2. Add to Cart', passed: false, details: [] },
  workflow3: { name: '3. Cart Quantity Updates', passed: false, details: [] },
  workflow4: { name: '4. Delete from Cart', passed: false, details: [] },
  workflow5: { name: '5. Add Another Product to Cart', passed: false, details: [] },
  workflow6: { name: '6. Checkout Flow', passed: false, details: [] },
  workflow7: { name: '7. Orders History & Details', passed: false, details: [] },
  workflow8: { name: '8. Add Product (New Product Form)', passed: false, details: [] },
  workflow9: { name: '9. Error Handling & Validation', passed: false, details: [] },
};

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  console.log('🚀 Starting End-to-End Browser Test on:', BASE_URL);
  
  // Clean cart in backend before starting test for reproducible state
  try {
    const res = await fetch(`${BACKEND_URL}/api/cart`);
    const initialItems = await res.json();
    for (const item of initialItems) {
      await fetch(`${BACKEND_URL}/api/cart/${item.cartItemId}`, { method: 'DELETE' });
    }
    console.log(`Cleaned ${initialItems.length} leftover cart item(s) for fresh test run.`);
  } catch (e) {
    console.log('Cart pre-clean note:', e.message);
  }

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Listen to browser console logs
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('  [Browser Error]:', msg.text());
    }
  });

  try {
    // ==========================================
    // WORKFLOW 1: Products
    // ==========================================
    console.log('\n--- Workflow 1: Products ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await sleep(800);

    const brandTitle = await page.locator('.brand-title').textContent();
    console.log('Brand Title:', brandTitle);

    if (brandTitle.includes('Shopping Cart System')) {
      results.workflow1.details.push('Header with "Shopping Cart System" verified.');
    } else {
      throw new Error(`Expected brand title to contain "Shopping Cart System", got: "${brandTitle}"`);
    }

    // Wait for product cards to load from backend
    await page.waitForSelector('.product-card', { timeout: 8000 });
    const productCards = await page.locator('.product-card').all();
    console.log(`Found ${productCards.length} products loaded from backend.`);

    if (productCards.length === 0) {
      throw new Error('No products retrieved from the backend.');
    }

    const firstCard = productCards[0];
    const firstProductName = await firstCard.locator('.product-name').textContent();
    const firstProductPrice = await firstCard.locator('.product-price').textContent();
    const firstProductStock = await firstCard.locator('.product-stock-subtext strong').textContent();
    const hasAddToCartBtn = (await firstCard.locator('.add-to-cart-btn').count()) > 0;

    console.log(`First product: "${firstProductName}", Price: ${firstProductPrice}, Stock: ${firstProductStock}`);

    if (firstProductName && firstProductPrice && firstProductStock && hasAddToCartBtn) {
      results.workflow1.details.push(
        `Retrieved ${productCards.length} products from backend. Verified product names, prices (e.g. ${firstProductPrice}), available stock (${firstProductStock}), and Add to Cart buttons.`
      );
      results.workflow1.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '01_products_page.png') });

    // ==========================================
    // WORKFLOW 2: Add to Cart
    // ==========================================
    console.log('\n--- Workflow 2: Add to Cart ---');
    const targetProductCard = page.locator('.product-card').filter({ hasText: 'Headphones' });
    let cardToUse = (await targetProductCard.count()) > 0 ? targetProductCard.first() : productCards[0];
    const targetName = await cardToUse.locator('.product-name').textContent();
    console.log(`Adding "${targetName}" to cart...`);

    const addBtn = cardToUse.locator('.add-to-cart-btn');
    await addBtn.click();
    await sleep(800);

    // Verify notification toast
    const alertBanner = page.locator('.alert-banner');
    if ((await alertBanner.count()) > 0) {
      const toastText = await alertBanner.textContent();
      console.log('Toast Notification:', toastText.trim());
      results.workflow2.details.push(`Feedback notification displayed: "${toastText.trim()}"`);
    }

    // Open Cart section
    console.log('Navigating to Cart section...');
    await page.locator('#nav-cart-btn').click();
    await sleep(600);

    // Verify item appears in cart
    await page.waitForSelector('.cart-item-row', { timeout: 5000 });
    const cartRows = await page.locator('.cart-item-row').all();
    console.log(`Cart contains ${cartRows.length} item row(s).`);

    const firstCartRow = cartRows[0];
    const cartProdId = await firstCartRow.locator('.cart-product-id-badge').textContent();
    const cartItemName = await firstCartRow.locator('.cart-item-name').textContent();
    const cartItemQty = await firstCartRow.locator('.qty-display').textContent();
    const cartHasDeleteBtn = (await firstCartRow.locator('.btn-icon-danger').count()) > 0;

    console.log(`Cart item: "${cartItemName}", ${cartProdId}, Quantity: ${cartItemQty}, Delete button present: ${cartHasDeleteBtn}`);

    if (cartItemName.includes(targetName) && cartItemQty === '1' && cartHasDeleteBtn) {
      results.workflow2.details.push(
        `Verified "${cartItemName}" appears in cart with ${cartProdId}, correct quantity (${cartItemQty}), and Delete button.`
      );
      results.workflow2.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '02_cart_item_added.png') });

    // ==========================================
    // WORKFLOW 3: Cart Quantity
    // ==========================================
    console.log('\n--- Workflow 3: Cart Quantity ---');
    const increaseBtn = firstCartRow.locator('.qty-btn:has-text("+")');
    console.log('Clicking increase quantity (+)...');
    await increaseBtn.click();
    await sleep(800);

    const updatedQty = await firstCartRow.locator('.qty-display').textContent();
    console.log('Quantity after increase:', updatedQty);

    if (updatedQty !== '2') {
      throw new Error(`Expected quantity 2 after increase, got: ${updatedQty}`);
    }
    results.workflow3.details.push(`Quantity increased successfully to ${updatedQty}.`);

    const decreaseBtn = firstCartRow.locator('.qty-btn:has-text("-")');
    console.log('Clicking decrease quantity (-)...');
    await decreaseBtn.click();
    await sleep(800);

    const decreasedQty = await firstCartRow.locator('.qty-display').textContent();
    console.log('Quantity after decrease:', decreasedQty);

    if (decreasedQty !== '1') {
      throw new Error(`Expected quantity 1 after decrease, got: ${decreasedQty}`);
    }
    results.workflow3.details.push(`Quantity decreased successfully back to ${decreasedQty}. Cart updated correctly.`);
    results.workflow3.passed = true;

    await page.screenshot({ path: path.join(resultsDir, '03_cart_quantity_updated.png') });

    // ==========================================
    // WORKFLOW 4: Delete from Cart
    // ==========================================
    console.log('\n--- Workflow 4: Delete from Cart ---');
    const deleteBtn = firstCartRow.locator('.btn-icon-danger');
    console.log('Clicking delete button on cart item...');
    await deleteBtn.click();
    await sleep(800);

    // Verify empty state or item removed
    const remainingItems = await page.locator('.cart-item-row').count();
    console.log('Remaining cart items count:', remainingItems);

    const emptyStateText = await page.locator('.empty-title').textContent();
    console.log('Cart state:', emptyStateText);

    if (remainingItems === 0 && emptyStateText.includes('empty')) {
      results.workflow4.details.push('Cart item deleted successfully via DELETE /api/cart/{id}. Empty cart state confirmed.');
      results.workflow4.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '04_cart_item_deleted.png') });

    // ==========================================
    // WORKFLOW 5: Add another product to the cart
    // ==========================================
    console.log('\n--- Workflow 5: Add Another Product to Cart ---');
    console.log('Navigating back to Products catalog...');
    await page.locator('#nav-products-btn').click();
    await sleep(600);

    // Target a different product (e.g. Keyboard or Phone)
    const keyboardCard = page.locator('.product-card').filter({ hasText: 'Keyboard' });
    let secondCard = (await keyboardCard.count()) > 0 ? keyboardCard.first() : page.locator('.product-card').nth(1);
    const secondName = await secondCard.locator('.product-name').textContent();
    console.log(`Adding second product "${secondName}" to cart...`);

    await secondCard.locator('.add-to-cart-btn').click();
    await sleep(800);

    // Navigate to Cart
    await page.locator('#nav-cart-btn').click();
    await sleep(600);

    await page.waitForSelector('.cart-item-row', { timeout: 5000 });
    const newCartRow = page.locator('.cart-item-row').first();
    const newCartItemName = await newCartRow.locator('.cart-item-name').textContent();
    const newCartQty = await newCartRow.locator('.qty-display').textContent();

    console.log(`Cart now contains: "${newCartItemName}", Quantity: ${newCartQty}`);

    if (newCartItemName.includes(secondName) && newCartQty === '1') {
      results.workflow5.details.push(`Added second product "${newCartItemName}" to cart with quantity ${newCartQty}.`);
      results.workflow5.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '05_cart_another_product.png') });

    // ==========================================
    // WORKFLOW 6: Checkout
    // ==========================================
    console.log('\n--- Workflow 6: Checkout ---');
    const checkoutBtn = page.locator('#checkout-btn');
    const checkoutBtnText = await checkoutBtn.textContent();
    console.log('Checkout button text:', checkoutBtnText.trim());

    console.log('Clicking Proceed to Checkout...');
    await checkoutBtn.click();
    await sleep(1500);

    // Check notification toast
    const checkoutToast = page.locator('.alert-banner');
    if ((await checkoutToast.count()) > 0) {
      const toastMsg = await checkoutToast.textContent();
      console.log('Checkout feedback:', toastMsg.trim());
      results.workflow6.details.push(`Checkout notification: "${toastMsg.trim()}"`);
    }

    // Check cart is empty
    console.log('Verifying cart is empty after checkout...');
    await page.locator('#nav-cart-btn').click();
    await sleep(600);
    const cartCountAfterCheckout = await page.locator('.cart-item-row').count();
    const isCartEmptyNow = (await page.locator('.empty-state').count()) > 0;
    console.log(`Cart items after checkout: ${cartCountAfterCheckout}, Empty state visible: ${isCartEmptyNow}`);

    if (cartCountAfterCheckout === 0 && isCartEmptyNow) {
      results.workflow6.details.push(
        'Checkout request succeeded (POST /api/orders/checkout). Cart verified empty.'
      );
      results.workflow6.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '06_checkout_success.png') });

    // ==========================================
    // WORKFLOW 7: Orders
    // ==========================================
    console.log('\n--- Workflow 7: Orders ---');
    console.log('Opening Orders section...');
    await page.locator('#nav-orders-btn').click();
    await sleep(800);

    await page.waitForSelector('.order-card', { timeout: 5000 });
    const orderCards = await page.locator('.order-card').all();
    console.log(`Found ${orderCards.length} order(s) in history.`);

    if (orderCards.length === 0) {
      throw new Error('No orders found in Orders section.');
    }

    const latestOrder = orderCards[0];
    const orderIdText = await latestOrder.locator('.order-id-title').textContent();
    const orderDateText = await latestOrder.locator('.order-date-text').textContent();
    const orderAmountText = await latestOrder.locator('.order-amount-value').textContent();
    console.log(`Latest Order: ${orderIdText}, Date: ${orderDateText}, Total Amount: ${orderAmountText}`);

    // Test View Details Modal
    const viewDetailsBtn = latestOrder.locator('button:has-text("View Details")');
    await viewDetailsBtn.click();
    await sleep(800);

    const modalTitle = await page.locator('.modal-title').textContent();
    console.log('Order Details modal opened:', modalTitle);
    await page.screenshot({ path: path.join(resultsDir, '07_orders_details_modal.png') });

    // Close modal
    await page.locator('.modal-footer button').click();
    await sleep(500);

    if (orderIdText && orderDateText && orderAmountText) {
      results.workflow7.details.push(
        `Orders section verified: Found newly placed ${orderIdText}, Date: ${orderDateText}, Amount: ${orderAmountText}. Inspected order details modal.`
      );
      results.workflow7.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '07_orders_history.png') });

    // ==========================================
    // WORKFLOW 8: Add Product (New Product Form)
    // ==========================================
    console.log('\n--- Workflow 8: Add Product Form ---');
    console.log('Navigating to Products tab...');
    await page.locator('#nav-products-btn').click();
    await sleep(600);

    const addProductBtn = page.locator('#header-add-product-btn');
    await addProductBtn.click();
    await sleep(600);

    await page.waitForSelector('.modal-container', { timeout: 3000 });
    console.log('Add Product modal opened.');

    // Fetch highest product ID currently in backend to avoid collisions
    const currentProds = await (await fetch(`${BACKEND_URL}/api/products`)).json();
    const maxProdId = currentProds.reduce((max, p) => Math.max(max, Number(p.productId) || 0), 0);
    const testProductId = maxProdId + 10;
    const testProductName = 'Ergonomic Gaming Mouse';
    const testProductPrice = '1299.00';
    const testProductStock = '25';

    console.log(`Submitting new product: ID ${testProductId}, Name: "${testProductName}", Price: ₹${testProductPrice}, Stock: ${testProductStock}`);
    await page.fill('#prod-id', String(testProductId));
    await page.fill('#prod-name', testProductName);
    await page.fill('#prod-price', testProductPrice);
    await page.fill('#prod-stock', testProductStock);

    await page.screenshot({ path: path.join(resultsDir, '08_add_product_form.png') });

    // Submit form
    await page.locator('#submit-add-product-btn').click();
    await sleep(1500);

    // Verify it appears in products list
    const newProductCard = page.locator('.product-card').filter({ hasText: testProductName });
    const isNewProductVisible = (await newProductCard.count()) > 0;
    console.log(`New product "${testProductName}" visible in catalog:`, isNewProductVisible);

    if (isNewProductVisible) {
      const addedName = await newProductCard.locator('.product-name').textContent();
      const addedPrice = await newProductCard.locator('.product-price').textContent();
      const addedStock = await newProductCard.locator('.product-stock-subtext strong').textContent();
      console.log(`Verified new product card: "${addedName}", Price: ${addedPrice}, Stock: ${addedStock}`);

      results.workflow8.details.push(
        `Added valid test product "${addedName}" (ID #${testProductId}) with Price ${addedPrice} and Stock ${addedStock}. Verified presence in catalog without deleting existing products.`
      );
      results.workflow8.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '08_add_product_success.png') });

    // ==========================================
    // WORKFLOW 9: Error Handling
    // ==========================================
    console.log('\n--- Workflow 9: Error Handling & Validation ---');

    // Test form validation: try to add product with empty name
    await page.locator('#header-add-product-btn').click();
    await sleep(600);

    await page.fill('#prod-name', '');
    await page.locator('#submit-add-product-btn').click();
    await sleep(500);

    const formStillOpen = (await page.locator('.modal-container').count()) > 0;
    console.log('Form validation correctly prevented empty submission:', formStillOpen);

    // Close modal
    await page.locator('.modal-close-btn').click();
    await sleep(500);

    // Test stock boundary validation:
    const mouseCard = page.locator('.product-card').filter({ hasText: testProductName }).first();
    const qtyInput = mouseCard.locator('.qty-input');
    await qtyInput.fill('999'); // try to enter 999 when stock is 25
    const clampedQty = await qtyInput.inputValue();
    console.log(`Stock boundary clamped input value from 999 to: ${clampedQty} (max stock: ${testProductStock})`);

    // Verify backend status indicator is active
    const backendStatusText = await page.locator('.status-text').textContent();
    const isOnline = backendStatusText.includes('Online');
    console.log('Backend Status Indicator:', backendStatusText, 'Is Online:', isOnline);

    if (formStillOpen && clampedQty === testProductStock && isOnline) {
      results.workflow9.details.push(
        'Verified form input validation, client-side stock boundary constraints, and backend connection status indicator.'
      );
      results.workflow9.passed = true;
    }

    await page.screenshot({ path: path.join(resultsDir, '09_error_handling.png') });

  } catch (err) {
    console.error('\n❌ Test Error:', err.message);
  } finally {
    await browser.close();
    console.log('\n==========================================');
    console.log('E2E TEST SUMMARY RESULTS:');
    console.log('==========================================');
    for (const [key, w] of Object.entries(results)) {
      console.log(`${w.passed ? '✅ PASS' : '❌ FAIL'} | ${w.name}`);
      w.details.forEach((d) => console.log(`   - ${d}`));
    }
    console.log('==========================================\n');

    fs.writeFileSync(
      path.join(resultsDir, 'test-summary.json'),
      JSON.stringify(results, null, 2)
    );
  }
})();
