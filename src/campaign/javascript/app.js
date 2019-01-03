$(function() {
  $(window).on("scroll", function() {
    if($(window).scrollTop() > 50) {
      $(".header").addClass("header--active");
    } else {
      $(".header").removeClass("header--active");
    }
  });
});