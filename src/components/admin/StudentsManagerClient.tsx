'use client'

import React, { useState, useTransition } from 'react'
import { Users, Search, Plus, BookOpen, ShieldCheck } from 'lucide-react'
import { Student } from '@/lib/db/queries'
import { formatDate } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { FormField, Input, Select, Button } from '@/components/ui/FormField'
import { showToast } from '@/lib/toast'
import { enrollStudentAction } from '@/app/actions/admin-actions'

interface Props {
  initialStudents: Student[]
  courses: { id: string; title: string }[]
}

export function StudentsManagerClient({ initialStudents, courses }: Props) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [search, setSearch] = useState('')
  const [isEnrollOpen, setIsEnrollOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '')
  const [isPending, startTransition] = useTransition()

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEnroll = () => {
    if (!name.trim() || !email.trim()) {
      showToast.error('Validation Error', 'Name and email are required.')
      return
    }

    startTransition(async () => {
      const res = await enrollStudentAction({
        name,
        email,
        courseId: selectedCourseId,
      })

      if (res.success) {
        const newStudent: Student = {
          id: res.data?.id || `std-${Date.now()}`,
          name,
          email,
          role: 'student',
          avatar_url: null,
          enrolled_courses_count: 1,
          created_at: new Date().toISOString(),
        }

        setStudents([newStudent, ...students])
        setIsEnrollOpen(false)
        setName('')
        setEmail('')
        showToast.success(
          'Student Enrolled',
          `${name} (${email}) was registered and granted course access.`
        )
      } else {
        showToast.error('Enrollment Failed', res.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Student Directory
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              {students.length} Registered
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Track student enrollment progress, access permissions, and account statuses.
          </p>
        </div>

        <Button onClick={() => setIsEnrollOpen(true)} variant="primary" size="md">
          <Plus className="h-4 w-4" />
          <span>Manual Enroll</span>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#0e1424] p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0e1424] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Student</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Enrolled Courses</th>
                <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white text-xs">
                        {student.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20 capitalize">
                      <ShieldCheck className="h-3 w-3" />
                      {student.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-300">
                      <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                      {student.enrolled_courses_count} {student.enrolled_courses_count === 1 ? 'course' : 'courses'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {formatDate(student.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Enroll Modal */}
      <Modal
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        title="Manual Student Enrollment"
        description="Register a student account and grant immediate access to a course."
      >
        <div className="space-y-4">
          <FormField label="Student Full Name" required>
            <Input
              placeholder="e.g. Jordan Miller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              type="email"
              placeholder="jordan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Grant Access To Course">
            <Select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsEnrollOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEnroll} isLoading={isPending}>
              Confirm Enrollment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
