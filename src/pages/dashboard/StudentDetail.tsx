import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { listAttendance, listFees, listExamSubjects, listResults, getStudentDetail } from "../../services/adminService";
import { AdminPageHeader, DetailField, DetailSection } from "./adminPageUtils";
import type { AttendanceRecord, FeeRecord, ResultRecord, StudentRecord } from "../../types/admin";

const quickLinkClassName =
  "rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-brand-300 hover:bg-brand-50";

export const StudentDetailPage = () => {
  const { id = "" } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [resultSubjectsByExam, setResultSubjectsByExam] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const studentDetail = await getStudentDetail(id);
        setStudent(studentDetail);

        const [attendanceRows, resultRows, feeRows] = await Promise.all([
          listAttendance({
            className: studentDetail.className ?? undefined,
            section: studentDetail.section ?? undefined,
          }),
          listResults(),
          listFees(),
        ]);

        const subjectEntries = await Promise.all(
          Array.from(new Set(resultRows.map((row) => row.examId))).map(async (examId) => {
            try {
              const subjectRows = await listExamSubjects(examId);
              return [examId, subjectRows.map((subject) => subject.subjectName).join(", ")] as const;
            } catch {
              return [examId, "Not available"] as const;
            }
          }),
        );
        setResultSubjectsByExam(Object.fromEntries(subjectEntries));

        setAttendance(attendanceRows.filter((row) => row.studentId === studentDetail.id));
        setResults(resultRows.filter((row) => row.studentId === studentDetail.id));
        setFees(feeRows.filter((row) => row.studentId === studentDetail.id));
        setError("");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load student.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const summary = useMemo(() => {
    const presentCount = attendance.filter((row) => row.status === "Present").length;
    const fee = fees[0] ?? null;
    const totalFeeAmount = fees.reduce((sum, row) => sum + Number(row.totalAmount ?? 0), 0);
    const totalPaidAmount = fees.reduce((sum, row) => sum + Number(row.paidAmount ?? 0), 0);
    const totalRemainingAmount = fees.reduce((sum, row) => sum + Number(row.remainingAmount ?? 0), 0);
    return {
      attendanceCount: attendance.length,
      presentCount,
      resultCount: results.length,
      feeStatus: fee?.status ?? "No fee record",
      feeDue: fee?.dueDate ?? "-",
      totalFeeAmount,
      totalPaidAmount,
      totalRemainingAmount,
    };
  }, [attendance, results, fees]);

  const isPrincipalArea = location.pathname.startsWith("/principal/");
  const studentListPath = isPrincipalArea ? "/principal/students" : "/dashboard/students";

  const attendanceBySubject = useMemo(() => {
    const grouped = attendance.reduce((map, row) => {
      const key = row.subjectName ?? "Unassigned Subject";
      const current = map.get(key) ?? { label: key, total: 0, present: 0, absent: 0 };
      current.total += 1;
      if (String(row.status ?? "").toLowerCase() === "present") {
        current.present += 1;
      } else if (String(row.status ?? "").toLowerCase() === "absent") {
        current.absent += 1;
      }
      map.set(key, current);
      return map;
    }, new Map<string, { label: string; total: number; present: number; absent: number }>());

    return Array.from(grouped.values())
      .map((item) => ({
        ...item,
        percentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0,
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [attendance]);

  const resultByExam = useMemo(() => {
    return results
      .map((row) => ({
        id: row.id,
        examName: row.examName,
        subjectNames: resultSubjectsByExam[row.examId] ?? "Not available",
        percentage: row.percentage,
        totalMarks: row.totalMarks,
        maxMarks: row.maxMarks,
        grade: row.finalGrade,
        status: row.passStatus,
      }))
      .sort((left, right) => right.percentage - left.percentage);
  }, [resultSubjectsByExam, results]);

  const feeRows = useMemo(
    () =>
      [...fees].sort((left, right) =>
        String(right.dueDate ?? "").localeCompare(String(left.dueDate ?? "")),
      ),
    [fees],
  );

  if (loading) {
    return <Card className="border-slate-200 bg-white shadow-sm">Loading student details...</Card>;
  }

  if (error || !student) {
    return <Card className="border-rose-200 bg-rose-50 shadow-sm text-rose-700">{error || "Student not found."}</Card>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={student.name}
        description="Student hub with academic, parent, and finance relationships plus direct navigation to attendance, results, fees, and timetable."
        action={
          <Link to={studentListPath}>
            <Button variant="ghost" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
              Back to Students
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Attendance</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.attendanceCount}</p>
          <p className="mt-2 text-sm text-slate-500">
            {summary.presentCount} present records tracked
          </p>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Results</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.resultCount}</p>
          <p className="mt-2 text-sm text-slate-500">Subject marks linked to exams</p>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fees Paid</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">{summary.totalPaidAmount}</p>
          <p className="mt-2 text-sm text-slate-500">Remaining: {summary.totalRemainingAmount}</p>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Parent Link</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">{student.parentName ?? "Not linked"}</p>
          <p className="mt-2 text-sm text-slate-500">{student.parentEmail ?? "No parent email"}</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.name}
              className="h-24 w-24 rounded-3xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-100 text-2xl font-semibold text-slate-500">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Student Photo</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {student.photoUrl ? "Profile picture added" : "No picture uploaded"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {student.photoUrl
                ? "This image is used anywhere the student profile is shown in the dashboard."
                : "Add a photo URL from the edit form to show the student's picture here and in the student list."}
            </p>
          </div>
        </div>
      </Card>

      <DetailSection title="Student Profile Card">
        <DetailField label="Name" value={student.name} />
        <DetailField label="Student ID" value={student.schoolId ?? "Not assigned"} />
        <DetailField label="Class" value={student.className ?? "Not assigned"} />
        <DetailField label="Section" value={student.section ?? "Not assigned"} />
        <DetailField label="Admission Date" value={student.admissionDate ?? "Not added"} />
        <DetailField label="Discount Fee" value={student.discountFee !== null ? String(student.discountFee) : "Not added"} />
        <DetailField label="Student Aadhar Number" value={student.studentAadharNumber ?? "Not added"} />
        <DetailField label="Date of Birth" value={student.dateOfBirth ?? "Not added"} />
        <DetailField label="Birth ID / NIC" value={student.birthId ?? "Not added"} />
        <DetailField label="Orphan Student" value={student.isOrphan ? "Yes" : "No"} />
        <DetailField label="Gender" value={student.gender ?? "Not added"} />
        <DetailField label="Cast / Caste" value={student.caste ?? "Not added"} />
        <DetailField label="OSC" value={student.osc ?? "Not added"} />
        <DetailField label="Identification Mark" value={student.identificationMark ?? "Not added"} />
        <DetailField label="Previous School" value={student.previousSchool ?? "Not added"} />
        <DetailField label="Region" value={student.region ?? "Not added"} />
        <DetailField label="Blood Group" value={student.bloodGroup ?? "Not added"} />
        <DetailField label="Previous ID / Board Roll No" value={student.previousBoardRollNo ?? "Not added"} />
        <DetailField label="Address" value={student.address ?? "Not added"} />
        <DetailField label="Photo" value={student.photoUrl ? "Uploaded" : "Not added"} />
      </DetailSection>

      <DetailSection title="Father Details">
        <DetailField label="Father Name" value={student.fatherName ?? "Not linked"} />
        <DetailField label="Father Aadhar Number" value={student.fatherAadharNumber ?? "Not added"} />
        <DetailField label="Occupation" value={student.fatherOccupation ?? "Not added"} />
        <DetailField label="Education" value={student.fatherEducation ?? "Not added"} />
        <DetailField label="Mobile Number" value={student.fatherMobileNumber ?? "Not linked"} />
        <DetailField label="Profession" value={student.fatherProfession ?? "Not added"} />
        <DetailField label="Income" value={student.fatherIncome !== null ? String(student.fatherIncome) : "Not added"} />
        <DetailField label="Mail ID" value={student.fatherEmail ?? "Not linked"} />
      </DetailSection>

      <DetailSection title="Mother Details">
        <DetailField label="Mother Name" value={student.motherName ?? "Not added"} />
        <DetailField label="Mother Aadhar Number" value={student.motherAadharNumber ?? "Not added"} />
        <DetailField label="Occupation" value={student.motherOccupation ?? "Not added"} />
        <DetailField label="Education" value={student.motherEducation ?? "Not added"} />
        <DetailField label="Mobile Number" value={student.motherMobileNumber ?? "Not added"} />
        <DetailField label="Profession" value={student.motherProfession ?? "Not added"} />
        <DetailField label="Income" value={student.motherIncome !== null ? String(student.motherIncome) : "Not added"} />
      </DetailSection>

      <Card className="border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Subject-wise Attendance</h2>
          <p className="mt-2 text-sm text-slate-500">
            Attendance percentage and present/absent distribution for each recorded subject.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Sessions</th>
                <th className="px-6 py-4 font-medium">Present</th>
                <th className="px-6 py-4 font-medium">Absent</th>
                <th className="px-6 py-4 font-medium">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceBySubject.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-slate-500">
                    No subject-wise attendance records found for this student.
                  </td>
                </tr>
              ) : (
                attendanceBySubject.map((row) => (
                  <tr key={row.label}>
                    <td className="px-6 py-4 font-medium text-slate-900">{row.label}</td>
                    <td className="px-6 py-4 text-slate-700">{row.total}</td>
                    <td className="px-6 py-4 text-slate-700">{row.present}</td>
                    <td className="px-6 py-4 text-slate-700">{row.absent}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {row.percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Fee Details</h2>
          <p className="mt-2 text-sm text-slate-500">
            Full fee summary including paid value, pending balance, and due dates.
          </p>
        </div>
        <div className="grid gap-4 border-b border-slate-200 px-6 py-5 md:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fee Status</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{summary.feeStatus}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Fee</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{summary.totalFeeAmount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Collected</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{summary.totalPaidAmount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next Due Date</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{summary.feeDue}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Paid</th>
                <th className="px-6 py-4 font-medium">Remaining</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feeRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-slate-500">
                    No fee records found for this student.
                  </td>
                </tr>
              ) : (
                feeRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 text-slate-700">{row.dueDate ?? "-"}</td>
                    <td className="px-6 py-4 text-slate-700">{row.totalAmount}</td>
                    <td className="px-6 py-4 text-slate-700">{row.paidAmount}</td>
                    <td className="px-6 py-4 text-slate-700">{row.remainingAmount}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white p-0 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Academic Performance</h2>
          <p className="mt-2 text-sm text-slate-500">
            Exam-wise performance summary for this student.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Exam</th>
                <th className="px-6 py-4 font-medium">Subjects</th>
                <th className="px-6 py-4 font-medium">Marks</th>
                <th className="px-6 py-4 font-medium">Percentage</th>
                <th className="px-6 py-4 font-medium">Grade</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resultByExam.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-slate-500">
                    No exam results found for this student.
                  </td>
                </tr>
              ) : (
                resultByExam.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">{row.examName}</td>
                    <td className="px-6 py-4 text-slate-700">{row.subjectNames}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {row.totalMarks} / {row.maxMarks}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{row.percentage}%</td>
                    <td className="px-6 py-4 text-slate-700">{row.grade}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {!isPrincipalArea ? (
        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quick Action Links</h2>
          <p className="mt-2 text-sm text-slate-500">
            Jump into the connected student workflows from one place.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Link to={`/dashboard/attendance?studentId=${student.id}`} className={quickLinkClassName}>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Attendance</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">View Attendance</p>
              <p className="mt-1 text-sm text-slate-500">Open attendance records for this student.</p>
            </Link>
            <Link to={`/dashboard/results?studentId=${student.id}`} className={quickLinkClassName}>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Results</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">View Results</p>
              <p className="mt-1 text-sm text-slate-500">Check exam-linked marks and grades.</p>
            </Link>
            <Link to={`/dashboard/fees?studentId=${student.id}`} className={quickLinkClassName}>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Fees</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">View Fees</p>
              <p className="mt-1 text-sm text-slate-500">Review payment status and due dates.</p>
            </Link>
            <Link
              to={`/dashboard/timetable${student.className && student.section ? `?class=${encodeURIComponent(student.className)}&section=${encodeURIComponent(student.section)}` : ""}`}
              className={quickLinkClassName}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Timetable</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">View Timetable</p>
              <p className="mt-1 text-sm text-slate-500">Go to the class schedule for this student.</p>
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default StudentDetailPage;
