$(document).ready(function () {
    // grabs the products from the product api
    $.ajax({
        url: "/product",
        method: "GET",
        dataType: "json",
        success: function (result, status) {
            result.forEach(function (i) {
                createFrameDiv(i);
            });
        }

    }); //ajax

    // creates a frame that holds the info for a product.
    function createFrameDiv(element) {
        $("#productContainer").append(
            `<div class=" d-flex row pb-2">
                <div class="col-2 border justify-content-center">
                    <img class="img-fluid" src="/images/Empty.png" alt="${element.pictureUrl} picture"/>
                </div>
                <div class="col-3 border">
                    <div class="d-flex flex-column h-100">
                    <div class="row border justify-content-center">
                        <a href="/product?id=${element.productId}">${element.name}</a>
                    </div>
                    <div class="row border justify-content-center flex-grow-1">
                        <p>${element.info}</p>
                    </div>
                    <div class="row border">
                        <div class="col">
                            <div class="row border justify-content-center"><p>Stock: ${element.stock}</p></div>
                        </div>
                        <div class="col">
                            <div class="row border justify-content-center"><p>$${parseFloat(element.cost).toFixed(2)}</p></div>
                        </div>
                    </div>
                     
                </div>
             </div> 
            `
        );

        $(`product${element.productId}`).on('click', function () {
            console.log(this.id);
        });

    }
});