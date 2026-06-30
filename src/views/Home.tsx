import { PrivilegedTiles, Tiles } from "../utils/Tiles";
import { useAppContext, useFilter } from "../App";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserPublicData } from "../types";

type StudentSentFormDTO = {
  id: number;
  templateId: number;
  statusId: number;
  templateTitle: string;
};

type PrivilegedSentFormDTO = {
  id: number;
  templateId: number;
  templateTitle: string;
  user: UserPublicData;
  statusId: number;
};

const PAGE_SIZE = 10;

export const HomeView = () => {
  const { t } = useTranslation();
  const { filterId } = useFilter();
  const { user } = useAppContext();

  const [tiles, setTiles] = useState<StudentSentFormDTO[]>([]);
  const [privilegedTiles, setPrivilegedTiles] = useState<PrivilegedSentFormDTO[]>([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(1);

  const isPrivileged = user?.role === "worker" || user?.role === "admin";

  const fetchUserForms = () => {
    fetch(`http://localhost:8080/form/sent?page=${page}&size=${PAGE_SIZE}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {

        /*
        const mappedTiles: StudentSentFormDTO[] = data.map(
          (item: any, index: number) => ({
            id: index + 1,
            templateId: item.templateId,
            statusId: item.statusId,
            templateTitle: item.templateTitle,
          })

        );
        */
       
        setTiles(data.content);
        setMaxPage(data.totalPages);
      })
      .catch((err) =>
        console.log("Error receiving sent forms:", err)
      );
  };

  const fetchAllForms = () => {
    fetch(
      `http://localhost:8080/form/sent/all?page=${page}&size=${PAGE_SIZE}`,
      {
        credentials: "include",
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // assuming backend returns Page<SentFormDTO>
        setPrivilegedTiles(data.content);
        setMaxPage(data.totalPages);
      })
      .catch((err) =>
        console.log("Error fetching all forms:", err)
      );
  };

  useEffect(() => {
    if (!user) return;

    if (isPrivileged) {
      fetchAllForms();
    } else {
      fetchUserForms();
    }
  }, [user, page]);

 
  const filteredTiles = useMemo(() => {
    if (filterId === -1) return tiles;

    return tiles.filter(
      (tile) => tile.statusId === filterId
    );
  }, [tiles, filterId]);

   const filteredPrivilegedTiles = useMemo(() => {
    if (filterId === -1) return privilegedTiles;

    return privilegedTiles.filter(
      (tile) => tile.statusId === filterId
    );
  }, [privilegedTiles, filterId]);
  console.log(privilegedTiles);
  console.log(filteredPrivilegedTiles);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">
        {t("home.title")}
      </h1>

      <div className="max-h-[70vh] overflow-y-auto">
        {isPrivileged ? (
          <PrivilegedTiles privilegedTiles={filteredPrivilegedTiles} />
        ) : (
          <Tiles tiles={filteredTiles} user={user}/>
        )}

          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              {t("pagination.previous")}
            </button>

            <span className="self-center">
              {t("pagination.page")} {page + 1} / {maxPage || 1}
            </span>

            <button
              disabled={page + 1 >= maxPage}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, maxPage - 1))
              }
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              {t("pagination.next")}
            </button>
          </div>
      </div>
    </div>
  );
};