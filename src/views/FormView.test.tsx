import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FormView } from "./Form";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ templateId: "1" })
}));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: () => Promise.resolve()
        }
    })
}));

beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
});

function renderComponent() {
    return render(
        <MemoryRouter initialEntries={["/form/1"]}>
            <Routes>
                <Route
                    path="/form/:templateId"
                    element={<FormView />}
                />
            </Routes>
        </MemoryRouter>
    );
}

const editableTemplate = {
    id: 1,
    title: "Test Form",
    statusId: 3,
    formFields: [
        {
            id: 1,
            label: "Name",
            placeholder: "Enter name"
        }
    ]
};

test("shows loading initially", () => {
    (fetch as jest.Mock).mockImplementation(
        () => new Promise(() => {})
    );

    renderComponent();

    expect(
        screen.getByText(/loading/i)
    ).toBeInTheDocument();
});

test("renders form template", async () => {
    (fetch as jest.Mock).mockResolvedValue({
        json: async () => editableTemplate
    });

    renderComponent();

    expect(
        await screen.findByText("Test Form")
    ).toBeInTheDocument();

    // Prefer role over label until component label association is fixed
    expect(
        screen.getByRole("textbox")
    ).toBeInTheDocument();
});

test("updates input value", async () => {
    (fetch as jest.Mock).mockResolvedValue({
        json: async () => editableTemplate
    });

    renderComponent();

    const input =
        await screen.findByRole("textbox");

    await userEvent.type(input, "John");

    expect(input).toHaveValue("John");
});

test("submits form and navigates on success", async () => {
    (fetch as jest.Mock)
        .mockResolvedValueOnce({
            json: async () => editableTemplate
        })
        .mockResolvedValueOnce({
            ok: true
        });

    renderComponent();

    const input =
        await screen.findByRole("textbox");

    await userEvent.type(input, "John");

    const button =
        screen.getByRole("button");

    await userEvent.click(button);

    await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:8080/form/send",
            expect.objectContaining({
                method: "POST"
            })
        );

        expect(
            mockNavigate
        ).toHaveBeenCalledWith("/");
    });
});

test("disables form when not editable", async () => {
    (fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
            ...editableTemplate,
            statusId: 1
        })
    });

    renderComponent();

    const input =
        await screen.findByRole("textbox");

    const button =
        screen.getByRole("button");

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
});

