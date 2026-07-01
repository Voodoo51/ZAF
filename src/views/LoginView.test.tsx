import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginView } from "./Login";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
const mockSetUser = jest.fn();
const mockChangeLanguage = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../App", () => ({
  useAppContext: () => ({
    user: null,
    setUser: mockSetUser,
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();

  global.fetch = jest.fn();

  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      href: "",
    },
  });
});

function renderComponent() {
  return render(
    <MemoryRouter>
      <LoginView />
    </MemoryRouter>
  );
}

test("renders login form", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => null,
  });

  renderComponent();

  expect(
    screen.getByPlaceholderText("login.login")
  ).toBeInTheDocument();

  expect(
    screen.getByPlaceholderText("login.password")
  ).toBeInTheDocument();

  expect(
    screen.getByText("login.signIn")
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
  });
});

test("calls auth/me on mount", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => ({
      id: 1,
      email: "test@test.com",
    }),
  });

  renderComponent();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/auth/me",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      })
    );
  });

  expect(mockSetUser).toHaveBeenCalled();
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("updates email and password inputs", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => null,
  });

  renderComponent();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
  });

  const email = screen.getByPlaceholderText("login.login");
  const password = screen.getByPlaceholderText("login.password");

  await userEvent.type(email, "john@test.com");
  await userEvent.type(password, "123456");

  expect(email).toHaveValue("john@test.com");
  expect(password).toHaveValue("123456");
});

test("logs in and loads user", async () => {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      json: async () => null,
    }) // auth/me on mount
    .mockResolvedValueOnce({
      ok: true,
    }) // login
    .mockResolvedValueOnce({
      json: async () => ({
        id: 1,
        email: "john@test.com",
      }),
    }); // auth/me after login

  renderComponent();

  const email = screen.getByPlaceholderText("login.login");
  const password = screen.getByPlaceholderText("login.password");

  await userEvent.type(email, "john@test.com");
  await userEvent.type(password, "123");

  await userEvent.click(
    screen.getByRole("button", {
      name: "login.signIn",
    })
  );

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "john@test.com",
          password: "123",
        }),
      })
    );
  });

  await waitFor(() => {
    expect(mockSetUser).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

test("sets user null when login fails", async () => {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      json: async () => null,
    })
    .mockResolvedValueOnce({
      ok: false,
    });

  renderComponent();

 await userEvent.click(
  screen.getByRole("button", {
    name: "login.signIn",
  })
);

await waitFor(() => {
  expect(mockSetUser).toHaveBeenCalledWith(null);

  expect(
    screen.getByText("inputErrors.wrongLogin")
  ).toBeInTheDocument();
});
});

test("redirects to github oauth", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => null,
  });

  renderComponent();

  await userEvent.click(
    screen.getByRole("button", {
      name: "login.signInWithGitHub",
    })
  );

  expect(window.location.href).toBe(
    "http://localhost:8080/auth/github/oauth"
  );
});

test("changes language", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => null,
  });

  renderComponent();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
  });

  await userEvent.click(
    screen.getByTitle("Polski")
  );

  expect(mockChangeLanguage).toHaveBeenCalledWith("pl");

  await userEvent.click(
    screen.getByTitle("English")
  );

  expect(mockChangeLanguage).toHaveBeenCalledWith("en");
});