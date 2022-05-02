import { render, screen } from "@testing-library/vue";
import AccountActivationPage from "./AccountActivationPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer();
beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Account Activation Page", () => {
  const setup = (token) => {
    render(AccountActivationPage, {
      global: {
        mocks: {
          $route: {
            params: {
              token,
            },
          },
        },
      },
    });
  };

  let counter;
  beforeEach(() => {
    counter = 0;
    server.use(
      rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {

        if(req.params.token === "5678"){
            return res(
                ctx.status(400),
                ctx.json({message: "Activation failure"})
            )
        }

        counter += 1;
        return res(ctx.status(200));
      })
    );
  });

  it("displays the account activation success message when the token is correct", async () => {
    setup("1234");
    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();
  });

  it("sends the activation request to the backend", async () => {
    setup("1234");
    await screen.findByText("Account is activated");
    expect(counter).toBe(1);
  });

  it("displays the account failure message when the token doesnot matches the correct request", async () => {
    setup("5678");
    const message = await screen.findByText("Activation failure");
    expect(message).toBeInTheDocument();
  });

  it("displays spinner when the api call is in progress", async () => {
      setup("1234");
      const spinner = await screen.findByRole('status');
      expect(spinner).toBeInTheDocument();
      await screen.findByText("Account is activated");
      expect(spinner).not.toBeInTheDocument();
  })
});
