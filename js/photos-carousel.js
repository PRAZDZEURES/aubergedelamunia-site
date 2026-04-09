(function () {
    function updateActivePreview(index, thumbs) {
        thumbs.forEach(function (thumb, thumbIndex) {
            var isActive = thumbIndex === index;
            thumb.classList.toggle('is-active', isActive);
            thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        if (thumbs[index]) {
            thumbs[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var carousel = document.getElementById('photo-slideshow');
        var thumbs = Array.prototype.slice.call(document.querySelectorAll('#photo-preview-strip .photo-preview-thumb'));

        if (!carousel || !thumbs.length || !window.jQuery) {
            return;
        }

        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var slideIndex = Number(thumb.getAttribute('data-slide-to'));
                window.jQuery(carousel).carousel(slideIndex);
                updateActivePreview(slideIndex, thumbs);
            });
        });

        window.jQuery(carousel).on('slide.bs.carousel', function (event) {
            if (typeof event.to === 'number') {
                updateActivePreview(event.to, thumbs);
            }
        });

        updateActivePreview(0, thumbs);
    });
}());
