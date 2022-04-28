import App from './App.vue'
import { render, screen } from "@testing-library/vue";
import i18n from './locales/i18n'

describe("Routing", () => {

    const setup = (path) => {
        window.history.pushState({}, "", path)
        render(App, {global: { plugins: [i18n] }});
    }

    it.each`
        path         | pageTestId
        ${"/"}       | ${"home-page"}
        ${"/signup"} | ${"signup-page"}
        ${"/login"}  | ${"login-page"}
        ${"/user/1"} | ${"user-page"}
        ${"/user/2"} | ${"user-page"}
    `("displays $pageTestId at $path", ({ path, pageTestId}) => {
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
        path         | pageTestId
        ${"/"}       | ${"signup-page"}
        ${"/"}       | ${"login-page"}
        ${"/"}       | ${"user-page"}
        ${"/signup"} | ${"home-page"}
        ${"/signup"} | ${"login-page"}
        ${"/signup"} | ${"user-page"}
        ${"/login"}  | ${"home-page"}
        ${"/login"}  | ${"signup-page"}
        ${"/login"}  | ${"user-page"}
        ${"/user/1"} | ${"home-page"}
        ${"/user/1"} | ${"login-page"}
        ${"/user/1"} | ${"signup-page"}
        ${"/user/2"} | ${"home-page"}
        ${"/user/2"} | ${"login-page"}
        ${"/user/2"} | ${"signup-page"}
    `("does not display the $pageTestId page when at $path", ( { path, pageTestId } ) =>{
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument(); 
    });
});