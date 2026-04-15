import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { SuperAdminHero, SuperAdminPanel, SuperAdminWorkspace } from "../../components/superAdmin/SuperAdminDesign";
import { listBoards, listSchools, updateSchool } from "../../services/saasService";
import type { BoardRecord, SchoolRecord, SchoolUpdateValues } from "../../types/saas";

const emptyForm: SchoolUpdateValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
  attendanceMapLink: "",
  attendanceGeoRadiusMeters: "",
  boardId: "",
  subscriptionPlan: "",
  subscriptionStatus: "Trial",
  storageLimit: "",
  expiryDate: "",
  reportCardTemplateFileName: "",
  reportCardTemplateBase64: "",
};

export const SuperAdminSchoolEditPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [school, setSchool] = useState<SchoolRecord | null>(null);
  const [form, setForm] = useState<SchoolUpdateValues>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [boards, setBoards] = useState<BoardRecord[]>([]);

  useEffect(() => {
    let active = true;

    void listBoards()
      .then((rows) => {
        if (active) {
          setBoards(rows);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load boards.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    void listSchools()
      .then((rows) => {
        if (!active) return;
        const found = rows.find((item) => item.id === id) ?? null;
        if (!found) {
          setError("School not found.");
          setLoading(false);
          return;
        }

        setSchool(found);
        setForm({
          name: found.name,
          email: found.email ?? "",
          phone: found.phone ?? "",
          address: found.address ?? "",
          adminName: found.adminName ?? "",
          adminEmail: found.adminEmail ?? "",
          adminPassword: "",
          attendanceMapLink: found.attendanceMapLink ?? "",
          attendanceGeoRadiusMeters: found.attendanceGeoRadiusMeters != null ? String(found.attendanceGeoRadiusMeters) : "",
          boardId: found.boardId ?? "",
          subscriptionPlan: found.subscriptionPlan ?? "",
          subscriptionStatus: found.subscriptionStatus,
          storageLimit: found.storageLimit != null ? String(found.storageLimit) : "",
          expiryDate: found.expiryDate ?? "",
          reportCardTemplateFileName: "",
          reportCardTemplateBase64: "",
        });
        setLoading(false);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load school.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleTemplateUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setForm((current) => ({ ...current, reportCardTemplateFileName: "", reportCardTemplateBase64: "" }));
      return;
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Report card template must be an .xlsx file.");
      event.target.value = "";
      return;
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    setForm((current) => ({
      ...current,
      reportCardTemplateFileName: file.name,
      reportCardTemplateBase64: btoa(binary),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!school) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await updateSchool(school.id, form);
      setSuccess("School updated successfully.");
      window.setTimeout(() => navigate(`/super-admin/schools/${school.id}`, { replace: true }), 900);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update school.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SuperAdminWorkspace>
      <SuperAdminHero
        eyebrow="Tenant editing"
        title={school ? `Edit ${school.name}` : "Edit School"}
        description="Refine school identity, access state, subscription metadata, and capacity settings from a dedicated admin workflow."
        actions={
          <Link to={school ? `/super-admin/schools/${school.id}` : "/super-admin/schools"} className="w-full sm:w-auto">
            <Button className="w-full rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-300 to-cyan-300 px-5 text-slate-950 shadow-lg shadow-sky-900/20 hover:from-sky-200 hover:to-cyan-200 sm:w-auto">
              Back
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.52fr]">
        <SuperAdminPanel>
          {loading ? (
            <p className="text-sm text-slate-500">Loading school details...</p>
          ) : (
            <form className="space-y-8" onSubmit={handleSubmit}>
              <section className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">School Identity</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Core details</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="School Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
                  <Input label="School Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
                  <Input label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
                  <Input label="Address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
                  <label className="block space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Select Board</span>
                    <select className="ui-select" value={form.boardId} onChange={(event) => setForm((current) => ({ ...current, boardId: event.target.value }))} required>
                      <option value="">Select board</option>
                      {boards.map((board) => (
                        <option key={board.id} value={board.id}>
                          {board.displayName}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500">
                      Need a new board first? Create it in <Link to="/super-admin/boards" className="font-semibold text-sky-700">Board Management</Link>.
                    </p>
                  </label>
                  <label className="block space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Replace Report Card Template (.xlsx)</span>
                    <input className="ui-input text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-white" type="file" accept=".xlsx" onChange={handleTemplateUpload} />
                    <p className="text-xs text-slate-500">
                      Current template: {form.reportCardTemplateFileName || school?.reportCardTemplateFileName || "No template uploaded"}
                    </p>
                  </label>
                </div>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">School Admin Access</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Admin credentials</h2>
                  <p className="mt-2 text-sm text-slate-500">Update the school admin login email, and optionally set a new password for that admin account.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Admin Name" value={form.adminName ?? ""} onChange={(event) => setForm((current) => ({ ...current, adminName: event.target.value }))} />
                  <Input label="Admin Email" type="email" value={form.adminEmail ?? ""} onChange={(event) => setForm((current) => ({ ...current, adminEmail: event.target.value }))} />
                  <Input label="New Admin Password" type="password" value={form.adminPassword ?? ""} onChange={(event) => setForm((current) => ({ ...current, adminPassword: event.target.value }))} />
                </div>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Attendance GPS</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">School attendance area</h2>
                  <p className="mt-2 text-sm text-slate-500">Teachers can save attendance only when their live location is inside this school map radius.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Input
                      label="School Map Link"
                      placeholder="https://maps.google.com/..."
                      value={form.attendanceMapLink ?? ""}
                      onChange={(event) => setForm((current) => ({ ...current, attendanceMapLink: event.target.value }))}
                    />
                  </div>
                  <Input
                    label="Attendance Radius (meters)"
                    type="number"
                    min="1"
                    value={form.attendanceGeoRadiusMeters ?? ""}
                    onChange={(event) => setForm((current) => ({ ...current, attendanceGeoRadiusMeters: event.target.value }))}
                  />
                </div>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Access and Plan</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Commercial settings</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Plan" value={form.subscriptionPlan} onChange={(event) => setForm((current) => ({ ...current, subscriptionPlan: event.target.value }))} />
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <select className="ui-select" value={form.subscriptionStatus} onChange={(event) => setForm((current) => ({ ...current, subscriptionStatus: event.target.value as SchoolUpdateValues["subscriptionStatus"] }))}>
                      <option value="Trial">Trial</option>
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </label>
                  <Input label="Storage Limit (MB)" type="number" min="0" value={form.storageLimit} onChange={(event) => setForm((current) => ({ ...current, storageLimit: event.target.value }))} />
                  <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={(event) => setForm((current) => ({ ...current, expiryDate: event.target.value }))} />
                </div>
              </section>

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

              <div className="page-form-footer sm:flex-row sm:justify-between">
                <Link to={school ? `/super-admin/schools/${school.id}` : "/super-admin/schools"} className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                </Link>
                <Button type="submit" className="w-full bg-slate-950 text-white hover:bg-slate-800 sm:w-auto" disabled={submitting || loading}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </SuperAdminPanel>

        <SuperAdminPanel>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Edit Summary</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 page-detail-card">
              <span className="text-slate-500">School</span>
              <span className="font-medium text-slate-900">{form.name || "School"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 page-detail-card">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-slate-900">{form.subscriptionStatus}</span>
            </div>
            <div className="flex items-center justify-between gap-4 page-detail-card">
              <span className="text-slate-500">Plan</span>
              <span className="font-medium text-slate-900">{form.subscriptionPlan || "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 page-detail-card">
              <span className="text-slate-500">Board</span>
              <span className="font-medium text-slate-900">{boards.find((board) => board.id === form.boardId)?.displayName || school?.boardName || "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 page-detail-card">
              <span className="text-slate-500">Admin Name</span>
              <span className="font-medium text-slate-900">{form.adminName || "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 page-detail-card">
              <span className="text-slate-500">Admin Email</span>
              <span className="font-medium text-slate-900">{form.adminEmail || "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 page-detail-card">
              <span className="text-slate-500">Expiry</span>
              <span className="font-medium text-slate-900">{form.expiryDate || "-"}</span>
            </div>
          </div>
        </SuperAdminPanel>
      </div>
    </SuperAdminWorkspace>
  );
};

export default SuperAdminSchoolEditPage;
