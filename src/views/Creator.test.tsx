import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatorView } from "./Creator";

const mockT = jest.fn((key) => key);

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: mockT
    })
}));

beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();

    Object.defineProperty(window, "location", {
        configurable: true,
        value: {
            ...window.location,
            href: ""
        }
    });

    jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

function renderComponent() {
    return render(<CreatorView />);
}

test("renders creator view", () => {
    renderComponent();

    expect(
        screen.getAllByRole("textbox")
            .length
    ).toBeGreaterThan(0);

    expect(
        screen.getAllByRole("button")
            .length
    ).toBeGreaterThan(0);
});

test("updates form title", async () => {
    renderComponent();

    const titleInput =
        screen.getAllByRole(
            "textbox"
        )[0];

    await userEvent.type(
        titleInput,
        "Registration Form"
    );

    expect(titleInput)
        .toHaveValue(
            "Registration Form"
        );
});

test("adds input row", async () => {
    renderComponent();

    const before =
        screen.getAllByRole(
            "textbox"
        ).length;

    const addButton =
        screen
            .getAllByRole(
                "button"
            )
            .find(
                (b) =>
                    b.textContent === "+"
            );

    await userEvent.click(
        addButton!
    );

    expect(
        screen.getAllByRole(
            "textbox"
        ).length
    ).toBeGreaterThan(
        before
    );
});

test("updates label and placeholder", async () => {
    renderComponent();

    const inputs =
        screen.getAllByRole(
            "textbox"
        );

    const label =
        inputs[1];

    const placeholder =
        inputs[2];

    await userEvent.type(
        label,
        "Name"
    );

    await userEvent.type(
        placeholder,
        "Enter name"
    );

    expect(label)
        .toHaveValue(
            "Name"
        );

    expect(
        placeholder
    ).toHaveValue(
        "Enter name"
    );
});

test("changes select value", async () => {
    renderComponent();

    const select =
        screen.getByRole(
            "combobox"
        );

    await userEvent.selectOptions(
        select,
        "email"
    );

    expect(
        select
    ).toHaveValue(
        "email"
    );
});

test("removes row", async () => {
    renderComponent();

    const remove =
        screen
            .getAllByRole(
                "button"
            )
            .find(
                (b) =>
                    b.textContent === "-"
            );

    await userEvent.click(
        remove!
    );

    expect(
        screen.queryByRole(
            "combobox"
        )
    ).not.toBeInTheDocument();
});

test("saves form successfully", async () => {
    (fetch as jest.Mock)
        .mockResolvedValue({
            ok: true
        });

    renderComponent();

    const saveButton =
        screen
            .getAllByRole(
                "button"
            )
            .at(-1)!;

    await userEvent.click(
        saveButton
    );

    await waitFor(() => {
        expect(fetch)
            .toHaveBeenCalledWith(
                "http://localhost:8080/form/create",
                expect.objectContaining({
                    method:
                        "POST"
                })
            );
    });

    expect(
        window.location.href
    ).toBe("/");
});

test("logs error on failed save", async () => {
    (fetch as jest.Mock)
        .mockResolvedValue({
            ok: false
        });

    renderComponent();

    const saveButton =
        screen
            .getAllByRole(
                "button"
            )
            .at(-1)!;

    await userEvent.click(
        saveButton
    );

    await waitFor(() => {
        expect(
            console.error
        ).toHaveBeenCalled();
    });
});

test("handles fetch exception", async () => {
    (fetch as jest.Mock)
        .mockRejectedValue(
            new Error(
                "network"
            )
        );

    renderComponent();

    const saveButton =
        screen
            .getAllByRole(
                "button"
            )
            .at(-1)!;

    await userEvent.click(
        saveButton
    );

    await waitFor(() => {
        expect(
            console.error
        ).toHaveBeenCalled();
    });
});
