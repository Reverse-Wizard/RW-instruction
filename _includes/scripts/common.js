(function () {
  var $root = document.getElementsByClassName('root')[0];
  var currentYear = new Date().getFullYear();
  var $currentYears = document.querySelectorAll('.js-current-year');
  for (var i = 0; i < $currentYears.length; i++) {
    $currentYears[i].textContent = currentYear;
  }
  if (window.hasEvent('touchstart')) {
    $root.dataset.isTouch = true;
    document.addEventListener('touchstart', function(){}, false);
  }
})();
