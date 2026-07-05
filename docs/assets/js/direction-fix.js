/**
 * direction-fix.js — global guard (يعمل في كل الصفحات)
 * ====================================================
 * هذا الملف لا يحتاج guard لأنه يجب أن يعمل في كل صفحة من الموقع
 * لضبط اتجاه (dir="rtl" أو dir="ltr") وسمة lang ديناميكياً حسب اللغة.
 *
 * المنطق:
 * - المسار يبدأ بـ /en/ → dir="ltr" (صفحات إنجليزية)
 * - المسار لا يبدأ بـ /en/ → dir="rtl" (صفحات عربية)
 */
(function () {
  function fixDirection() {
    var path = window.location.pathname;
    var dir = path.startsWith('/en/') ? 'ltr' : 'rtl';
    var html = document.documentElement;

    if (html.getAttribute('dir') !== dir) {
      html.setAttribute('dir', dir);

      // أيضاً نحدّث سمة lang لتتناسب مع الاتجاه
      var lang = path.startsWith('/en/') ? 'en' : 'ar';
      html.setAttribute('lang', lang);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixDirection);
  } else {
    fixDirection();
  }

  // أعد الفحص عند أي تغيير في المسار (للـ SPA-like behaviour مع Material theme)
  window.addEventListener('popstate', fixDirection);
})();
