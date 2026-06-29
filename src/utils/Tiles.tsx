import { useTranslation } from "react-i18next";
import { FaPlane, FaCheckCircle, FaTimesCircle, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { User, UserPublicData } from "../types";

type Tile = {
  id: number;
  templateId: number;
  templateTitle: string;
  statusId: number;
  sentAt: string | null;
};

type PrivilegedTile = {
  id: number;
  templateId: number;
  templateTitle: string;
  user: UserPublicData;
  statusId: number;
  sentAt: string;
};

type PrivilegedTileGroup = {
  title: string;
  tiles: PrivilegedTile[];
};

function formatDate(value: string | null) {
  if(value === null) return;

  const d = new Date(value);
  return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()}: ${d.getHours()}:${d.getMinutes()}`
}



export const Tiles = ({ tiles, user, page }: { tiles: Tile[], user: User | null, page: number }) => {
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
          case 4:
            return FaUpload ({className:"text-orange-500" });
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
              userId: user?.id,
              page: page
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

          {/* CONSIDER HAVING SENT AT IN USER*/}
          {/* RIGHT: status  <div>{tile.sentAt ?? formatDate(tile.sentAt)}</div> */}
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
export const PrivilegedTiles = ({ privilegedTiles, page }: { privilegedTiles: PrivilegedTile[], page: number }) => {
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
// {[...template.formFields].reverse().
    return (
    <div className="flex flex-col gap-2">
      {[...groupedTiles].reverse().map((group) => (
        <div key={group.title}  className="rounded-md border border-gray-200 overflow-hidden">
              <h2 className="bg-gray-50 border-l-4 border-blue-500 px-4 py-2 text-base font-bold text-gray-900">
  {group.title}
</h2>
  <div className="divide-y">

          {group.tiles.map((tile) => (
            <div
              key={tile.id}
              onClick={() =>
                navigate(`/form/${tile.templateId}`, {
                  state: {
                    templateId: tile.templateId,
                    sentFormId: tile.id,
                    userId: tile.user.id,
                    name: tile.user.name,
                    surname: tile.user.surname,
                    page,
                  },
                })
              }
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {tile.user.name} {tile.user.surname}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <div>{formatDate(tile.sentAt)}</div>
                <span>{getStatusIcon(tile.statusId)}</span>
                <StatusLabel status={tile.statusId} />
              </div>
            </div>
          ))}
        </div>
        </div>
      ))}
    </div>
  );
};