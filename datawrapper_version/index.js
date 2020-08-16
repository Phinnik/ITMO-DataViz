$(document).ready(function () {

    // navigation construction
    const paragraphPositions = [];

    $('.paragraph-container').each(function () {
        paragraphPositions.push(($(this).offset().top));
        let headerText = $(this).children('.paragraph-header')[0].textContent;

        let nav_item = $("<li></li>")
            .addClass('navigation-item');
        let nav_a = $("<a></a>")
            .text(headerText);
        nav_item.append(nav_a);
        $("#navigation-menu").append(nav_item);
        nav_item.click(() => this.scrollIntoView())
    });


    let currentParagraphIndex = 0;
    $(`.navigation-item:eq(${currentParagraphIndex})`).toggleClass('navigation-item-current');


    $(document).scroll(function () {
        const currentScreenY = document.documentElement.scrollTop;

        for (let i = 0; i < paragraphPositions.length; i++) {
            if (currentParagraphIndex !== i && paragraphPositions[i] <= currentScreenY && currentScreenY <= paragraphPositions[i + 1] - 20) {
                $(`.navigation-item:eq(${currentParagraphIndex})`).toggleClass('navigation-item-current');
                $(`.navigation-item:eq(${i})`).toggleClass('navigation-item-current');
                currentParagraphIndex = i;

            }
        }

    })


})



