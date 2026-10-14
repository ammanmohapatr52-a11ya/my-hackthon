import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Check,
  Trash2,
  Edit2,
  Bell,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  FolderGit2,
  FileCheck2,
  Layers,
  CheckSquare,
  RefreshCw,
} from 'lucide-react';
import {
  getAllStudyTasks,
  toggleStudyTaskCompleted,
  deleteStudyTask,
  calculateTaskMeta,
  calculateStudyPlannerStats,
  type StudyTask,
  type TaskPriority,
  type TaskCategory,
  type TaskStatus,
  type StudyPlannerStats,
} from '../storage/studyTaskStore';
import { AddTaskModal } from '../features/planner/AddTaskModal';

export const StudyPlannerPage: React.FC = () => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline_asc' | 'deadline_desc' | 'priority' | 'title'>('deadline_asc');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [browserNoticeState, setBrowserNoticeState] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getAllStudyTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load study tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    const handleSync = () => loadTasks();
    window.addEventListener('neurobridge_study_tasks_changed', handleSync);
    return () => window.removeEventListener('neurobridge_study_tasks_changed', handleSync);
  }, []);

  const stats: StudyPlannerStats = useMemo(() => {
    return calculateStudyPlannerStats(tasks);
  }, [tasks]);

  const handleToggleTask = async (id?: number) => {
    if (!id) return;
    await toggleStudyTaskCompleted(id);
    await loadTasks();
  };

  const handleDeleteTask = async (id?: number) => {
    if (!id) return;
    if (window.confirm('Delete this task from your study planner?')) {
      await deleteStudyTask(id);
      await loadTasks();
    }
  };

  const handleEditTask = (task: StudyTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const requestBrowserNotice = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserNoticeState(perm);
        if (perm === 'granted') {
          new Notification('Study Planner Alerts Active', {
            body: 'You will receive in-app and browser reminders for approaching study deadlines!',
            icon: '/favicon.ico',
          });
        }
      } catch (e) {
        console.warn('Browser notification error:', e);
      }
    }
  };

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const meta = calculateTaskMeta(task);

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc = (task.description || '').toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;
        if (statusFilter === 'overdue' && (task.completed || meta.status !== 'overdue')) return false;
        if (
          statusFilter === 'due_soon' &&
          (task.completed ||
            (meta.status !== 'due_soon' && meta.status !== 'due_today' && meta.status !== 'due_tomorrow'))
        )
          return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline_asc') {
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        }
        if (sortBy === 'deadline_desc') {
          return (b.dueDate || '').localeCompare(a.dueDate || '');
        }
        if (sortBy === 'priority') {
          const rank: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
          return rank[b.priority] - rank[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const getCategoryIcon = (cat: TaskCategory) => {
    switch (cat) {
      case 'assignment':
        return <FileCheck2 size={14} />;
      case 'project':
        return <FolderGit2 size={14} />;
      case 'study':
        return <BookOpen size={14} />;
      default:
        return <Layers size={14} />;
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              }}
            >
              <Calendar size={24} />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--text-primary, #0f172a)',
                  letterSpacing: '-0.02em',
                }}
              >
                Smart Study Planner
              </h1>
              <p
                style={{
                  margin: '0.2rem 0 0 0',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary, #64748b)',
                }}
              >
                Organize assignments, schedule study tasks, and stay ahead of deadlines.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {browserNoticeState !== 'granted' && (
            <button
              type="button"
              onClick={requestBrowserNotice}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#0284c7',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Bell size={15} />
              <span>Enable Browser Alerts</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
            }}
          >
            <Plus size={18} />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Progress Dashboard Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Total Tasks */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Tasks</span>
            <Calendar size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)', marginTop: '4px' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            All active academic tasks
          </div>
        </div>

        {/* Completed */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Completed</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            Finished & verified
          </div>
        </div>

        {/* Pending */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Pending</span>
            <Clock size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            Work in progress
          </div>
        </div>

        {/* Due Soon */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Due Soon</span>
            <Bell size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {stats.dueSoon}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            Next 3 days or today
          </div>
        </div>

        {/* Overdue */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Overdue</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
            {stats.overdue}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
            Action required
          </div>
        </div>

        {/* Overall Completion */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Completion</span>
            <Sparkles size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
            {stats.completionRate}%
          </div>
          <div
            style={{
              height: '5px',
              backgroundColor: '#e2e8f0',
              borderRadius: '9999px',
              marginTop: '6px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${stats.completionRate}%`,
                height: '100%',
                backgroundColor: '#8b5cf6',
                borderRadius: '9999px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter, Search & Sort Control Strip */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface, #ffffff)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(0,0,0,0.04)',
            padding: '8px 12px',
            borderRadius: '10px',
            flex: '1 1 260px',
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search tasks by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.875rem',
              color: 'var(--text-primary, #0f172a)',
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="due_soon">Due Soon / Today</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="all">All Categories</option>
            <option value="study">Study</option>
            <option value="assignment">Assignment</option>
            <option value="project">Project</option>
            <option value="other">Other</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="deadline_asc">Deadline (Earliest)</option>
            <option value="deadline_desc">Deadline (Latest)</option>
            <option value="priority">Priority (High first)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Task List / Timeline Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px auto' }} />
            <p>Loading study planner...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              borderRadius: '20px',
              border: '1px dashed var(--border-subtle, #cbd5e1)',
            }}
          >
            <Calendar size={48} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
              No matching study tasks
            </h3>
            <p style={{ margin: '6px 0 1.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating your first study assignment or project deadline!'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setPriorityFilter('all');
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                backgroundColor: '#0284c7',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              + Create New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const meta = calculateTaskMeta(task);

            return (
              <div
                key={task.id}
                style={{
                  backgroundColor: task.completed ? 'var(--bg-surface-hover, #f8fafc)' : 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  borderRadius: '18px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Row 1: Checkbox, Title, Category, Priority, Status Tag, Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: '1 1 300px' }}>
                    {/* Completion Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      aria-label={task.completed ? 'Mark task pending' : 'Mark task completed'}
                      style={{
                        marginTop: '3px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '7px',
                        border: task.completed ? '2px solid #10b981' : '2px solid #cbd5e1',
                        backgroundColor: task.completed ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        color: '#ffffff',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {task.completed && <Check size={16} strokeWidth={3} />}
                    </button>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: task.completed ? '#94a3b8' : 'var(--text-primary, #0f172a)',
                            textDecoration: task.completed ? 'line-through' : 'none',
                          }}
                        >
                          {task.title}
                        </h3>

                        {/* Category Chip */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(2, 132, 199, 0.1)',
                            color: '#0284c7',
                            textTransform: 'capitalize',
                          }}
                        >
                          {getCategoryIcon(task.category)}
                          <span>{task.category}</span>
                        </span>

                        {/* Priority Badge */}
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            backgroundColor:
                              task.priority === 'high'
                                ? 'rgba(239, 68, 68, 0.12)'
                                : task.priority === 'medium'
                                ? 'rgba(245, 158, 11, 0.12)'
                                : 'rgba(16, 185, 129, 0.12)',
                            color:
                              task.priority === 'high'
                                ? '#ef4444'
                                : task.priority === 'medium'
                                ? '#f59e0b'
                                : '#10b981',
                            textTransform: 'uppercase',
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p
                          style={{
                            margin: '0.35rem 0 0 0',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary, #64748b)',
                            lineHeight: 1.45,
                          }}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge & Action Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: meta.statusBg,
                        color: meta.statusColor,
                        textTransform: 'capitalize',
                      }}
                    >
                      {meta.statusLabel}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEditTask(task)}
                      title="Edit task details"
                      aria-label="Edit task"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                      aria-label="Delete task"
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Row 2: Date metadata */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                    fontSize: '0.825rem',
                    color: '#64748b',
                    paddingLeft: '2.35rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    Start:{' '}
                    <span style={{ fontWeight: 600, color: 'var(--text-primary, #334155)' }}>
                      {meta.formattedDeadline && task.startDate ? task.startDate : 'Flexible'}
                    </span>
                  </div>
                  <div>
                    Deadline:{' '}
                    <span style={{ fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                      {meta.formattedDeadline}
                    </span>
                  </div>
                  {!task.completed && meta.daysRemaining !== undefined && (
                    <div style={{ fontWeight: 600, color: meta.statusColor }}>
                      {meta.daysRemaining < 0
                        ? `Overdue by ${Math.abs(meta.daysRemaining)} days`
                        : meta.daysRemaining === 0
                        ? 'Due Today!'
                        : meta.daysRemaining === 1
                        ? 'Due Tomorrow'
                        : `${meta.daysRemaining} days remaining`}
                    </div>
                  )}
                </div>

                {/* Row 3: Horizontal Timeline Progress Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingLeft: '2.35rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${meta.calculatedProgress}%`,
                        backgroundColor: task.completed
                          ? '#10b981'
                          : meta.status === 'overdue'
                          ? '#ef4444'
                          : '#0284c7',
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary, #475569)',
                      minWidth: '40px',
                      textAlign: 'right',
                    }}
                  >
                    {meta.calculatedProgress}%
                  </span>
                </div>

                {/* Row 4: Deadline Notification Alert Message */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingLeft: '2.35rem',
                    fontSize: '0.825rem',
                    fontWeight: 500,
                    color:
                      task.completed
                        ? '#059669'
                        : meta.status === 'overdue'
                        ? '#dc2626'
                        : meta.status === 'due_soon' || meta.status === 'due_today' || meta.status === 'due_tomorrow'
                        ? '#b45309'
                        : '#64748b',
                  }}
                >
                  <Bell size={14} style={{ flexShrink: 0 }} />
                  <span>{meta.reminderNotice}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
        onTaskSaved={loadTasks}
      />
    </div>
  );
};

export default StudyPlannerPage;
