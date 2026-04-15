import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import { authStore } from "../../store/authStore";
import { ROLES } from "../../config/roles";
import { getStaffByUserId, listClasses, listExams, listStudents } from "../../services/adminService";
import { generateReportCards } from "../../services/saasService";
import type { ClassRecord, ExamRecord, StudentRecord } from "../../types/admin";
import type { ReportCardGenerationResult, ReportCardGenerationType } from "../../types/saas";

const withTimeout = async <T,>(promise: Promise<T>, message: string, timeoutMs = 8000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]) as Promise<T>;
};

const decodeBase64ToBlob = (base64: string, type: string) => {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Blob([bytes], { type });
};

const downloadBase64File = (base64: string, fileName: string, type: string) => {
  const url = URL.createObjectURL(decodeBase64ToBlob(base64, type));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export const ReportCardsPage = () => {
  const { role, user } = authStore();
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [reportType, setReportType] = useState<ReportCardGenerationType>("individual");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [lockedClass, setLockedClass] = useState("");
  const [lockedSection, setLockedSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReportCardGenerationResult | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [classRows, examRows] = await Promise.all([
          withTimeout(listClasses(), "Loading classes is taking too long. Please refresh and try again."),
          withTimeout(listExams(), "Loading exams is taking too long. Please refresh and try again."),
        ]);
        if (!active) return;

        setClasses(classRows);
        setExams(examRows);

        if (role === ROLES.STAFF && user?.id) {
          const staff = await getStaffByUserId(user.id);
          if (!active) return;

          const coordinator = Boolean(staff?.isClassCoordinator);
          setIsCoordinator(coordinator);
          if (coordinator) {
            setLockedClass(staff?.assignedClass ?? "");
            setLockedSection(staff?.assignedSection ?? "");
            setClassName(staff?.assignedClass ?? "");
            setSection(staff?.assignedSection ?? "");
          }
        }

        setLoading(false);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load report card data.");
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [role, user?.id]);

  useEffect(() => {
    let active = true;

    if (!className || !section) {
      setStudents([]);
      return () => {
        active = false;
      };
    }

    void withTimeout(
      listStudents(),
      "Loading students is taking too long. Please reselect the class or refresh the page.",
    )
      .then((rows) => {
        if (active) {
          setStudents(rows.filter((item) => item.className === className && item.section === section));
        }
      })
      .catch((loadError) => {
        if (active) {
          setStudents([]);
          setError(loadError instanceof Error ? loadError.message : "Unable to load students for the selected class.");
        }
      });

    return () => {
      active = false;
    };
  }, [className, section]);

  const canAccess = role === ROLES.PRINCIPAL || isCoordinator;

  const filteredClasses = useMemo(
    () =>
      isCoordinator
        ? classes.filter((item) => item.className === lockedClass && item.section === lockedSection)
        : classes,
    [classes, isCoordinator, lockedClass, lockedSection],
  );

  const classOptions = useMemo(
    () => Array.from(new Set(filteredClasses.map((item) => item.className))).filter(Boolean),
    [filteredClasses],
  );

  const sectionOptions = useMemo(
    () =>
      Array.from(
        new Set(
          filteredClasses
            .filter((item) => item.className === className || (isCoordinator && item.className === lockedClass))
            .map((item) => item.section),
        ),
      ).filter(Boolean),
    [className, filteredClasses, isCoordinator, lockedClass],
  );

  const filteredStudents = useMemo(
    () => students,
    [students],
  );

  const filteredExams = useMemo(
    () => exams.filter((item) => item.className === className && item.section === section),
    [exams, className, section],
  );

  useEffect(() => {
    setStudentId("");
    setExamId("");
    setResult(null);
  }, [className, section, reportType]);

  const handleGenerate = async () => {
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const generated = await generateReportCards({
        reportType,
        examId,
        className,
        section,
        studentId,
      });
      setResult(generated);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Unable to generate report cards.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-shell"><p className="text-sm text-slate-500">Loading report card workspace...</p></div>;
  }

  if (!canAccess) {
    return (
      <div className="page-shell">
        <div className="page-section-card rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          Only principals and class coordinators can access report cards.
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-6">
      <div className="page-section-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Report Cards</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Generate student report cards from the uploaded Excel template.</h1>
        <p className="mt-2 text-sm text-slate-500">
          Missing marks, missing exam data, or unfilled result values are exported as <strong>-</strong>.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1fr]">
        <div className="page-section-card space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Report Type</span>
            <select className="ui-select" value={reportType} onChange={(event) => setReportType(event.target.value as ReportCardGenerationType)}>
              <option value="individual">Individual Student Report</option>
              <option value="class-wise">Class-wise Report</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Class</span>
            <select className="ui-select" value={className} onChange={(event) => setClassName(event.target.value)} disabled={isCoordinator}>
              <option value="">Select class</option>
              {classOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Section</span>
            <select className="ui-select" value={section} onChange={(event) => setSection(event.target.value)} disabled={isCoordinator}>
              <option value="">Select section</option>
              {sectionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Exam</span>
            <select className="ui-select" value={examId} onChange={(event) => setExamId(event.target.value)}>
              <option value="">Select exam</option>
              {filteredExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </label>

          {reportType === "individual" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Student</span>
              <select className="ui-select" value={studentId} onChange={(event) => setStudentId(event.target.value)}>
                <option value="">Select student</option>
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <Button className="w-full bg-slate-950 text-white hover:bg-slate-800" onClick={handleGenerate} disabled={submitting}>
            {submitting ? "Generating..." : "Generate Report Card"}
          </Button>
        </div>

        <div className="page-section-card space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">Export</p>
          {result ? (
            <>
              <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Generated {result.generatedCount} report card{result.generatedCount === 1 ? "" : "s"} successfully.
              </div>
              {result.warnings.map((warning) => (
                <div key={warning} className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {warning}
                </div>
              ))}
              <Button className="w-full bg-slate-950 text-white hover:bg-slate-800" onClick={() => downloadBase64File(result.excelBase64, result.excelFileName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}>
                Download Excel
              </Button>
              <Button variant="outline" className="w-full" onClick={() => downloadBase64File(result.pdfBase64, result.pdfFileName, "application/pdf")}>
                Download PDF
              </Button>
            </>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              Generate a report first to unlock the Excel and PDF downloads.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCardsPage;
