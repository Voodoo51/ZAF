import { render, screen, waitFor } from "@testing-library/react";
import { HomeView } from "./Home";

const mockUseFilter = jest.fn();
const mockTiles = jest.fn();

jest.mock("../App", () => ({
  useAppContext: () => ({
    user: { id: 1 },
  }),
  useFilter: () => mockUseFilter(),
}));

jest.mock("../utils/Tiles", () => ({
  Tiles: ({ tiles }: any) => {
    mockTiles(tiles);

    return (
      <div data-testid="tiles">
        {tiles.map((tile: any) => (
          <div key={tile.id}>{tile.title}</div>
        ))}
      </div>
    );
  },
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
    json: () => Promise.resolve([]),
  }) as any;

  render(<HomeView />);

  expect(screen.getByText("home.title"))
    .toBeInTheDocument();

  // wait for async update to complete
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });
});

  it("fetches and renders templates", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          {
            templateId: 10,
            statusId: 1,
            title: "Leave Request",
          },
          {
            templateId: 11,
            statusId: 2,
            title: "Vacation Form",
          },
        ]),
    }) as any;

    render(<HomeView />);

    expect(await screen.findByText("Leave Request"))
      .toBeInTheDocument();

    expect(screen.getByText("Vacation Form"))
      .toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/form/templates",
      {
        method: "GET",
        credentials: "include",
      }
    );
  });

it("filters tiles based on filterId", async () => {
  mockUseFilter.mockReturnValue({
    filterId: 1,
  });

  global.fetch = jest.fn().mockResolvedValue({
    json: () =>
      Promise.resolve([
        {
          templateId: 10,
          statusId: 1,
          title: "Accepted Form",
        },
        {
          templateId: 11,
          statusId: 2,
          title: "Pending Form",
        },
      ]),
  }) as jest.Mock;

  render(<HomeView />);

  await waitFor(() => {
    expect(screen.getByText("Accepted Form"))
      .toBeInTheDocument();
  });

  expect(screen.queryByText("Pending Form"))
    .not.toBeInTheDocument();
});

  it("handles fetch errors gracefully", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("API error")) as any;

    render(<HomeView />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(screen.getByText("home.title"))
      .toBeInTheDocument();
  });
});