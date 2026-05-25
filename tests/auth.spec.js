import { test, expect } from '@playwright/test';

test.describe('لوحة التحكم - اختبارات الصلاحيات وتسجيل الدخول (Vite + JS)', () => {

  // إعداد حجم شاشة قياسي متوافق مع لوحات التحكم لمنع مشاكل رندرة المكتبات الرسومية
  test.use({ viewport: { width: 1280, height: 720 } });


  // 🔑 الاختبار 1: سيناريو تسجيل الدخول عبر الفورم (تعبئة حية وضغط الزر)
  test('يجب على الأدمن تسجيل الدخول بالفورم والانتقال للداشبورد بنجاح', async ({ page }) => {
    // 1. الذهاب إلى صفحة تسجيل الدخول
    await page.goto('/login');

    // 2. تعبئة بيانات الأدمن بناءً على الواجهة العربية الحالية
    const usernameInput = page.locator('input[placeholder*="المستخدم" i], input[type="text"]').first();
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 }); 
    await usernameInput.fill('mariamaaji442@gmail.com');

    const passwordInput = page.locator('input[placeholder*="المرور" i], input[type="password"]').first();
    await passwordInput.fill('Admin@12345!');

    // 3. مراقبة حركة الشبكة (API Response) لانتظار نجاح العملية من السيرفر قبل التحويل
    const apiResponsePromise = page.waitForResponse(
      response => response.status() === 200, 
      { timeout: 10000 }
    ).catch(() => null); // لمنع انهيار التيست إذا كان السيرفر محلي بالكامل أو سريع جداً

    // 4. الضغط على زر تسجيل الدخول
    await page.click('button:has-text("تسجيل دخول")');

    // انتظار استجابة السيرفر لضمان كتابة الكوكي في المتصفح بنجاح
    await apiResponsePromise;

    // 5. الفحص الحاسم للرابط وعناصر الداشبورد الرئيسية
    await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    await expect(page).toHaveURL(/.*\/dashboard/);

    // التأكد من ظهور أي عنصر مميز داخل الـ MainLayout بعد اللوجن (مثل الروابط الجانبية)
    const dashboardHomeElement = page.locator('text=الرئيسية, text=لوحة التحكم, text=Orders').first();
    await expect(dashboardHomeElement).toBeVisible({ timeout: 5000 });
  });


  // 🔒 الاختبار 2: فحص جدار الحماية (Cookie Injection) والتأكد من عدم الطرد
  test('يجب السماح بالوصول المباشر للداشبورد عند توفر توكن الكوكي مسبقاً', async ({ page, context }) => {
    
    // محاكاة مستخدم لديه الكوكي مخزن مسبقاً في المتصفح
    await context.addCookies([{
      name: 'auth_token',
      value: 'valid_mocked_token_2026', // قيمة افتراضية للتوكن يقرأها الـ ProtectedRoute
      domain: 'localhost',
      path: '/',
    }]);

    // التوجه مباشرة للداشبورد
    await page.goto('/dashboard');

    // التأكد من أن النظام لم يقم بعمل replace أو طرد إلى صفحة /login
    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page).not.toHaveURL(/.*\/login/);
  });

});