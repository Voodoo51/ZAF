import {Tiles} from "../utils/Tiles";
import {useFilter} from "../App";

export const HomeView = () => {

  const { active } = useFilter();

  const tiles = [
    { id: 1, title: "Form A", status: "accepted" },
    { id: 2, title: "Form B", status: "pending" },
    { id: 3, title: "Form C", status: "denied" },
    { id: 4, title: "Form C", status: "pending" },
  ];//placeholder

  const filteredTiles =
      active === "all"
        ? tiles
        : tiles.filter((tile) => tile.status === active);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Home</h1>

      <Tiles tiles={filteredTiles} />

    </div>
  );
};
