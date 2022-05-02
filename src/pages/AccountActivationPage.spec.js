import { render, screen } from "@testing-library/vue";
import AccountActivationPage from './AccountActivationPage.vue';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer();
beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Account Activation Page', () => {

    const setup = (token) => {
        render(AccountActivationPage, {
            global: {
                mocks: {
                    $route: {
                        params: {
                            token
                        }
                    }
                }
            }
        });
    }

    let counter;
    beforeEach(() => {
        counter = 0;
        server.use(
            rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
                counter += 1;
                return res(ctx.status(200))
            })
        )
    })

    it('displays the account activation success message when the token is correct', async () => {
        setup("1234");
        const message = await screen.findByText("Account is activated");
        expect(message).toBeInTheDocument();
    });

    it('sends the activation request to the backend', async () => {
        setup("1234");
        await screen.findByText("Account is activated");
        expect(counter).toBe(1);
    });
})