import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  Bell,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';
import {
  getAllStudyTasks,
  toggleStudyTaskCompleted,
  deleteStudyTask,
  calculateTaskMeta,
  calculateStudyPlannerStats,
  type StudyTask,
  type StudyPlannerStats,
} from '../../storage/studyTaskStore';
import { AddTaskModal } from './AddTaskModal';

interface StudyPlannerWidgetProps {
  maxItems?: number;
  showAddButton?: boolean;
}

export const StudyPlannerWidget: React.FC<StudyPlannerWidgetProps> = ({
  maxItems = 3,
  showAddButton = true,
}) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [stats, setStats] = useState<StudyPlannerStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    dueSoon: 0,
    completionRate: 0,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);

  const loadData = async () => {
    try {
      const allTasks = await getAllStudyTasks();
      // Sort tasks: pending first, then by deadline ascending
      const sorted = [...allTasks].sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      });

      setTasks(sorted);
      setStats(calculateStudyPlannerStats(allTasks));
    } catch (err) {
      console.warn('Failed to load study tasks in widget:', err);
    }
  };

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('neurobridge_study_tasks_changed', handleSync);
    return () => window.removeEventListener('neurobridge_study_tasks_changed', handleSync);
  }, []);

  const handleToggle = async (e: React.MouseEvent, id?: number) => {
    e.stopPropagation();
    if (!id) return;
    await toggleStudyTaskCompleted(id);
    await loadData();
  };

  const handleDelete = async (e: React.MouseEvent, id?: number) => {
    e.stopPropagation();
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this study task?')) {
      await deleteStudyTask(id);
      await loadData();
    }
  };

  const handleEdit = (e: React.MouseEvent, task: StudyTask) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsAddModalOpen(true);
  };

  const displayTasks = tasks.slice(0, maxItems);

  return (
    <div
      style={{
        borderRadius: '20px',
        backgroundColor: 'var(--bg-surface, #ffffff)',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        color: 'var(--text-primary, #1e293b)',
        fontFamily: 'inherit',
        marginTop: '1.25rem',
        marginBottom: '1.5rem',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Top Header matching mockup */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-primary, #0f172a)',
                letterSpacing: '-0.01em',
              }}
            >
              Study Planner
            </h3>
            <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary, #64748b)' }}>
              Plan your tasks. Track your progress.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
            }}
          >
            Live Planner
          </span>
          {showAddButton && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setIsAddModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(2, 132, 199, 0.35)',
              }}
            >
              <Plus size={15} />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary Row matching screenshot: Total tasks | Completed | Due soon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: stats.overdue > 0 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          gap: '1rem',
          padding: '0.75rem 0 1.25rem 0',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Total tasks</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            {stats.total}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Completed</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {stats.completed}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Due soon</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
            {stats.dueSoon}
          </div>
        </div>

        {stats.overdue > 0 && (
          <div>
            <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Overdue</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
              {stats.overdue}
            </div>
          </div>
        )}
      </div>

      {/* Task List matching mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {displayTasks.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1',
            }}
          >
            <Clock size={32} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
              No study tasks yet!
            </p>
            <p style={{ margin: '4px 0 12px 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              Add assignments or exam review milestones to track your deadlines.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setIsAddModalOpen(true);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: '#0284c7',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              + Add First Task
            </button>
          </div>
        ) : (
          displayTasks.map((task) => {
            const meta = calculateTaskMeta(task);

            return (
              <div
                key={task.id}
                style={{
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  borderRadius: '14px',
                  backgroundColor: task.completed
                    ? 'var(--bg-surface-hover, #f8fafc)'
                    : 'var(--bg-glass-card, rgba(255, 255, 255, 0.03))',
                  padding: '1rem 1.15rem',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Task Title & Badge Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    marginBottom: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      type="button"
                      onClick={(e) => handleToggle(e, task.id)}
                      aria-label={task.completed ? 'Mark pending' : 'Mark completed'}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: task.completed ? '1.5px solid #10b981' : '1.5px solid #64748b',
                        backgroundColor: task.completed ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                        color: '#ffffff',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {task.completed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: task.completed ? 'var(--text-muted, #94a3b8)' : 'var(--text-primary, #0f172a)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        backgroundColor: meta.statusBg,
                        color: meta.statusColor,
                        textTransform: 'capitalize',
                      }}
                    >
                      {meta.statusLabel}
                    </span>

                    {/* Quick Action Icons */}
                    <button
                      type="button"
                      onClick={(e) => handleEdit(e, task)}
                      title="Edit task"
                      aria-label="Edit task"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary, #94a3b8)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, task.id)}
                      title="Delete task"
                      aria-label="Delete task"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Deadline info */}
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary, #64748b)',
                    marginBottom: '0.6rem',
                    paddingLeft: '1.85rem',
                  }}
                >
                  Deadline: <span style={{ fontWeight: 600, color: 'var(--text-primary, #334155)' }}>{meta.formattedDeadline}</span>
                  {meta.daysRemaining >= 0 && !task.completed && (
                    <span style={{ marginLeft: '6px', color: 'var(--text-muted, #94a3b8)' }}>
                      ({meta.daysRemaining === 0 ? 'Today' : `${meta.daysRemaining}d remaining`})
                    </span>
                  )}
                </div>

                {/* Horizontal Progress Bar matching screenshot */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingLeft: '1.85rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '7px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary, #475569)',
                      minWidth: '32px',
                      textAlign: 'right',
                    }}
                  >
                    {meta.calculatedProgress}%
                  </span>
                </div>

                {/* Friendly Notification Banner matching screenshot bell notice */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    paddingLeft: '1.85rem',
                    fontSize: '0.78rem',
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
                  <Bell size={13} style={{ flexShrink: 0 }} />
                  <span>{meta.reminderNotice}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Widget Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingTop: '1rem',
          marginTop: '1rem',
          borderTop: '1px solid #f1f5f9',
          fontSize: '0.78rem',
          color: '#94a3b8',
        }}
      >
        <span>Live task tracking & adaptive deadline alerts</span>
        <button
          type="button"
          onClick={() => navigate('/planner')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0,
            fontSize: '0.8rem',
          }}
        >
          <span>View All Tasks</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
        onTaskSaved={loadData}
      />
    </div>
  );
};
