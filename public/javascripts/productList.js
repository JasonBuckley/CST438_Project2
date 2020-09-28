$(document).ready(function () {
    // grabs the products from the product api
    $.ajax({
        url: "/product/",
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
            `<div id="product${element.productId}" class="row">
                <div class="col-2 border d-flex justify-content-center">Image
                </div>
                <div class="col-3">
                    <div class="row border justify-content-center">
                        <p>${element.name}</p>
                    </div>
                    <div class="row border justify-content-center">
                        <p>${element.info}</p>
                    </div>
                    <div class="row border">
                        <div class="col">
                            <div class="row border justify-content-center"><p>Stock: ${element.stock}</p></div>
                        </div>
                        <div class="col">
                            <div class="row border justify-content-center"><p>${element.cost}</p></div>
                        </div>
                    </div>
                </div>
             </div> 
             </br>`
        )

    }
});