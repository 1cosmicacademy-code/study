/**
 * Video Switcher — creates YouTube embed iframe and selects language-appropriate video.
 *
 * How it works:
 * 1. Detects language from page URL (/en/ = English, otherwise Arabic)
 * 2. Detects lesson key from page URL (lektion-XX)
 * 3. Fetches videos.json and looks up the correct video ID
 * 4. Creates/updates a YouTube iframe embed after the video section h2 heading
 * 5. Updates text links and code blocks as fallback
 *
 * Requirements:
 * - Each lesson page must have an h2 heading containing "فيديو" or "Video" (case-insensitive)
 * - videos.json at site root must have entry for the lesson key
 */
(function () {
  'use strict';

  // Early exit — self-guard: only run on lesson pages (URL contains /lektion-)
  // هذا الـ guard يمنع تحميل وتنفيذ video-switcher.js في الصفحات غير المطلوبة مثل
  // الرئيسية، القواعد، فحص المستوى، Übungsbuch، والصفحات الأخرى التي لا تحتوي فيديوهات دروس.
  if (window.location.pathname.indexOf('/lektion-') === -1) return;

  var isEnglish = window.location.pathname.startsWith('/en/');
  var lang = isEnglish ? 'en' : 'ar';

  function getLessonKey() {
    var match = window.location.pathname.match(/(lektion-\d{2})/);
    if (!match) return null;
    var isA2 = window.location.pathname.indexOf('/a2/') !== -1;
    return isA2 ? 'a2-' + match[1] : match[1];
  }

  function createEmbedIframe(videoId) {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId;
    iframe.width = '100%';
    iframe.height = '315';
    iframe.style.maxWidth = '560px';
    iframe.style.aspectRatio = '16 / 9';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    return iframe;
  }

  /**
   * Find the video section h2 heading.
   * Looks for any h2 whose text contains "فيديو" or "Video" (case-insensitive).
   */
  function getVideoSectionHeading() {
    var headings = document.querySelectorAll('h2');
    for (var i = 0; i < headings.length; i++) {
      var text = headings[i].textContent || '';
      if (text.indexOf('فيديو') !== -1 || text.search(/video/i) !== -1) {
        return headings[i];
      }
    }
    return null;
  }

  /**
   * Create or update the video embed container right after the given heading.
   * If a container with class 'video-embed-container' already exists among the
   * next siblings (before the next h2), updates its iframe src.
   * Otherwise injects a new container.
   */
  function createOrUpdateEmbed(heading, videoId) {
    var container = heading.nextElementSibling;
    var existingContainer = null;

    // Scan siblings until we hit another h2
    while (container && container.tagName !== 'H2') {
      if (container.classList && container.classList.contains('video-embed-container')) {
        existingContainer = container;
        break;
      }
      container = container.nextElementSibling;
    }

    if (existingContainer) {
      var existingIframe = existingContainer.querySelector('iframe');
      if (existingIframe) {
        // Update existing iframe src
        existingIframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId;
      } else {
        // Container exists but no iframe (static fallback) — inject iframe
        existingContainer.textContent = '';
        existingContainer.appendChild(createEmbedIframe(videoId));
      }
      return;
    }

    // Inject new container right after the heading
    var newContainer = document.createElement('div');
    newContainer.className = 'video-embed-container';
    newContainer.style.margin = '1rem 0';
    newContainer.style.textAlign = 'center';
    newContainer.appendChild(createEmbedIframe(videoId));

    var nextEl = heading.nextElementSibling;
    if (nextEl) {
      heading.parentNode.insertBefore(newContainer, nextEl);
    } else {
      heading.parentNode.appendChild(newContainer);
    }
  }

  /**
   * Update any existing YouTube text links and code blocks on the page.
   */
  function updateFallbackLinks(videoId, channel, title) {
    var links = document.querySelectorAll('a[href*="youtube.com/watch"]');
    links.forEach(function (link) {
      link.href = 'https://www.youtube-nocookie.com/watch?v=' + videoId;
      if (channel) link.textContent = channel + ' — ' + title;
    });

    var codes = document.querySelectorAll('code');
    codes.forEach(function (code) {
      if ((code.textContent || '').indexOf('youtube.com/watch') !== -1) {
        code.textContent = 'https://www.youtube-nocookie.com/watch?v=' + videoId;
      }
    });
  }

  function init() {
    var lessonKey = getLessonKey();
    if (!lessonKey) return;

    fetch('/videos.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var lesson = data[lessonKey];
        if (!lesson || !lesson[lang] || !lesson[lang].video_id) {
          console.warn('[VideoSwitcher] No video entry for key:', lessonKey, 'lang:', lang);
          return;
        }

        var videoId = lesson[lang].video_id;
        var channel = lesson[lang].channel || '';
        var title = lesson[lang].title || '';

        var heading = getVideoSectionHeading();
        if (heading) {
          createOrUpdateEmbed(heading, videoId);
        } else {
          console.warn('[VideoSwitcher] No h2 video heading found on page');
        }

        updateFallbackLinks(videoId, channel, title);
      })
      .catch(function (err) {
        console.warn('[VideoSwitcher] Failed to fetch videos.json:', err.message || err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // --- دعم التنقل الديناميكي لـ MkDocs SPA ---

  window.addEventListener('popstate', function () {
    // تأخير قصير للتأكد من تحمّل DOM الجديد
    setTimeout(init, 100);
  });

  var observer = new MutationObserver(function (mutations) {
    if (window.location.pathname.indexOf('/lektion-') !== -1) {
      var headings = document.querySelectorAll('h2');
      for (var i = 0; i < headings.length; i++) {
        var text = headings[i].textContent || '';
        if (text.indexOf('فيديو') !== -1 || text.search(/video/i) !== -1) {
          if (!headings[i].nextElementSibling || !headings[i].nextElementSibling.classList.contains('video-embed-container')) {
            setTimeout(init, 200);
          }
          break;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
