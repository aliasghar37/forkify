import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SECONDS } from "./config.js";
import { getJson } from "./helpers.js";

// if (module.hot) {
//     module.hot.accept();
// }

// ///---> 1) Searching recipe
const controlRecipe = async function () {
    try {
        const id = window.location.hash.slice(1);
        // console.log(id);

        if (!id) {
            recipeView.renderWelcomeMessage();
            return;
        }
        recipeView.renderSpinner();

        // 0) update results view to mark as selected search result
        resultsView.update(model.getSearchResultPage());

        // 1) updating the bookmarks
        bookmarksView.update(model.state.bookmarks);

        // 2) Loading Recipe
        await model.loadRecipe(id);

        // 3) Rendering Recipe
        recipeView.render(model.state.recipe);
    } catch (error) {
        recipeView.renderError();
    }
};

// ///---> 2) Search Recipe List

const controlSearchResults = async function () {
    try {
        // 1) Get search query
        const query = searchView.getQuery();
        resultsView.renderSpinner();
        if (query === "") {
            resultsView.renderError();
            return;
        }
        if (!query) return;
        // 2) Load search results
        await model.loadSearchResults(query);
        // 3) Render Search results
        resultsView.render(model.getSearchResultPage(1));
        // 4) Render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (error) {
        console.log(error);
    }
};

const controlPagination = function (goToPage) {
    // 1) Render new Search results
    resultsView.render(model.getSearchResultPage(goToPage));
    // 2) Render new initial pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    // update the recipe servings in the state
    model.updateServings(newServings);
    // update the recipe view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
    // Add OR Remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.removeBookmark(model.state.recipe.id);

    // Update the recipe view
    recipeView.update(model.state.recipe);

    // Render the bookmarks
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
        // // show loading spinner
        addRecipeView.renderSpinner();

        // upload the new recipe data
        await model.uploadRecipe(newRecipe);

        // render recipe
        recipeView.render(model.state.recipe);

        // // display a recipe upload success message
        addRecipeView.renderMessage();

        // add to bookmarks
        bookmarksView.render(model.state.bookmarks);

        // change id in the url (without reloading the page)
        window.history.pushState(null, "", `#${model.state.recipe.id}`);

        // close form opened window
        setTimeout(function () {
            addRecipeView.toggleWindow();
            addRecipeView.resetForm();
        }, MODAL_CLOSE_SECONDS * 1000);
    } catch (error) {
        console.error("💥💥💥 " + error);
        addRecipeView.renderError(error.message);
    }
};

const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
