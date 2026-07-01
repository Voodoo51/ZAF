import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { PaymentsView } from "./Payments";

const mockUser = {
  id: 1,
};

jest.mock("../App", () => ({
  useAppContext: () => ({
    user: mockUser,
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("PaymentsView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading initially", () => {
    global.fetch = jest.fn(
      () =>
        new Promise(() => {
          // never resolves
        })
    ) as any;

    render(<PaymentsView />);

    expect(screen.getByText("common.loading")).toBeInTheDocument();
  });

  it("renders empty message when no payments exist", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as any;

    render(<PaymentsView />);

    expect(await screen.findByText("paymentView.empty")).toBeInTheDocument();
  });

  it("renders fetched payments", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          paymentStatus: {
            id: 2,
            name: "paid",
          },
          title: "Invoice #1",
          description: "Test payment",
          amount: 5000,
        },
      ],
    }) as any;

    render(<PaymentsView />);

    expect(await screen.findByText("Invoice #1")).toBeInTheDocument();

    // If the description is visible, keep this assertion.
    // Remove it if the component hides it until hover.
    expect(screen.getByText("Test payment")).toBeInTheDocument();

    expect(screen.getByText("50.00 PLN")).toBeInTheDocument();
    expect(screen.getByText("paymentStatus.paid")).toBeInTheDocument();
  });

  it("sends payment request and redirects on click", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            paymentStatus: {
              id: 1,
              name: "pending",
            },
            title: "Invoice",
            description: "desc",
            amount: 1000,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          redirectUrl: "http://stripe.com/checkout",
        }),
      });

    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        href: "",
      },
    });

    render(<PaymentsView />);

    const payButton = await screen.findByRole("button", {
      name: "paymentView.pay",
    });

    fireEvent.click(payButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);

      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        "http://localhost:8080/payment/pay",
        expect.objectContaining({
          method: "POST",
        })
      );

      expect(window.location.href).toBe(
        "http://stripe.com/checkout"
      );
    });
  });

  it("handles fetch errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API error")) as any;

    render(<PaymentsView />);

    expect(await screen.findByText("paymentView.empty")).toBeInTheDocument();
  });
});