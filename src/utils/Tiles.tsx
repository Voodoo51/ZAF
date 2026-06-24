import { FaPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Tile = {
  id: number;
  templateId: number;
  title: string;
  statusId: number;
};

export const Tiles = ({ tiles }: { tiles: Tile[] }) => {
  const navigate = useNavigate();

const StatusLabel = ({ status }: { status: number }) => {
  if (status === 3)
    return <span className="text-blue-500">Niewysłane</span>;

  if (status === 2)
    return <span className="text-red-500">Odrzucone</span>;

  if (status === 0)
    return <span className="text-green-500">Zaakceptowane</span>;

  if (status === 1)
    return <span className="text-yellow-500">Oczekujące</span>;

  if (status === 4)
    return <span className="text-orange-500">Wymaga aktualizacji</span>;

  return null;
};

const StatusIcon = ({ status }: { status: number }) => {
  if (status === 3) return <span>📄</span>;
  if (status === 2) return <span>❌</span>;
  if (status === 0) return <span>✔️</span>;
  if (status === 1) return <span>⏳</span>;
  if (status === 4) return <span>🔄</span>;
  return null;
};

  return (
    <div className="flex flex-col divide-y">
      {tiles.map((tile) => (
        <div
          key={tile.id}
          onClick={() => navigate(`/form/${tile.templateId}`)}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
        >
          {/* LEFT: title */}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {tile.title}
            </span>

            <span className="text-xs text-gray-400">
              ID: {tile.templateId}
            </span>
          </div>

          {/* RIGHT: status */}
          <div className="flex items-center gap-2">
  <StatusIcon status={tile.statusId} />
  <StatusLabel status={tile.statusId} />
</div>
        </div>
      ))}
    </div>
  );
};