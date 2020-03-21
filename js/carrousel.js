'use strict';

window.Carrousel = (function() {

	return Carrousel;
	////////////////////////////////////////////////////////////////////////////////////////////////
	//  ФУНКЦИЯ-КОНСТРУКТОР СЛАЙДЕРА:
	function Carrousel(options) {
		var VIEW_DEFAULT = {
			9999: 1
		};
		var view = options.view || VIEW_DEFAULT;
		var slides = options.slides;
		var btnPrev = options.btnPrev;
		var btnNext = options.btnNext;
		var toggles = options.toggles;
		var loop = options.loop;
		var slideCurrent = 0;

		setByCurrentSlide();

		var goPrevSlide = debounce(goPrevSlide, 100);
		var goNextSlide = debounce(goNextSlide, 100);

		if (btnPrev && btnNext) {
			btnPrev.addEventListener('click', goPrevSlide);
			btnNext.addEventListener('click', goNextSlide);
		}

		window.addEventListener('resize', setSlidesAccordingToScreenSize);


		if (toggles) {
			toggles[slideCurrent].classList.add('active');

			for (var i = 0; i < toggles.length; i++) {
				(function(index) {

					function toggleSlide() {
						var items = setItemsNumber();

						if (index === slideCurrent) {
							return;
						}

						if (toggles[slideCurrent].classList.contains('active')) {
							toggles[slideCurrent].classList.remove('active');
						}

						this.classList.add('active');

						for (i = slideCurrent; i < slideCurrent + items; i++) {
							slides[i].style.display = 'none';
						}

						slideCurrent = index;

						for (i = slideCurrent; i < slideCurrent + items; i++) {
							slides[i].style.display = '';
						}
					}

					var toggleSlide = debounce(toggleSlide, 100);
					toggles[index].addEventListener('click', toggleSlide);
				})(i);
			}
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  ПЕРЕХОД К ПРЕДЫДУЩЕМУ СЛАЙДУ:
		function goPrevSlide() {
			var items = setItemsNumber();

			hideCurrentSlides(items);

			if (btnNext) {
				if (btnNext.hasAttribute('disabled')) {
					btnNext.removeAttribute('disabled');
				}
			}

			slideCurrent = slideCurrent - items;

			if (slideCurrent === 0 && !loop) {
				if (btnPrev) {
					if (!btnPrev.hasAttribute('disabled')) {
						btnPrev.setAttribute('disabled', 'disabled');
					}
				}
			}

			if (slideCurrent < 0) {
				if (loop) {
					slideCurrent = slides.length - items;
				} else {
					slideCurrent = 0;
					if (btnPrev) {
						if (!btnPrev.hasAttribute('disabled')) {
							btnPrev.setAttribute('disabled', 'disabled');
						}
					}
				}
			}

			showFutureSlides(items);
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  ПЕРЕХОД К СЛЕДУЮЩЕМУ СЛАЙДУ:
		function goNextSlide() {
			var items = setItemsNumber();

			hideCurrentSlides(items);
			if (btnPrev) {
				if (btnPrev.hasAttribute('disabled')) {
					btnPrev.removeAttribute('disabled');
				}
			}
			slideCurrent = slideCurrent + items;

			if (loop) {
				if (slideCurrent === slides.length) {
					slideCurrent = 0;
				} else if (slideCurrent + items >= slides.length) {
					slideCurrent = slides.length - items;
				}

			} else {
				if (slideCurrent === slides.length || slideCurrent + items >= slides.length) {
					slideCurrent = slides.length - items;
					if (btnNext) {
						if (!btnNext.hasAttribute('disabled')) {
							btnNext.setAttribute('disabled', 'disabled');
						}
					}
				}
			}

			showFutureSlides(items);
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  ОПРЕДЕЛЕНИЕ КОЛИЧЕСТВА СЛАЙДОВ В СООТВЕТСТВИИ С ТЕКУЩИМ РАЗРЕШЕНИЕМ ВЬЮПОРТА:
		function setItemsNumber() {
			var resolution = document.documentElement.clientWidth;

			for (var key in view) {
				if (+key >= resolution) {
					return view[key];
				}
			}
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  УСТАНОВКА СЛАЙДОВ В СООТВЕТСТВИИ С ТЕКУЩИМ ВЫБРАННЫМ СЛАЙДОМ:
		function setByCurrentSlide() {
			var items = setItemsNumber();

			for (var i = 0; i < slides.length; i++) {
				if (slideCurrent <= i && i < slideCurrent + items) {
					continue;
				}
				slides[i].style.display = 'none';
			}
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  УСТАНОВКА СЛАЙДОВ В СООТВЕТСТВИИ С ТЕКУЩИМ РАЗМЕРОМ ОКНА:
		function setSlidesAccordingToScreenSize() {
			for (var i = 0; i < slides.length; i++) {
				slides[i].style.display = '';
			}

			setByCurrentSlide();
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  СКРЫТИЕ ТЕКУЩИХ СЛАЙДОВ:
		function hideCurrentSlides(items) {
			for (i = slideCurrent; i < slideCurrent + items; i++) {
				slides[i].style.display = 'none';
			}

			if (toggles) {
				toggles[slideCurrent].classList.remove('active');
			}
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  ОТОБРАЖЕНИЕ БУДУЩИХ СЛАЙДОВ:
		function showFutureSlides(items) {
			for (i = slideCurrent; i < slideCurrent + items; i++) {
				slides[i].style.display = '';
			}

			if (toggles) {
				toggles[slideCurrent].classList.add('active');
			}
		}
		////////////////////////////////////////////////////////////////////////////////////////////////
		//  УСТРАНЕНИЕ "ДРЕБЕЗГА":
		function debounce(func, ms) {
			var timerID = null;

			function wrapper() {
				clearTimeout(timerID);
				var refThis = this;
				var arg = arguments;
				timerID = setTimeout(function() {
					func.apply(refThis, arg);
				}, ms);
			}

			return wrapper;
		}
	}

})();
