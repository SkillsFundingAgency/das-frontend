function JumpToScroll(ele) {
    ele.insertAdjacentHTML('afterend', '<a class="govuk-link govuk-link--no-visited-state app-back-to-top__link" href="#main-content"><svg role="presentation" focusable="false" class="app-back-to-top__icon" xmlns="http://www.w3.org/2000/svg" width="22" height="17" viewBox="0 0 22 17"><path fill="currentColor" d="M6.5 0L0 6.5 1.4 8l4-4v12.7h2V4l4.3 4L13 6.4z"></path></svg><span>Back to top</span></a>');

    function bottomP(){
        return ele.getBoundingClientRect().bottom + document.documentElement.scrollTop;
    }

    var jumpToTxt = ele.getAttribute('data-jumptoscrolltxt');
    if(jumpToTxt){
        ele.nextElementSibling.lastChild.innerHTML = jumpToTxt;
    }

    function findAncestor (el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }
    findAncestor(ele, 'govuk-grid-row').setAttribute('id', 'das-jump-'+jumpToTxt);
    ele.nextElementSibling.setAttribute('href', '#das-jump-'+jumpToTxt);//defaults to "null"

    function scrollFnt(bp) {
        if (document.body.scrollTop > bp || document.documentElement.scrollTop > bp) {
            ele.classList.add('das-show-jump-to-scroll');
        } else {
            ele.classList.remove('das-show-jump-to-scroll');
        }
    }

    window.onscroll = function() {scrollFnt(bottomP())};
}

export default JumpToScroll;