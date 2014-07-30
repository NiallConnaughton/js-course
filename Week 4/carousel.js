var images = [ 'Patagonia-5.jpg',
				'Patagonia.jpg',
				'Patagonia_subheader3.jpg',
				'patagonia-615.jpg',
				'glacier-grey1.jpg'
			];

var imageElements = [];
for (var i = 0; i < images.length; i++) {
	var image = images[i];
	imageElements.push('<img src="' + image + '"></img>');
}

var carouselContent = imageElements.join('\n');
$('#carouselContent').html(carouselContent);

