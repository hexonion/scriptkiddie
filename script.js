// Простая логика переключения темы и плавность навигации
(function(){
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  // стартовая тема: тёмная
  let theme = localStorage.getItem('theme') || 'dark';
  setTheme(theme);

  if(toggle){
    toggle.addEventListener('click', ()=> {
      theme = (theme === 'dark') ? 'light' : 'dark';
      setTheme(theme);
    });
  }

  function setTheme(t){
    if(t === 'light'){
      root.setAttribute('data-theme','light');
      if(toggle) toggle.setAttribute('aria-label','Переключить тему на тёмную');
    } else {
      root.setAttribute('data-theme','dark');
      if(toggle) toggle.setAttribute('aria-label','Переключить тему на светлую');
    }
    localStorage.setItem('theme', t);
  }

  // небольшая навигационная анимация подчеркивания активного пункта
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.id;
        document.querySelectorAll('.nav-item').forEach(n=>{
          n.classList.toggle('active', n.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {rootMargin:'-40% 0px -60% 0px', threshold:0.01});
  sections.forEach(s => observer.observe(s));

  // простая "ленивая" загрузка изображений
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  imgs.forEach(img => {
    if('loading' in HTMLImageElement.prototype){
      // браузеры already lazy
    }else{
      // fallback не реализуется — современные браузеры поддерживают
    }
  });
})();
