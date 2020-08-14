
// navigation construction
const headers = $('.paragraph-header');
headers.each(function (i) {
    let nav_item = $("<li></li>")
        .addClass('navigation-item');
    let nav_a = $("<a></a>")
        .text(( this ).textContent);
    nav_item.append(nav_a);
    $("#navigation-menu").append(nav_item);
    nav_item.click(() => this.scrollIntoView())
});
