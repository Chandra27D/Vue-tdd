import App from './App.vue'
import { render, screen } from "@testing-library/vue";
import i18n from './locales/i18n'
import userEvent from '@testing-library/user-event'
import router from './routes/router'

describe("Routing", () => {

    const setup = async (path) => {
        render(App, {global: { plugins: [i18n, router] }});
        router.replace(path)
        await router.isReady();
    }

    it.each`
        path                | pageTestId
        ${"/"}              | ${"home-page"}
        ${"/signup"}        | ${"signup-page"}
        ${"/login"}         | ${"login-page"}
        ${"/user/1"}        | ${"user-page"}
        ${"/user/2"}        | ${"user-page"}
        ${"/activate/1234"} | ${"activation-page"}
        ${"/activate/5678"} | ${"activation-page"}
    `("displays $pageTestId at $path", async ({ path, pageTestId}) => {
        await setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
        path                | pageTestId
        ${"/"}              | ${"signup-page"}
        ${"/"}              | ${"login-page"}
        ${"/"}              | ${"user-page"}
        ${"/"}              | ${"activation-page"}
        ${"/signup"}        | ${"home-page"}
        ${"/signup"}        | ${"login-page"}
        ${"/signup"}        | ${"user-page"}
        ${"/signup"}        | ${"activation-page"}
        ${"/login"}         | ${"home-page"}
        ${"/login"}         | ${"signup-page"}
        ${"/login"}         | ${"user-page"}
        ${"/login"}         | ${"activation-page"}
        ${"/user/1"}        | ${"home-page"}
        ${"/user/1"}        | ${"login-page"}
        ${"/user/1"}        | ${"signup-page"}
        ${"/user/1"}        | ${"activation-page"}
        ${"/user/2"}        | ${"home-page"}
        ${"/user/2"}        | ${"login-page"}
        ${"/user/2"}        | ${"signup-page"}
        ${"/user/2"}        | ${"activation-page"}
        ${"/activate/1234"} | ${"home-page"}
        ${"/activate/1234"} | ${"signup-page"}
        ${"/activate/1234"} | ${"login-page"}
        ${"/activate/1234"} | ${"user-page"}

    `("does not display the $pageTestId page when at $path", async ( { path, pageTestId } ) =>{
        await setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument(); 
    });

    it.each`
        targetPage
        ${"Home"}
        ${"Sign Up"}
        ${"Login"}
    `("has link to the $targetPage on the Navbar", async ( { targetPage } ) =>{
        await setup('/');
        const link = screen.queryByRole('link', {name: targetPage});
        expect(link).toBeInTheDocument();
    });

    it.each`
        initialPath  | clickingTo   | visiblePage
        ${'/'}       | ${"Sign Up"} | ${"signup-page"}
        ${'/signup'} | ${"Home"}    | ${"home-page"}
        ${'/'}       | ${"Login"}         | ${"login-page"}
    `("displays the $visiblePage after clicking the $clickingTo link", async ({ initialPath, clickingTo, visiblePage }) => {
        await setup(initialPath);
        const link = screen.queryByRole('link', { name: clickingTo} );
        await userEvent.click(link);
        const page = await screen.findByTestId(visiblePage);
        expect(page).toBeInTheDocument();
    });

    it("displays the home page when clicking on the brand logo", async () => {
        await setup('/login');
        const image = screen.queryByAltText("Hoaxify Logo");
        await userEvent.click(image);
        const page = await screen.findByTestId("home-page");
        expect(page).toBeInTheDocument();
    });
});