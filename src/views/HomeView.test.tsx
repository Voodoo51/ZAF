import { render, screen, waitFor } from "@testing-library/react";
import { HomeView } from "./Home";

const mockUseFilter = jest.fn();
const mockTiles = jest.fn();

jest.mock("../App", () => ({
  useAppContext: () => ({
    user: {
      id: 1,
      role: "student",
    },
    search: "",
  }),
  useFilter: () => mockUseFilter(),
}));

jest.mock("react-router-dom", () => ({
  useLocation: () => ({
    state: {},
  }),
}));

jest.mock("../utils/Tiles", () => ({
  Tiles: ({ tiles }: any) => {
    mockTiles(tiles);

    return (
      <div data-testid="tiles">
        {tiles.map((tile: any) => (
          <div key={tile.id}>{tile.templateTitle}</div>
        ))}
      </div>
    );
  },

  PrivilegedTiles: () => <div data-testid="privileged-tiles" />,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("HomeView", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFilter.mockReturnValue({
      filterId: -1,
    });
  });

  it("renders title", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
        totalPages: 1,
      }),
    }) as any;

    render(<HomeView />);

    expect(screen.getByText("home.title")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("fetches and renders forms", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          {
            id: 1,
            templateId: 10,
            statusId: 1,
            templateTitle: "Leave Request",
            sentAt: null,
          },
          {
            id: 2,
            templateId: 11,
            statusId: 2,
            templateTitle: "Vacation Form",
            sentAt: null,
          },
        ],
        totalPages: 1,
      }),
    }) as any;

    render(<HomeView />);

    expect(await screen.findByText("Leave Request")).toBeInTheDocument();
    expect(screen.getByText("Vacation Form")).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/form/sent?page=0&size=10",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      })
    );
  });

  it("filters tiles based on filterId", async () => {
    mockUseFilter.mockReturnValue({
      filterId: 1,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          {
            id: 1,
            templateId: 10,
            statusId: 1,
            templateTitle: "Accepted Form",
            sentAt: null,
          },
          {
            id: 2,
            templateId: 11,
            statusId: 2,
            templateTitle: "Pending Form",
            sentAt: null,
          },
        ],
        totalPages: 1,
      }),
    }) as any;

    render(<HomeView />);

    expect(await screen.findByText("Accepted Form")).toBeInTheDocument();
    expect(screen.queryByText("Pending Form")).not.toBeInTheDocument();
  });

  it("handles fetch errors gracefully", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API error")) as any;

    render(<HomeView />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(screen.getByText("home.title")).toBeInTheDocument();
  });
});