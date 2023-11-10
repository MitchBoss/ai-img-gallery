$(document).ready(function() {
    let loadedImageCount = 0; // Initialize at zero to keep track of images loaded
    const imagesPerScroll = 8; // Number of images to load each time the bottom of the window is visible
    let images = []; // Will hold the fetched images once loaded
    let lazyLoadInstance; // The instance of LazyLoad once initialized
    let currentImageIndex = 0; // Index for navigating images with arrow keys

    // Function to append images to the DOM and update lazy load
    function appendImages() {
        const endIndex = Math.min(loadedImageCount + imagesPerScroll, images.length);
        
        images.slice(loadedImageCount, endIndex).forEach((image, index) => {
            const html = `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div class="thumbnail-container">
                        <img class="img-thumbnail lazy" data-src="${image.src}" alt="${image.alt}"
                             data-index="${loadedImageCount + index}" data-toggle="modal" data-target="#imageModal">
                    </div>
                </div>`;
            
            $('#imageGallery').append(html);
        });

        // After images are appended to the DOM, update the count
        loadedImageCount += imagesPerScroll;
        
        // Update or initialize Lazy Load for the newly added image elements
        if (lazyLoadInstance) {
            lazyLoadInstance.update();
        } else {
            lazyLoadInstance = new LazyLoad({ elements_selector: '.lazy' });
        }
    }

    // Function to fetch and store images and initialize the first image append
    function loadImagesFromServer() {
        fetch('images.json')
            .then(response => response.json())
            .then(fetchedImages => {
                images = fetchedImages; // Store fetched images
                appendImages(); // Append images to the DOM
                checkIfLoadMore(); // Check if more images should be loaded initially
            })
            .catch(error => console.error('Error fetching images:', error));
    }

    // Function to trigger loading more images if the document is shorter than the window
    function checkIfLoadMore() {
        if ($(document).height() <= $(window).height() && loadedImageCount < images.length) {
            appendImages();
        }
    }

    // Event handler for scrolling to load more images
    $(window).scroll(function() {
        if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
            appendImages();
        }
    });

    // Event handler for clicking on an image to open the modal
    $(document).on('click', '.img-thumbnail', function() {
        currentImageIndex = parseInt($(this).data('index'), 10);
        const src = images[currentImageIndex].src;
        const alt = images[currentImageIndex].alt;
        $('#modalImage').attr('src', src).attr('alt', alt);
        $('#imageModal').modal('show');
    });

    // Event handler for closing the modal
    $(document).on('click', '#modalCloseButton', function() {
        $('#imageModal').modal('hide');
    });

    // Event handlers for arrow keys navigation in the modal
    $(document).keydown(function(e) {
        if ($('#imageModal').hasClass('show')) {
            if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
                currentImageIndex--;
            } else if (e.key === 'ArrowRight' && currentImageIndex < images.length - 1) {
                currentImageIndex++;
            }
            const img = images[currentImageIndex];
            $('#modalImage').attr('src', img.src).attr('alt', img.alt);
        }
    });

    // Event handlers for hover effects on gallery images
    $(document).on('mouseenter', '.img-thumbnail', function() {
        $(this).css({
            'transform': 'scale(1.1)',
            'z-index': '10',
            'transition': 'transform 0.3s ease, box-shadow 0.3s ease',
            'box-shadow': '0 0 10px rgba(0,0,0,0.5)'
        });
    }).on('mouseleave', '.img-thumbnail', function() {
        $(this).css({
            'transform': 'none',
            'z-index': '1',
            'transition': 'transform 0.3s ease, box-shadow 0.3s ease',
            'box-shadow': 'none'
        });
    });

    // Initially load images from the server
    loadImagesFromServer();
});