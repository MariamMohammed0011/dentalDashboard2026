# إضافة نظام الترجمة (i18n) للداشبورد

إضافة مكتبة `react-i18next` لدعم الترجمة مع ملف ترجمة عربي يشمل كل النصوص الموجودة حالياً بالمشروع، واستبدال كل النصوص المكتوبة مباشرة (hardcoded) بمفاتيح ترجمة `t('key')`.

## النطاق والحجم

> [!IMPORTANT]
> هذا المشروع يحتوي على **76 ملف** فيهم نصوص عربية من أصل 106 ملف. يشمل 12 feature و shared components. هذا تغيير شامل يمس كل أجزاء المشروع.

### الملفات المتأثرة مقسمة حسب الأقسام:

| القسم | عدد الملفات | أمثلة |
|-------|------------|-------|
| **Auth** | ~4 | LoginForm, useLogin, useLogout |
| **Dashboard** | ~5 | DashboardHome, WelcomeHeader, SettingsPage |
| **Doctors** | ~5 | DoctorsPage, DoctorsHeader, DoctorCard, DoctorsTable |
| **Labs** | ~5 | LabsPage, LabCard, LabDetailsModal, LabsFilter |
| **Orders** | ~5 | OrdersPage, OrdersTable, OrdersHeader, OrderDetailsModal |
| **Membership** | ~6 | MembershipRequestsPage, MembershipCard, MembershipList |
| **Blogs** | ~3 | BlogsPage, useBlogs |
| **Ads** | ~7 | AdsPage, AdsFilter, AdCard, UsersManagementPage |
| **Notifications** | ~4 | NotificationsListPage, SendNotificationPage, NotificationsTable |
| **Reports** | ~3 | ReportsPage, ReportsTable, ReportsHeader |
| **Interventions** | ~3 | InterventionPage, InterventionCard, InterventionHeader |
| **Subscription** | ~3 | SubscriptionsPage, SubscriptionCard |
| **Shared** | ~8 | Sidebar, Header, Search, UserStatusModal, MainLayout |
| **Config/Root** | ~3 | App.jsx, index.html |

---

## User Review Required

> [!IMPORTANT]
> **هل تريدي تنظيم مفاتيح الترجمة بملف واحد كبير أو مقسمة حسب الـ feature (namespace)؟**
> - **ملف واحد** `ar.json`: أبسط للإدارة في مشروع بهالحجم
> - **ملفات مقسمة** `ar/common.json`, `ar/labs.json`, `ar/doctors.json`: أنظف بس أعقد
> 
> أنصح بملف واحد لأن المشروع حجمه معقول.

> [!WARNING]
> **هذا التغيير رح يمس تقريباً كل ملف بالمشروع.** تأكدي إن الكود محفوظ على Git (تم ✅) قبل البدء.

---

## Proposed Changes

### 1. إعداد المكتبة (Infrastructure)

#### [NEW] [i18n.js](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/i18n.js)
- تهيئة `i18next` مع `react-i18next`
- ضبط اللغة الافتراضية على العربية (`ar`)
- ضبط اتجاه RTL
- تحميل ملف الترجمة

#### [NEW] [ar.json](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/locales/ar.json)
- ملف ترجمة عربي شامل يحتوي كل النصوص الموجودة حالياً بالمشروع
- مفاتيح منظمة حسب القسم: `common.*`, `sidebar.*`, `auth.*`, `dashboard.*`, `labs.*`, `doctors.*`, `orders.*`, `membership.*`, `blogs.*`, `ads.*`, `notifications.*`, `reports.*`, `interventions.*`, `subscription.*`

#### [MODIFY] [main.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/main.jsx)
- إضافة `import './i18n'` لتهيئة i18n قبل تحميل التطبيق

---

### 2. Shared Components

#### [MODIFY] [Sidebar.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/components/shared/Sidebar.jsx)
- استبدال labels: `الرئيسية`, `الطلبات`, `طلبات الانتساب`, `الاطباء`, `المخابر`, `الاشتراكات`, `المدونات`, `الإعلانات`, `الإشعارات`, `التقارير`, `سجل التدخلات`, `الاعدادات`

#### [MODIFY] [UserStatusModal.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/components/shared/UserStatusModal.jsx)
- استبدال نصوص الحالات والأزرار

#### [MODIFY] [Header.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/components/shared/Header.jsx)
- استبدال النصوص

---

### 3. Auth Feature

#### [MODIFY] [LoginForm.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/features/auth/components/LoginForm.jsx)
- استبدال: `ابتسامتك، إدارتنا`, `البريد الالكتروني`, `كلمة السر`, `تسجيل دخول`, `جاري التحقق...`, `تذكر حسابي`, etc.

#### [MODIFY] hooks: useLogin.js, useLogout.js
- استبدال رسائل toast

---

### 4. Dashboard Feature

#### [MODIFY] [DashboardHome.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/features/dashboard/DashboardHome.jsx)
- استبدال عناوين البطاقات الإحصائية والرسوم البيانية (~50+ نص)

#### [MODIFY] WelcomeHeader, SettingsPage, etc.

---

### 5. Labs Feature

#### [MODIFY] [LabsPage.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/features/labs/pages/LabsPage.jsx)
#### [MODIFY] [LabCard.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/features/labs/components/LabCard.jsx)
#### [MODIFY] [LabDetailsModal.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/features/labs/components/LabDetailsModal.jsx)
#### [MODIFY] [LabsFilter.jsx](file:///c:/Users/MariamMohammed/Desktop/lastDental/dentalDashboard2026/src/features/labs/components/LabsFilter.jsx)

---

### 6-12. باقي الـ Features (نفس النمط)
- **Doctors**: DoctorsPage, DoctorsHeader, DoctorCard, DoctorsTable, PendingRequestsSidebar
- **Orders**: OrdersPage, OrdersTable, OrdersHeader, OrderDetailsModal
- **Membership**: MembershipRequestsPage, MembershipCard, MembershipList, MembershipHeader, MembershipDetailsModal
- **Blogs**: BlogsPage
- **Ads**: AdsPage, AdsFilter, AdCard, AddAdModal, UsersManagementPage
- **Notifications**: NotificationsListPage, SendNotificationPage, NotificationsTable
- **Reports**: ReportsPage, ReportsTable, ReportsHeader
- **Interventions**: InterventionPage, InterventionCard, InterventionHeader
- **Subscription**: SubscriptionsPage, SubscriptionCard

---

## نمط التحويل

كل ملف JSX سيتحول بالنمط التالي:

```diff
+ import { useTranslation } from 'react-i18next';

  const MyComponent = () => {
+   const { t } = useTranslation();
    
    return (
-     <h1>المخابر</h1>
+     <h1>{t('labs.title')}</h1>
    );
  };
```

الملفات غير المكونة (hooks, services) التي تستخدم toast:
```diff
+ import i18n from '../../../i18n';

- toast.success('تم تسجيل الخروج بنجاح');
+ toast.success(i18n.t('auth.logoutSuccess'));
```

---

## المكتبات المطلوبة

```bash
npm install i18next react-i18next
```

---

## Verification Plan

### Automated Tests
```bash
npm run build
```

### Manual Verification
- التحقق من عرض كل النصوص العربية بشكل صحيح بعد التحويل
- التحقق من عدم ظهور أي مفاتيح ترجمة خام (مثل `labs.title`) بدل النصوص
- التحقق من أن كل الـ toast messages تظهر بالعربي
- التحقق من اتجاه RTL يعمل بشكل صحيح

---

## ترتيب التنفيذ

1. تثبيت المكتبات
2. إنشاء `i18n.js` + `locales/ar.json`
3. تحديث `main.jsx`
4. تحويل Shared Components (Sidebar, UserStatusModal, Header)
5. تحويل Auth
6. تحويل Dashboard
7. تحويل Labs
8. تحويل Doctors
9. تحويل Orders
10. تحويل Membership
11. تحويل Blogs
12. تحويل Ads
13. تحويل Notifications
14. تحويل Reports
15. تحويل Interventions
16. تحويل Subscription
17. Build + اختبار شامل
