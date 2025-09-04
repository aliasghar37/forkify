import icons from "url:../../img/icons.svg";
import View from "./View.js";

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    _generateMarkup() {
        const curPage = this._data.page;
        const totalPages = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );
        const nextPage = `
            <button data-goto="${
                curPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
        const prevPage = `
            <button data-goto="${
                curPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
        `;

        // Page 1 and there are other pages.
        if (curPage === 1 && totalPages > 1) return nextPage;
        // Last page
        if (curPage === totalPages && totalPages > 1) return prevPage;
        // Other Page
        if (curPage < totalPages) {
            return prevPage + nextPage;
        }
        // Page 1 and there are no other pages
        return "";
    }

    addHandlerClick(handler) {
        this._parentElement.addEventListener("click", function (e) {
            const btn = e.target.closest(".btn--inline");
            if (!btn) return;
            const goToPage = Number(btn.dataset.goto);
            handler(goToPage);
        });
    }
}

export default new PaginationView();
