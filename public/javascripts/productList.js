$(document).ready(function () {
    let page = 0;

    // on load gets first page
    getProducts(page).then((result) => {
        if (result.success) {
            $("#productContainer").empty();
            result.products.forEach((product) => {
                createFrameDiv(product);
            });
        }
    });

    // grabs the products from the product api given a certain page number
    function getProducts(page) {
        return $.ajax({
            url: "/product?page=" + page,
            method: "GET",
            dataType: "json",
            success: function (result, status) {
                console.log(result);
                return result;
            }
        }); //ajax
    }

    // creates a frame that holds the info for a product.
    function createFrameDiv(product) {
        img = product.imgId ? "https://drive.google.com/uc?export=download&id=" + product.imgId : "/images/Empty.png";
        $("#productContainer").append(
            `
            <tr>
                <td>
                    <div class="row">
                        <div class="col-md-5 text-left">
                            <img src="${img}" alt="Picture of ${product.name}" class="img-fluid rounded mb-2 shadow ">
                        </div>
                        <div class="col-md-7 text-left mt-sm-2">
                            <h4><strong><a href="/product/${product.productId}">${product.name}</a></strong></h4>
                            <p class="font-weight-light">${product.brand}</p>
                        </div>
                    </div>
                </td>
                <td><p style="overflow:hidden; max-height: 4.9em">${product.info}></td>
                <td>
                    <span>${product.stock}</span> Available
                </td>
                <td class="actions" data-th="">
                    $<span>${product.cost}</span>
                </td>
            </tr>

            `
        );
    }

    // goes to the previous page
    $("#prevPage").on('click', function () {
        if (page == 0) {
            return;
        }
        getProducts(page - 1).then((result) => {
            if (result.success && Array.isArray(result.products) && result.products.length) {
                $("#productContainer").empty();
                page--;
                result.products.forEach((product) => {
                    createFrameDiv(product);
                });
            }
        });
    });

    // goes to the next page
    $("#nextPage").on('click', function () {
        getProducts(page + 1).then((result) => {
            if (result.success && Array.isArray(result.products) && result.products.length) {
                $("#productContainer").empty();
                page++;
                result.products.forEach((product) => {
                    createFrameDiv(product);
                });
            }
        });
    });

});