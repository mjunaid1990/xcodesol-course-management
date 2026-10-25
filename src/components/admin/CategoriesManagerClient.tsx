'use client'

import React, { useState, useTransition } from 'react'
import { FolderTree, Plus, Trash2, ArrowRight, Layers, Palette, Cloud, Database, Code, Cpu } from 'lucide-react'
import { Category } from '@/lib/db/queries'
import { Modal } from '@/components/ui/Modal'
import { FormField, Input, Textarea, Select, Button } from '@/components/ui/FormField'
import { showToast } from '@/lib/toast'
import { createCategoryAction, deleteCategoryAction } from '@/app/actions/admin-actions'

interface Props {
  initialCategories: Category[]
}

const ICON_OPTIONS = [
  { value: 'Layers', label: 'Layers (Full-Stack)' },
  { value: 'Palette', label: 'Palette (UI/UX & Design)' },
  { value: 'Cloud', label: 'Cloud (DevOps & Infra)' },
  { value: 'Database', label: 'Database (Data Systems)' },
  { value: 'Code', label: 'Code (Programming)' },
  { value: 'Cpu', label: 'Cpu (Architecture)' },
]

export function CategoriesManagerClient({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('Layers')
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const handleCreate = () => {
    if (!name.trim() || !slug.trim()) {
      showToast.error('Validation Error', 'Name and Slug are required.')
      return
    }

    startTransition(async () => {
      const res = await createCategoryAction({
        name,
        slug,
        description,
        icon,
      })

      if (res.success) {
        const newCat: Category = {
          id: res.data?.id || `cat-${Date.now()}`,
          name,
          slug,
          description,
          icon,
          sort_order: categories.length + 1,
          courses_count: 0,
        }
        setCategories([...categories, newCat])
        setIsAddOpen(false)
        setName('')
        setSlug('')
        setDescription('')
        showToast.success('Category Created', `"${name}" added to course taxonomies.`)
      } else {
        showToast.error('Creation Failed', res.error)
      }
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    startTransition(async () => {
      const res = await deleteCategoryAction(deleteTarget.id)
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
        showToast.success('Category Deleted', `"${deleteTarget.name}" was removed.`)
      } else {
        showToast.error('Failed to delete', res.error)
      }
      setDeleteTarget(null)
    })
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Categories & Taxonomy
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              {categories.length} Categories
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Organize courses into topic tracks and public filter tags.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)} variant="primary" size="md">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="flex flex-col rounded-2xl border border-slate-800 bg-[#0e1424] p-5 shadow-sm hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <FolderTree className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                  {cat.courses_count || 0} {cat.courses_count === 1 ? 'Course' : 'Courses'}
                </span>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex-1">
              <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h2>
              <div className="mt-1 text-xs text-blue-400/80 font-mono">
                /courses?category={cat.slug}
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {cat.description || 'Curated topics and engineering workflows.'}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Rank #{idx + 1}</span>
              <span className="text-slate-400 text-xs font-semibold">Active Tag</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Course Category"
        description="Create a new topic category to organize and tag courses."
      >
        <div className="space-y-4">
          <FormField label="Category Name" required>
            <Input
              placeholder="e.g. Artificial Intelligence & Agents"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              autoFocus
            />
          </FormField>

          <FormField label="URL Slug" required hint="e.g. ai-and-agents">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono"
            />
          </FormField>

          <FormField label="Icon Representation">
            <Select value={icon} onChange={(e) => setIcon(e.target.value)}>
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Description">
            <Textarea
              rows={3}
              placeholder="What topics does this track cover?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} isLoading={isPending}>
              Create Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-white">"{deleteTarget?.name}"</span>? Courses in this category will become uncategorized.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isPending}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
