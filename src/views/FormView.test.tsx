import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FormView } from "./Form";

const mockNavigate = jest.fn();

jest.mock("../App", () => ({
  useAppContext: () => ({
    user: {
      id: 1,
      role: "student",
    },
  }),
}));

jest.mock("../views/PdfCanvas", () => () => <div />);
jest.mock("../views/PdfMapper", () => () => <div />);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: {
      templateId: 1,
      userId: 1,
    },
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "en",
      changeLanguage: jest.fn(),
    },
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

function renderComponent() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="*" element={<FormView />} />
      </Routes>
    </MemoryRouter>
  );
}

const editableTemplate = {
  id: 1,
  title: "Test Form",
  statusId: 3,
  response: "",
  formFilledFields: [],
  formFields: [
    {
      id: 1,
      label: "Name",
      placeholder: "Enter name",
      type: "text",
    },
  ],
};

test("shows loading initially", () => {
  (fetch as jest.Mock).mockImplementation(
    () => new Promise(() => {})
  );

  renderComponent();

  expect(screen.queryByText("Test Form")).not.toBeInTheDocument();
});

test("renders form template", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => editableTemplate,
  });

  renderComponent();

  expect(await screen.findByText("Test Form"))
    .toBeInTheDocument();

  expect(screen.getByRole("textbox"))
    .toBeInTheDocument();
});

test("updates input value", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => editableTemplate,
  });

  renderComponent();

  const input = await screen.findByRole("textbox");

  await userEvent.type(input, "John");

  expect(input).toHaveValue("John");
});

test("submits form and navigates on success", async () => {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      json: async () => editableTemplate,
    })
    .mockResolvedValueOnce({
      ok: true,
    });

  renderComponent();

  const input = await screen.findByRole("textbox");

  await userEvent.type(input, "John");

  const submitButton = screen.getByRole("button", {
    name: "form.submit",
  });

  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(fetch).toHaveBeenLastCalledWith(
      "http://localhost:8080/form/send",
      expect.objectContaining({
        method: "POST",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

test("disables form when not editable", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    json: async () => ({
      ...editableTemplate,
      statusId: 1,
    }),
  });

  renderComponent();

  const input = await screen.findByRole("textbox");

  const submitButton = screen.getByRole("button", {
    name: "form.submit",
  });

  expect(input).toBeDisabled();
  expect(submitButton).toBeDisabled();
});