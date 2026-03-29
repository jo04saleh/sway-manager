# 🎉 SWAY — Event Management System

> نظام متكامل لإدارة فعاليات بار SWAY — فلسطين والأردن  
> تم التطوير بواسطة **Data_Lab_by_JihadAbusaleh**

---

## 🌐 الروابط

| الخدمة | الرابط |
|--------|--------|
| 🖥 الواجهة (Frontend) | https://sway-manager.netlify.app |
| ⚙️ الباكند (API) | Render (Laravel) |
| 🗄 قاعدة البيانات | Supabase (PostgreSQL) |

---

## 📋 نظرة عامة

نظام إدارة فعاليات متعدد الفروع يدعم:
- إدارة العملاء والفعاليات والعقود
- تتبع المدفوعات والمصاريف
- إدارة المخزون لكل فرع بشكل مستقل
- تقارير مالية مفصّلة
- صلاحيات متعددة (مالك / مدير فرع)

---

## 🏗 التقنيات المستخدمة

### Frontend
- **React + Vite** — واجهة المستخدم
- **Netlify** — استضافة الفرونت
- ملف واحد `App.jsx` — بدون مكتبات UI خارجية

### Backend
- **Laravel 10 + Sanctum** — API والمصادقة
- **Render** — استضافة الباكند (مجاني)
- **PostgreSQL (Supabase)** — قاعدة البيانات (مجاني)

---
---

## 🔑 الصلاحيات

| الميزة | مالك النظام | مدير الفرع |
|--------|:-----------:|:----------:|
| عرض جميع الفروع | ✅ | ❌ |
| إضافة / تعديل فروع | ✅ | ❌ |
| إدارة المدراء | ✅ | ❌ |
| تقارير جميع الفروع | ✅ | ❌ |
| إدارة عملاء الفرع | ✅ | ✅ |
| إضافة / حذف فعاليات | ✅ | ✅ |
| تسجيل مدفوعات | ✅ | ✅ |
| إدارة المصاريف | ✅ | ✅ |
| إدارة المخزون | ✅ | ✅ |
| تقارير الفرع | ✅ | ✅ |

---

## 📁 هيكل المشروع

```
sway-manager/          ← مجلد الفرونت
├── src/
│   └── App.jsx        ← كامل الواجهة (ملف واحد)
├── public/
│   └── _redirects     ← إعداد Netlify
└── package.json

sway-backend/          ← مجلد الباكند
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   ├── BranchController.php
│   │   ├── ClientController.php
│   │   ├── EventController.php
│   │   ├── ContractController.php
│   │   ├── PaymentController.php
│   │   ├── ExpenseController.php
│   │   └── InventoryController.php
│   └── Models/
│       ├── User.php
│       ├── Branch.php
│       ├── Client.php
│       ├── Event.php
│       ├── Contract.php
│       ├── Payment.php
│       ├── Expense.php
│       └── InventoryItem.php
├── routes/
│   └── api.php        ← 34 API route
├── Dockerfile
└── render.yaml
```

---

## 🗄 جداول قاعدة البيانات

| الجدول | الوصف |
|--------|-------|
| `users` | المستخدمون (مالك / مدير / موظف) |
| `branches` | الفروع مع العملة |
| `clients` | العملاء (مرتبطون بفرع) |
| `events` | الفعاليات |
| `contracts` | العقود (تُولَّد تلقائياً) |
| `payments` | المدفوعات |
| `expenses` | المصاريف |
| `inventory_items` | عناصر المخزون |
| `inventory_operations` | عمليات المخزون (إضافة/سحب) |

---

## 🚀 النشر

### Frontend — Netlify
```bash
# ربط GitHub
git remote add origin https://github.com/jo04saleh/sway-manager.git
git add .
git commit -m "update"
git push
# Netlify تتحدث تلقائياً
```

### Backend — Render
- Runtime: **Docker**
- Build Command: من Dockerfile
- متغيرات البيئة: APP_KEY, DB_HOST, DB_PASSWORD...

---

## ⚙️ متغيرات البيئة (Backend)

```env
APP_KEY=base64:6/JLAV7vQWtJ3txhx9xWXDMAyWjqqt+4P3J/T5zbomA=
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.fpuxktrcgvxgzancrnzz
DB_PASSWORD=***** (كلمة سر Supabase)
```

---

## 💰 التكاليف

| الخدمة | التكلفة |
|--------|---------|
| Netlify | مجاني ✅ |
| Render | مجاني ✅ |
| Supabase | مجاني حتى 500MB ✅ |
| **الإجمالي** | **$0 / شهر** |

---

## 📞 التواصل

**Data_Lab_by_JihadAbusaleh**  
تطوير وبناء الأنظمة والتطبيقات
