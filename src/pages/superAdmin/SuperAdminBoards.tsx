import { useEffect, useMemo, useState, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { SuperAdminHero, SuperAdminPanel, SuperAdminWorkspace } from "../../components/superAdmin/SuperAdminDesign";
import { createBoard, listBoards } from "../../services/saasService";
import type { BoardRecord } from "../../types/saas";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const SuperAdminBoardsPage = () => {
  const [boards, setBoards] = useState<BoardRecord[]>([]);
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStateBoard = useMemo(() => name.trim().toLowerCase() === "state" || name.trim().toLowerCase() === "state board", [name]);

  useEffect(() => {
    let active = true;

    void listBoards()
      .then((rows) => {
        if (active) {
          setBoards(rows);
          setLoading(false);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load boards.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const created = await createBoard({ name, state: isStateBoard ? state : "" });
      setBoards((current) => [...current, created].sort((left, right) => left.displayName.localeCompare(right.displayName)));
      setSuccess("Board created successfully.");
      setName("");
      setState("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to create board.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SuperAdminWorkspace>
      <SuperAdminHero
        eyebrow="Board management"
        title="Create academic boards once and assign them across schools."
        description="Use this space to maintain CBSE, State, and other board options before schools are onboarded or edited."
      />

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1fr]">
        <SuperAdminPanel>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Add Board</p>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <Input label="Board Name" placeholder="CBSE or State" value={name} onChange={(event) => setName(event.target.value)} required />
            {isStateBoard ? (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Select State</span>
                <select className="ui-select" value={state} onChange={(event) => setState(event.target.value)} required>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
            <Button type="submit" className="w-full bg-slate-950 text-white hover:bg-slate-800" disabled={submitting}>
              {submitting ? "Adding board..." : "Add Board"}
            </Button>
          </form>
        </SuperAdminPanel>

        <SuperAdminPanel>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Configured Boards</p>
          <div className="mt-5 space-y-3">
            {loading ? <p className="text-sm text-slate-500">Loading boards...</p> : null}
            {!loading && boards.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                No boards added yet.
              </div>
            ) : null}
            {boards.map((board) => (
              <div key={board.id} className="page-detail-card flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{board.displayName}</p>
                  <p className="mt-1 text-sm text-slate-500">Base name: {board.name}</p>
                </div>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                  {board.state ? "State Board" : "National"}
                </span>
              </div>
            ))}
          </div>
        </SuperAdminPanel>
      </div>
    </SuperAdminWorkspace>
  );
};

export default SuperAdminBoardsPage;
