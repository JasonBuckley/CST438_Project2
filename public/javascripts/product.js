// filename: product.js
// abstract: this file contains event listeners and functions tied to the product page

$(document).ready(function () {
    $("#search-product").focus();
  
    // $("#search-btn").on("click", function () {
    //   // do something
    // });
  
    $("#back-to-top-btn").on("click", function () {
      backToTop();
    });
  
    $("#logo").on("click", function () {
      window.location.href = "/";
    });
  
    $("#logout-opt").on("click", logout);
  
  });
  
  // functions for revealing the back to top button and implementing the page scroll
  var topButton = document.getElementById("back-to-top-btn");
  
  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      topButton.style.display = "block";
    } else {
      topButton.style.display = "none";
    }
  }
  
  // When the user clicks on the button, scroll to the top of the document
  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  
  function logout() {
    $.ajax({
      type: "GET",
      url: "/users/logout",
      dataType: "json",
      success: function (status) {
        window.location.href = "/";
      },
      error: function (xhr, status, error) {
        err = eval("error: (" + xhr.responseText + ")");
        console.error(err);
      },
    });
  }

  $("#login-form").submit(function(event) {
    event.preventDefault(); 
    var post_url = $(this).attr("action"); 
    var request_method = $(this).attr("method"); 
    var form_data = $(this).serialize(); 
    
    $.ajax({
      url : post_url,
      type: request_method,
      data : form_data
    }).done(function(response) { 
      if (response.success == true) {
        window.location.href = "/";
      } else {
        $("#login-error").show();
      }
    });
  });
  
 
  

  
  
  
  