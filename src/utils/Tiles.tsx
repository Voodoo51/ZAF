import { FaPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";


type Tile = {
  id: number;
  title: string;
  statusId: number;
};

export const Tiles = ({ tiles }: { tiles: Tile[] }) => {
    const getStatusIcon = (status: number) => {
        switch (status) {
          case 1:
            return FaPlane({ className:"text-yellow-500" });
          case 2:
            return FaTimesCircle({ className:"text-red-500" });
          case 0:
            return FaCheckCircle ({className:"text-blue-500" });
          default:
            return null;
        }
      };

  return (
    <div className="grid grid-cols-3 gap-4">
      {tiles.map((tile) => (
              <div
                key={tile.id}
                className="bg-white p-4 rounded-xl border shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-center mb-2">{tile.title}</h3>

                {/* Placeholder for an image */}
                <div className="h-32 bg-gray-200 mb-4 flex justify-center items-center">
                  <span className="text-gray-500">Image Placeholder</span>
                </div>

                {/* Status section */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">Status:</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{getStatusIcon(tile.statusId)}</span>
                    <span className={`font-semibold ${tile.statusId === 1 ? "text-yellow-500" : tile.statusId === 2 ? "text-red-500" : "text-blue-500"}`}>
                      {tile.statusId === 1 && "Oczekujące"}
                      {tile.statusId === 2 && "Odrzucone"}
                      {tile.statusId === 0 && "Zaakceptowane"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      };