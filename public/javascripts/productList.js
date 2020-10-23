// Filename: productList.js
// Code relevant to the product list hbs file listed as a partial
// Code is also dependent on specific html elements from other files
// such as button or list items related to an unordered list

$(document).ready(function () {
    // Set default values for page number of results, user inputs, and search methods
    let page = 0;
    let method = "";
    let name = "";
    let min = 0;
    let max = 0;

    // On page load, by default, hide the product list
    // It will only be shown when a product or category 
    // of products are to be presented
    $(".search-res").hide(); // -> Container not part of product list, yet housing it


    // Displays a product list for products matching an input 
    $("#search-btn").on("click", function() {
        // Reset page
        page = 0;

        // Set search by method
        method = "searchByName";

        // Extract search value from HTML input element 
        // (not part of product list partial)
        name = $("#search-product").val();

        // Perform AJAX call and display results
        getProductsByName(page, name).then((result) => {
            if (result.success && result.products.length > 0) {
                 // Allow room for product list, rid of product carousel
                 $(".slider").hide();
                 $("#product").hide();
                 $(".search-res").show();

                 // Remove results from previous searches
                 $("#productContainer").empty();

                 // Display search results
                result.products.forEach((product) => {
                    createFrameDiv(product);
                });
            } else {
                // Maintain original page format, reset for no results
                $(".slider").show();
                $("#product").show();
                $(".search-res").hide();
            }
        });
    });

    // Displays a product list for all products
    // when "explore" is selected from the side menu
    $("#side-menu-explore").on("click", function() {
        // Reset page
        page = 0;

        // Set search by method
        method = "explore";

        getProducts(page).then((result) => {
            if (result.success && result.products.length > 0) {
                 // Allow room for product list, rid of product carousel
                 $(".slider").hide();
                 $(".search-res").show();

                 // Remove results from previous searches
                 $("#productContainer").empty();

                // Display search results
                result.products.forEach((product) => {
                    createFrameDiv(product);
                });
            } else {
                // Maintain original page format, reset for no results
                $(".slider").show();
                $(".search-res").hide();
            }
        });
    });


    // Displays a product list for products between a min and 
    // max price determined by which side menu option was clicked
    document.querySelectorAll("[id^='side-menu-price-opt-']").forEach(function(element) {
        element.onclick = function() {
            // Reset page
            page = 0;

            // Set search by method
            method = "searchByPrice";

            // Extract the values for min and max from attr embeded in HTML
            min = $(`#${this.id}`).attr("min");
            max = $(`#${this.id}`).attr("max");

            // Perform AJAX call and display results
            getProductsByPrice(page, min, max).then((result) => {
                if (result.success && result.products.length > 0) {
                    // Allow room for product list, rid of product carousel
                    $(".slider").hide();
                    $(".search-res").show();

                    // Remove results from previous searches
                    $("#productContainer").empty();

                    // Display search results
                    result.products.forEach((product) => {
                        createFrameDiv(product);
                    });
                } else {
                    // Maintain original page format, reset for no results
                    $(".slider").show();
                    $(".search-res").hide();
                }
            });
            
        }
  })

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

    // grabs the products from the product api given a certain page number
    function getProductsByName(page, name) {
        return $.ajax({
            url: "/product?page=" + page + "&search=" + name,
            method: "GET",
            dataType: "json",
            success: function (result, status) {
                console.log(result);
                return result;
            }
        }); //ajax
    }

    // grabs the products from the product api given a certain page number
    function getProductsByPrice(page, min, max) {
        return $.ajax({
            url: "/product?page=" + page + "&min=" + min + "&max=" + max,
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
                <td><p style="overflow:hidden; max-height: 4.9em">${product.info}</p></td>
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

    // Goes to the previous page
    $("#prevPage").on('click', function () {
        if (page == 0) {
            return;
        }
        
        switch(method) {
            case "explore":
                getProducts(page - 1).then((result) => {
                    if (result.success && Array.isArray(result.products) && result.products.length) {
                        $("#productContainer").empty();
                        page--;
                        result.products.forEach((product) => {
                            createFrameDiv(product);
                        });
                    }
                });
                break;
            case "searchByName":
                getProductsByName(page - 1, name).then((result) => {
                    if (result.success && Array.isArray(result.products) && result.products.length) {
                        $("#productContainer").empty();
                        page--;
                        result.products.forEach((product) => {
                            createFrameDiv(product);
                        });
                    }
                });
                break;
            case "searchByPrice":
                getProductsByPrice(page - 1, min, max).then((result) => {
                    if (result.success && Array.isArray(result.products) && result.products.length) {
                        $("#productContainer").empty();
                        page--;
                        result.products.forEach((product) => {
                            createFrameDiv(product);
                        });
                    }
                });
                break;
            default:
                console.log("Invalid search method");
                break;
          }
    });

    // Goes to the next page
    $("#nextPage").on('click', function () {
        switch(method) {
            case "explore":
                getProducts(page + 1).then((result) => {
                    if (result.success && Array.isArray(result.products) && result.products.length) {
                        $("#productContainer").empty();
                        page++;
                        result.products.forEach((product) => {
                            createFrameDiv(product);
                        });
                    }
                });
                break;
            case "searchByName":
                getProductsByName(page + 1, name).then((result) => {
                    if (result.success && Array.isArray(result.products) && result.products.length) {
                        $("#productContainer").empty();
                        page++;
                        result.products.forEach((product) => {
                            createFrameDiv(product);
                        });
                    }
                });
                break;
            case "searchByPrice":
                getProductsByPrice(page + 1, min, max).then((result) => {
                    if (result.success && Array.isArray(result.products) && result.products.length) {
                        $("#productContainer").empty();
                        page++;
                        result.products.forEach((product) => {
                            createFrameDiv(product);
                        });
                    }
                });
                break;
            default:
                console.log("Invalid search method");
                break;
        }
    });
});