$(document).ready(function() {
    let loadedImageCount = 0; // Keep track of how many images have been loaded
    const imagesPerScroll = 8; // Number of images to load for each batch
    
    const gallery = $('#imageGallery'); // The gallery container where images will be appended
    let lazyLoadInstance; // To store lazy load instance after initialization

    // Function to load images
    function loadImage() {
        fetch('images.json')
            .then(response => response.json())
            .then(images => {
                // Stop further execution if we've loaded all images
                if (loadedImageCount >= images.length) {
                    return;
                }
                
                // Load the next batch of images
                const imagesToLoad = images.slice(loadedImageCount, loadedImageCount + imagesPerScroll);
                imagesToLoad.forEach(image => {
                    gallery.append(`
                        <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                            <img class="img-thumbnail lazy" data-src="${image.src}" alt="${image.alt}" 
                                data-toggle="modal" data-target="#imageModal">
                        </div>
                    `);
                });
                loadedImageCount += imagesPerScroll; // Update the count of loaded images
                
                // Initialize Lazy Load library if it's not already initialized
                if (!lazyLoadInstance) {
                    lazyLoadInstance = new LazyLoad({
                        elements_selector: ".lazy"
                    });
                } else {
                    lazyLoadInstance.update(); // Update lazy load instance for new images
                }
                
                // After loading images, check if we need to load more immediately
                if ($(window).height() === $(document).height()) {
                    loadImage();
                }
            })
            .catch(error => {
                console.error('Error loading the images:', error);
            });
    }

    // Load initial images
    loadImage();

    // Event listener for scroll event to load more images
    $(window).scroll(function() {
        const nearBottom = $(window).scrollTop() + $(window).height() > $(document).height() - 100;
        if (nearBottom) {
            loadImage();
        }
    });

    // Event delegation for the click to open the modal with the full image
    $(document).on('click', 'img[data-toggle="modal"]', function() {
        const src = $(this).attr('data-src');
        const modalImage = $('#modalImage');
        modalImage.attr('src', src);
        $('#imageModal').modal('show');
    });

    // Add event handlers for hover effects on gallery images
    $(document).on('mouseenter', 'img.img-thumbnail', function() {
        $(this).css({
            'transform': 'scale(1.1)',
            'z-index': '10',
            'transition': 'transform 0.3s ease, box-shadow 0.3s ease',
            'box-shadow': '0 0 10px rgba(0,0,0,0.5)'
        });
    }).on('mouseleave', 'img.img-thumbnail', function() {
        $(this).css({
            'transform': 'scale(1.0)',
            'z-index': '1',
            'transition': 'transform 0.3s ease, box-shadow 0.3s ease',
            'box-shadow': 'none'
        });
    });
});