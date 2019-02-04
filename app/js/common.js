window.onload = function () {
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    var productCards = document.querySelectorAll('.product-card .product-card__container');

    if (productCards.length) {
        productCards.forEach(function (element) {

            element.onclick = function () {
                var product = this.parentElement,
                    selected = product.getAttribute('data-select'),
                    productClass = product.classList;

                if (product.getAttribute('data-instock') == 'false') {
                    return;
                }

                switch (selected) {

                    case 'false':
                        product.setAttribute('data-select', 'true');
                        this.addEventListener("mouseleave", function () {
                            if (!productClass.contains('product-card_selecteffect')) {
                                productClass.add('product-card_selecteffect');
                            }
                        });
                        break;

                    case 'true':
                        product.setAttribute('data-select', 'false');
                        productClass.remove('product-card_selecteffect');
                        this.addEventListener("mouseleave", function () {
                            if (productClass.contains('product-card_selecteffect')) {
                                productClass.remove('product-card_selecteffect');
                            }
                        });
                        break;

                    default:
                        alert('Не верно указано значение в атрибуте [data-select]');
                        break;
                }

            };
        });
    }

};

