import React, { useState } from 'react';
import { X, Calendar, AlertCircle, CheckCircle, Clock, Tag, Flag } from 'lucide-react';
import {
  addStudyTask,
  updateStudyTask,
  type StudyTask,
  type TaskPriority,
  type TaskCategory,
} from '../../storage/studyTaskStore';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSaved?: (task: StudyTask) => void;
  taskToEdit?: StudyTask | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskSaved,
  taskToEdit,
}) => {
  const isEditing = Boolean(taskToEdit && taskToEdit.id);

  const getTodayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [title, setTitle] = useState<string>(taskToEdit?.title || '');
  const [description, setDescription] = useState<string>(taskToEdit?.description || '');
  const [startDate, setStartDate] = useState<string>(taskToEdit?.startDate || getTodayISO());
  const [dueDate, setDueDate] = useState<string>(taskToEdit?.dueDate || '');
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || 'medium');
  const [category, setCategory] = useState<TaskCategory>(taskToEdit?.category || 'study');
  const [progressPercent, setProgressPercent] = useState<number>(taskToEdit?.progressPercent ?? 20);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync state if taskToEdit changes
  React.useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStartDate(taskToEdit.startDate || getTodayISO());
      setDueDate(taskToEdit.dueDate || '');
      setPriority(taskToEdit.priority || 'medium');
      setCategory(taskToEdit.category || 'study');
      setProgressPercent(taskToEdit.progressPercent ?? 20);
    } else {
      setTitle('');
      setDescription('');
      setStartDate(getTodayISO());
      // Default due date: 3 days from now
      const inThreeDays = new Date(Date.now() + 3 * 86400000);
      setDueDate(
        `${inThreeDays.getFullYear()}-${String(inThreeDays.getMonth() + 1).padStart(2, '0')}-${String(inThreeDays.getDate()).padStart(2, '0')}`
      );
      setPriority('medium');
      setCategory('study');
      setProgressPercent(20);
    }
    setErrorMsg(null);
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please enter a task or event title.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Please select a due date or deadline.');
      return;
    }

    if (startDate && dueDate && dueDate < startDate) {
      setErrorMsg('Deadline due date cannot be earlier than the start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && taskToEdit?.id) {
        await updateStudyTask(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          startDate,
          dueDate,
          priority,
          category,
          progressPercent: Number(progressPercent),
        });
        if (onTaskSaved) {
          onTaskSaved({
            ...taskToEdit,
            title: title.trim(),
            description: description.trim(),
            startDate,
            dueDate,
            priority,
            category,
            progressPercent: Number(progressPercent),
          });
        }
      } else {
        const created = await addStudyTask({
          title: title.trim(),
          description: description.trim(),
          startDate,
          dueDate,
          priority,
          category,
          progressPercent: Number(progressPercent),
        });
        if (onTaskSaved) {
          onTaskSaved(created);
        }
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-task-heading"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <h2
                id="modal-task-heading"
                style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}
              >
                {isEditing ? 'Edit Study Task' : 'Add New Study Task'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                Plan assignments, set deadlines & track progress
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {errorMsg && (
            <div
              role="alert"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#fca5a5',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="task-title-input"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
            >
              Task Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              placeholder="e.g. Complete DSA Assignment, Database Project Report..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                fontSize: '0.925rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="task-desc-input"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
            >
              Short Description <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(Optional)</span>
            </label>
            <textarea
              id="task-desc-input"
              rows={2}
              placeholder="Provide key notes, chapters, topics, or goals to achieve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Dates Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label
                htmlFor="task-start-date"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
              >
                Start Date
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="task-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    colorScheme: 'dark',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="task-due-date"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
              >
                Due Date / Deadline <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="task-due-date"
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #38bdf8',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    colorScheme: 'dark',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Priority & Category Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label
                htmlFor="task-priority-select"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
              >
                Priority
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-category-select"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}
              >
                Category
              </label>
              <select
                id="task-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="study">📖 Study</option>
                <option value="assignment">📝 Assignment</option>
                <option value="project">🚀 Project</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
          </div>

          {/* Workload Progress Slider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label
                htmlFor="task-progress-slider"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}
              >
                Estimated Progress: <span style={{ color: '#38bdf8' }}>{progressPercent}%</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {progressPercent === 100 ? 'Complete' : progressPercent > 50 ? 'In Progress' : 'Just Started'}
              </span>
            </div>
            <input
              id="task-progress-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressPercent}
              onChange={(e) => setProgressPercent(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#0284c7',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
              }}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEditing ? (
                <>
                  <CheckCircle size={16} />
                  <span>Update Task</span>
                </>
              ) : (
                <>
                  <Calendar size={16} />
                  <span>Add Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
