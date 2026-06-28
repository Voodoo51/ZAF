import { useTranslation } from "react-i18next";
import { FaPlane, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { User, UserPublicData } from "../types";

type Tile = {
  id: number;
  templateId: number;
  templateTitle: string;
  statusId: number;
};

type PrivilegedTile = {
  id: number;
  templateId: number;
  templateTitle: string;
  user: UserPublicData;
  statusId: number;
};

type PrivilegedTileGroup = {
  title: string;
  tiles: PrivilegedTile[];
};


export const Tiles = ({ tiles, user }: { tiles: Tile[], user: User | null }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

const StatusLabel = ({ status }: { status: number }) => {
  if (status === 3)
    return <span className="text-blue-500">{t("filters.unsent")}</span>;

  if (status === 2)
    return <span className="text-red-500">{t("filters.rejected")}</span>;

  if (status === 0)
    return <span className="text-green-500">{t("filters.accepted")}</span>;

  if (status === 1)
    return <span className="text-yellow-500">{t("filters.pending")}</span>;

  if (status === 4)
    return <span className="text-orange-500">{t("filters.requiresUpdate")}</span>;

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
          onClick={() => navigate(`/form/${tile.templateId}`, {
            state: {
              templateId: tile.templateId,
              userId: user?.id
            }
          })}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
        >
          {/* LEFT: title */}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {tile.templateTitle}
            </span>        
          </div>

          {/* RIGHT: status */}
          <div className="flex items-center gap-2">
 <span>{getStatusIcon(tile.statusId)}</span>
   <StatusLabel status={tile.statusId} />
</div>
        </div>
      ))}
    </div>
  );
};


//privileged as in accounts with privileges to accept sent forms get this view
export const PrivilegedTiles = ({ privilegedTiles }: { privilegedTiles: PrivilegedTile[] }) => {
  const groupedTiles: PrivilegedTileGroup[] = Object.values(
    privilegedTiles.reduce<Record<string, PrivilegedTileGroup>>((acc, tile) => {
      if (!acc[tile.templateId]) {
        acc[tile.templateId] = {
          title: tile.templateTitle, // or whatever property contains the title
          tiles: [],
        };
      }

      acc[tile.templateId].tiles.push(tile);
      return acc;
    }, {})
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

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

const StatusLabel = ({ status }: { status: number }) => {
  if (status === 3)
    return <span className="text-blue-500">{t("filters.unsent")}</span>;

  if (status === 2)
    return <span className="text-red-500">{t("filters.rejected")}</span>;

  if (status === 0)
    return <span className="text-green-500">{t("filters.accepted")}</span>;

  if (status === 1)
    return <span className="text-yellow-500">{t("filters.pending")}</span>;

  if (status === 4)
    return <span className="text-orange-500">{t("filters.requiresUpdate")}</span>;

  return null;
};

  return (
    <div className="flex flex-col divide-y">
      {groupedTiles.map((group) => (
        <div>
          <h2 className="text-xl font-bold mb-3">
              {group.title}
          </h2>
            {group.tiles.map((tile) => (
              <div
                  key={tile.id}
                 onClick={() => navigate(`/form/${tile.templateId}`, {
                    state: {
                      templateId: tile.templateId,
                      sentFormId: tile.id,
                      userId: tile.user.id
                    }
                  })}               
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                >
                  {/* LEFT: title */}
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {tile.user.name + " " + tile.user.surname}
                    </span>        
                  </div>

                  {/* RIGHT: status */}
                  <div className="flex items-center gap-2">
        <span>{getStatusIcon(tile.statusId)}</span>
          <StatusLabel status={tile.statusId} />
        </div>
        </div>
        ))}
      </div>))}
    </div>
  );
};