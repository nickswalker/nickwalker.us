import "https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js";
import PhotoSwipe from "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe.esm.min.js";
import PhotoSwipeLightbox from "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe-lightbox.esm.min.js";

export async function prepareImagesForPhotoswipe(galleryElements) {
    // PhotoSwipe (lightbox) expects the width and height of each image to be set in the DOM. This function
    // waits for each image to load, then sets the dimensions.
    const promisesList = [];
    galleryElements.forEach((element) => {
        const thumbImage = element.querySelector('img')
        const promise = new Promise(function (resolve) {
            // We're assuming that the thumbnail image is in fact the full-size image
            // If that's not true and you want to force load the full image:
            //let image = new Image();
            //image.src = element.getAttribute('href');
            thumbImage.onload = () => {
                // This promise only completes when lazy load is triggered by user interaction (or no lazy attribute
                // is used.
                element.dataset.pswpWidth = thumbImage.naturalWidth;
                element.dataset.pswpHeight = thumbImage.naturalHeight;
                resolve(); // Resolve the promise only if the image has been loaded
            }
            thumbImage.onerror = () => { resolve(); };
            // onload may not trigger if the image is already in cache, so we need to check if it's already loaded
            if (thumbImage.complete && thumbImage.naturalWidth !== 0) {
                element.dataset.pswpWidth = thumbImage.naturalWidth;
                element.dataset.pswpHeight = thumbImage.naturalHeight;
                resolve();
            }
        });
        promisesList.push(promise);
    });
    await Promise.all(promisesList);
}


export class MasonryImageGallery extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const imagePath = this.getAttribute('base-url');
        const fileExtension = this.getAttribute('file-extension');
        const imageNames = (this.getAttribute('image-names')).split('|');

        const galleryHTML = "<div class='grid-sizer'></div>" + imageNames.map(name => `
      <a href="${imagePath}${name}${fileExtension}">
        <img loading="lazy" src="${imagePath}${name}${fileExtension}"/>
      </a>
    `).join('');


        const styles = `<style>
    /* GALLERY **************************/
    .masonry {
        background-color: rgba(0,0,0,.05);
    }
    
    /* clear fix */
    .masonry:after {
        content: '';
        display: block;
        clear: both;
    }
    .masonry > a {
        float: left;
    }
    
    .masonry img {
        display: block;
        max-width: 100%;
    }
    
    .masonry .grid-sizer,
    .masonry a {
        width: 50%;
    }
    
    @media screen and (width > 720px) {
    .masonry .grid-sizer,
    .masonry a {
        width: 33.33%;
    }
    }
    
    .pswp img {
    max-width: none;
    object-fit: contain;
    }
    </style>`;

        this.shadowRoot.innerHTML = `${styles}<div class="masonry">${galleryHTML}</div>`;
        prepareImagesForPhotoswipe(this.shadowRoot.querySelectorAll("a")).then(() => {
            const lightbox = new PhotoSwipeLightbox({
                gallery: this.shadowRoot.querySelector(".masonry"),
                children: 'a',
                showHideAnimationType: 'zoom',
                showAnimationDuration: 200,
                hideAnimationDuration: 200,
                pswpModule: () => import("photoswipe")

            });
            lightbox.init();

            let container = this.shadowRoot.querySelector(".masonry");
            let msnry = new Masonry(container, {
                itemSelector: 'a',
                columnWidth: '.grid-sizer',
                percentPosition: true
            });
            msnry.layout()
        });
    }

}

customElements.define('masonry-image-gallery', MasonryImageGallery);
