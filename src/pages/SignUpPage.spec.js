import SignUpPage from "./SignUpPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../locales/i18n";
import en from "../locales/en.json";
import tr from "../locales/tr.json";
import LanguageSelector from "../components/LanguageSelector.vue";
// import axios from 'axios'
// import "whatwg-fetch"

let requestBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    acceptLanguageHeader = req.headers.get('Accept-Language');
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());
beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});
afterAll(() => server.close());

describe("Sign Up Page", () => {
  describe("Layout", () => {
    const setup = () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
    };

    it("has Sign Up Header", () => {
      setup();
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      // expect(header).not.toBeNull(); when jest-dom imported we can use the below code
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      setup();
      const input = screen.queryByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      setup();
      const input = screen.queryByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      setup();
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      setup();
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });

    it("has confirm password input", () => {
      setup();
      const input = screen.queryByLabelText("Confirm Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for confirm password input", () => {
      setup();
      const input = screen.queryByLabelText("Confirm Password");
      expect(input.type).toBe("password");
    });

    it("has Sign Up Button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });

    it("has Sign Up Button disabled initially", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let button, passwordInput, confirmPasswordInput, usernameInput;
    const setup = async () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("E-mail");
      passwordInput = screen.queryByLabelText("Password");
      confirmPasswordInput = screen.queryByLabelText("Confirm Password");
      button = screen.queryByRole("button", { name: "Sign Up" });
      await userEvent.type(usernameInput, "user1");
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(confirmPasswordInput, "P4ssword");
    };

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it("enables the input button when the password and the confirm password fields matches", async () => {
      await setup();

      expect(button).toBeEnabled();
    });

    it("sends username, email and password to backend after clicking the button", async () => {
      server.listen();
      await setup();
      /* Using msw mocking instead of these 2 methods
            const mockFn = jest.fn();
            // axios.post = mockFn;
            window.fetch = mockFn;
            */
      await userEvent.click(button);
      await screen.findByText(
        "Please check your email to activate your account"
      );

      /*
            const firstCall = mockFn.mock.calls[0];
            // const body = firstCall[1];
            const body = JSON.parse(firstCall[1].body); // the second parameter of the firstCall is an object and we need the body property of that object. Moreover, it is an stringified object so, we will need to parse it.
            */
      // expect(body).toEqual({
      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });
    it("does not allow the click event when an api call is ongoing", async () => {
      await setup();
      await userEvent.click(button);
      await userEvent.click(button);
      await screen.findByText(
        "Please check your email to activate your account"
      );
      expect(counter).toBe(1);
    });

    it("displays the spinner while an api request is ongoing", async () => {
      await setup();
      await userEvent.click(button);
      const spinner = screen.queryByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("hides the spinner when there is no api request", async () => {
      await setup();
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });

    it("displays the confirmation text after the successful sign-up", async () => {
      await setup();
      await userEvent.click(button);
      const confText = await screen.findByText(
        "Please check your email to activate your account"
      );
      expect(confText).toBeInTheDocument();
    });

    it("does not display the confirmation message before the sign-up", async () => {
      await setup();
      const confText = screen.queryByText(
        "Please check your email to activate your account"
      );
      expect(confText).not.toBeVisible();
    });

    it("does not display the confirmation text after the failing sign-up", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );
      await setup();
      await userEvent.click(button);
      const confText = await screen.queryByText(
        "Please check your email to activate your account"
      );
      expect(confText).not.toBeVisible();
    });

    it("hides the sign up form after a successful sign up", async () => {
      await setup();
      const form = screen.queryByTestId("form-sign-up");
      await userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeVisible();
      });
    });

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `(
      "displays the $message message for the field $field",
      async ({ field, message }) => {
        server.use(generateValidationError(field, message));
        await setup();
        await userEvent.click(button);
        const text = await screen.findByText(message);
        expect(text).toBeInTheDocument();
      }
    );

    it("hides the spinner after the error response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();
      await userEvent.click(button);
      await screen.findByText("Username cannot be null");
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });

    it("enables the button after the error response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();
      await userEvent.click(button);
      await screen.findByText("Username cannot be null");
      expect(button).toBeEnabled();
    });

    it("shows the error message when the password and confirm password mismatch", async () => {
      await setup();
      await userEvent.type(passwordInput, "P4ss1");
      await userEvent.type(confirmPasswordInput, "P4ss2");
      const text = await screen.findByText("Password Mismatch");
      expect(text).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears the error message after the field $field is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        await setup();
        await userEvent.click(button);
        const text = await screen.findByText(message);
        const input = await screen.queryByLabelText(label);
        await userEvent.type(input, "updated");
        expect(text).not.toBeInTheDocument();
      }
    );
  });

  describe("Internationalization", () => {
    let turkishLanguage, englishLanguage, username, email, password, confirmPassword, button;
    const setup = () => {
      const app = {
        components: {
          SignUpPage,
          LanguageSelector,
        },
        template: `
          <SignUpPage />
          <LanguageSelector /> 
        `,
      };

      render(app, {
        global: {
          plugins: [i18n],
        },
      });
      turkishLanguage = screen.queryByTitle("Turkish");
      englishLanguage = screen.queryByTitle("English");
      username = screen.queryByLabelText(en.username);
      email = screen.queryByLabelText(en.email);
      password = screen.queryByLabelText(en.password);
      confirmPassword = screen.queryByLabelText(en.confirmPassword);
      button = screen.queryByRole("button", {name: en.signUp})
    };

    it("initially displays English texts", async () => {
      setup();
      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.confirmPassword)).toBeInTheDocument();
    });

    it("displays all text in Turkish after selecting the language ", async () => {
      setup();
      await userEvent.click(turkishLanguage);
      expect(
        screen.queryByRole("heading", { name: tr.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: tr.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(tr.confirmPassword)).toBeInTheDocument();
    });
    it("displays all text in English after page is translated back", async () => {
      setup();
      await userEvent.click(englishLanguage);
      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.confirmPassword)).toBeInTheDocument();
    });

    it("displays the password mismatch validation error in turkish", async () => {
      setup();
      await userEvent.click(turkishLanguage);
      await userEvent.type(password, "P4ssword");
      await userEvent.type(confirmPassword, "N3wP4ss");
      const validation = screen.queryByText(tr.passwordMismatchValidation);
      expect(validation).toBeInTheDocument();
    });

    it('sends the accept-language having en to the backend for sign up request', async () => {
      setup();
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(confirmPassword, "P4ssword");
      await userEvent.click(button); 
      await screen.findByText(
        "Please check your email to activate your account"
      );
      expect(acceptLanguageHeader).toBe("en");
    });
    
    it('sends the accept-language having tr after the language is changed', async () => {
      setup();
      await userEvent.click(turkishLanguage);
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(confirmPassword, "P4ssword");
      await userEvent.click(button); 
      await screen.findByText(tr.accountActivationNotification);
      expect(acceptLanguageHeader).toBe("tr");
    });
    it('displays the account activation notification in turkish when the language is selected', async () => {
      setup();
      await userEvent.click(turkishLanguage);
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(confirmPassword, "P4ssword");
      await userEvent.click(button); 
      const accountActivation =  await screen.findByText(tr.accountActivationNotification);
      expect(accountActivation).toBeInTheDocument();
    });
  });
});
