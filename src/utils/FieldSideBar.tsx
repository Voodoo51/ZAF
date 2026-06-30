import { useTranslation } from "react-i18next";
import { FormField } from "../types";

interface Props {
  fields: FormField[];
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
  pageCount: number;
}

export const FieldSidebar = ({
  fields,
  selectedId,
  setSelectedId,
  setFields,
  pageCount,
}: Props) => {
  const selected = fields.find((f) => f.id === selectedId);
  const { t } = useTranslation();
  const updateField = (key: keyof FormField, value: any) => {
    if (selectedId === null) {
      return;
    }

    setFields((old) =>
      old.map((f) =>
        f.id === selectedId
          ? {
              ...f,
              [key]: value,
            }
          : f
      )
    );
  };

  return (
    <div className="w-72 h-screen overflow-auto border-r bg-white p-4">
      <h2 className="mb-4 text-xl font-bold">{t("pdf.fields")}</h2>

      {fields.map((field) => (
        <button
          key={field.id}
          onClick={() => setSelectedId(field.id)}
          className={`mb-2 w-full rounded p-3 text-left ${
            selectedId === field.id ? "bg-blue-200" : "bg-gray-100"
          }`}
        >
          {field.label || `Field ${field.id}`}
        </button>
      ))}

      {selected && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <h3 className="font-bold">{t("pdf.selectedField")}</h3>

          <div>
            <label>{t("pdf.fontSize")}</label>

            <input
              type="number"
              className="w-full rounded border p-2"
              value={selected.fontSize ?? 20}
              onChange={(e) =>
                updateField("fontSize", Number(e.target.value))
              }
            />
          </div>

          <div>
            <label>X {t("pdf.position")}</label>

            <input
              type="number"
              className="w-full rounded border p-2"
              value={selected.x ?? 0}
              onChange={(e) => updateField("x", Number(e.target.value))}
            />
          </div>

          <div>
            <label>Y {t("pdf.position")}</label>

            <input
              type="number"
              className="w-full rounded border p-2"
              value={selected.y ?? 0}
              onChange={(e) => updateField("y", Number(e.target.value))}
            />
          </div>

          <div>
            <label>{t("pdf.page")}</label>

            <select
              className="w-full rounded border p-2"
              value={selected.page ?? 1}
              onChange={(e) => updateField("page", Number(e.target.value))}
            >
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                (page) => (
                  <option key={page} value={page}>
                     {page}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};