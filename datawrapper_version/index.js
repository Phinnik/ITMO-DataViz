$(window).on('load', function () {

    // navigation construction
    const paragraphPositions = [];

    $('.paragraph-container').each(function () {

        let bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.getBoundingClientRect(),
            offset = elemRect.top - bodyRect.top;

        paragraphPositions.push(offset);
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
            } else if (currentParagraphIndex !== i && currentScreenY > paragraphPositions[paragraphPositions.length - 1]) {
                $(`.navigation-item:eq(${currentParagraphIndex})`).toggleClass('navigation-item-current');
                $(`.navigation-item:eq(${i})`).toggleClass('navigation-item-current');
                currentParagraphIndex = i;
            }

        }
    });
    // _________________________________________________________________________________________________________________
    // _________________________________________________________________________________________________________________

    // generating empty space
    console.log(paragraphPositions[paragraphPositions.length - 1])
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = $('.state--empty-space')[0].getBoundingClientRect(),
        offset = elemRect.top - bodyRect.top;

    let emptySpaceHeight = screen.availHeight - (offset - paragraphPositions[paragraphPositions.length - 1]);

    console.log(emptySpaceHeight);
    $('.state--empty-space').css('height', `${emptySpaceHeight}px`);

    'state--empty-space'
    // _________________________________________________________________________________________________________________
    // _________________________________________________________________________________________________________________


    // image scaling
    $('.paragraph--img').click(function () {

        let modalImg = document.createElement('img')
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        modalImg.className = 'modal--content';

        $('.modal')
            .append(modalImg)
            .fadeIn(200);
    })

    $('.modal').click(function () {
        $(this).children('img').remove();
        $(this).fadeOut(200);
    });


    $(document).keydown((key) => {
        if (key.keyCode === 27) {
            $('.modal')
                .children('img')
                .remove();
            $('.modal').fadeOut(200);
            console.log(key.keyCode)
        }
    });

    // _________________________________________________________________________________________________________________
    // _________________________________________________________________________________________________________________


})
