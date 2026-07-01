import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentsAdminView } from "./PaymentsAdmin";

const mockParams = {
    userId: "1"
};

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => mockParams
}));

jest.mock("../App", () => ({
    useAppContext: () => ({
        user: {
            id: 1,
            role: "admin"
        }
    })
}));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

const userData = {
    name: "John",
    surname: "Smith"
};

const payments = [
    {
        id: 1,
        paymentStatus: {
            id: 0,
            name: "unpaid"
        },
        title: "Invoice 1",
        description: "First payment",
        amount: 1500
    }
];

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
});

function mockInitialFetch(paymentData: any = payments) {
    (fetch as jest.Mock)
        .mockResolvedValueOnce({
            json: async () => userData
        })
        .mockResolvedValueOnce({
            json: async () => paymentData
        });
}

describe("PaymentsAdminView", () => {

    test("shows loading initially", () => {
        (fetch as jest.Mock).mockImplementation(
            () => new Promise(() => {})
        );

        render(<PaymentsAdminView />);

        expect(
            screen.getByText("common.loading")
        ).toBeInTheDocument();
    });

    test("fetches user and payments", async () => {
        mockInitialFetch();

        render(<PaymentsAdminView />);

        expect(
            await screen.findByText(
                /John Smith/
            )
        ).toBeInTheDocument();

        expect(fetch).toHaveBeenNthCalledWith(
            1,
            "http://localhost:8080/user/1",
            expect.objectContaining({
                method: "GET"
            })
        );

        expect(fetch).toHaveBeenNthCalledWith(
            2,
            "http://localhost:8080/payment/all/1",
            expect.objectContaining({
                method: "GET"
            })
        );
    });

    test("renders empty message", async () => {
        mockInitialFetch([]);

        render(<PaymentsAdminView />);

        expect(
            await screen.findByText(
                "paymentView.empty"
            )
        ).toBeInTheDocument();
    });

    test("renders fetched payment", async () => {
        mockInitialFetch();

        render(<PaymentsAdminView />);

        expect(
            await screen.findByText("Invoice 1")
        ).toBeInTheDocument();

        expect(
            screen.getByText("First payment")
        ).toBeInTheDocument();

        expect(
            screen.getByText("15.00 PLN")
        ).toBeInTheDocument();

        expect(
            screen.getByText("paymentStatus.unpaid")
        ).toBeInTheDocument();
    });

    test("opens create payment form", async () => {
        mockInitialFetch();

        render(<PaymentsAdminView />);

        await screen.findByText("Invoice 1");

        await userEvent.click(
            screen.getByRole("button", {
                name: "paymentView.add"
            })
        );

        expect(
            screen.getByPlaceholderText(
                "paymentView.title"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(
                "paymentView.description"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(
                "0.00 PLN"
            )
        ).toBeInTheDocument();
    });

    test("validates create payment form", async () => {
        mockInitialFetch();

        render(<PaymentsAdminView />);

        await screen.findByText("Invoice 1");

        await userEvent.click(
            screen.getByRole("button", {
                name: "paymentView.add"
            })
        );

        await userEvent.click(
            screen.getByRole("button", {
                name: "common.confirm"
            })
        );

        expect(
            await screen.findByText(
                "inputErrors.emptyPaymentTitle"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "inputErrors.emptyPaymentValue"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "inputErrors.emptyPaymentDescription"
            )
        ).toBeInTheDocument();
    });

    test("creates payment successfully", async () => {
        mockInitialFetch();

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 2,
                paymentStatus: {
                    id: 0,
                    name: "unpaid"
                },
                title: "Invoice 2",
                description: "Created payment",
                amount: 2500
            })
        });

        render(<PaymentsAdminView />);

        await screen.findByText("Invoice 1");

        await userEvent.click(
            screen.getByRole("button", {
                name: "paymentView.add"
            })
        );

        await userEvent.type(
            screen.getByPlaceholderText(
                "paymentView.title"
            ),
            "Invoice 2"
        );

        await userEvent.type(
            screen.getByPlaceholderText(
                "paymentView.description"
            ),
            "Created payment"
        );

        await userEvent.type(
            screen.getByPlaceholderText(
                "0.00 PLN"
            ),
            "25"
        );

        await userEvent.click(
            screen.getByRole("button", {
                name: "common.confirm"
            })
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenLastCalledWith(
                "http://localhost:8080/payment/create",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        userId: 1,
                        title: "Invoice 2",
                        description: "Created payment",
                        amount: 2500
                    })
                })
            );
        });

        expect(
            await screen.findByText("Invoice 2")
        ).toBeInTheDocument();
    });
});