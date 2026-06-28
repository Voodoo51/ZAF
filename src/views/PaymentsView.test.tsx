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
        
        })
    ) as any;

    render(<PaymentsView />);

    expect(screen.getByText("common.loading")).toBeInTheDocument();
  });

  it("renders empty message when no payments exist", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    }) as any;

    render(<PaymentsView />);

    expect(await screen.findByText("payments.empty"))
      .toBeInTheDocument();
  });

  it("renders fetched payments", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
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
        ]),
    }) as any;

    render(<PaymentsView />);

    expect(await screen.findByText("Invoice #1"))
      .toBeInTheDocument();

    expect(screen.getByText("Test payment"))
      .toBeInTheDocument();

    expect(screen.getByText("50.00 PLN"))
      .toBeInTheDocument();

    expect(screen.getByText("paymentStatus.paid"))
      .toBeInTheDocument();
  });

  it("sends payment request and redirects on click", async () => {
    global.fetch = jest
      .fn()
      // first fetch -> list payments
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              paymentStatus: { id: 1, name: "pending" },
              title: "Invoice",
              description: "desc",
              amount: 1000,
            },
          ]),
      })
      // second fetch -> pay
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            redirectUrl: "http://stripe.com/checkout",
          }),
      });

    delete (window as any).location;

    (window as any).location = {
      href: "",
    };

    render(<PaymentsView />);

    const paymentCard = await screen.findByText("Invoice");

    fireEvent.click(paymentCard);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);

      expect(global.fetch).toHaveBeenLastCalledWith(
        "http://localhost:8080/payment/pay",
        expect.objectContaining({
          method: "POST",
        })
      );

      expect(window.location.href)
        .toBe("http://stripe.com/checkout");
    });
  });

  it("handles fetch errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API error")) as any;

    render(<PaymentsView />);

    expect(await screen.findByText("payments.empty"))
      .toBeInTheDocument();
  });
});