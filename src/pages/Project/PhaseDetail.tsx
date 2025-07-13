import React, { FC, Fragment, useState } from "react";
import { Page, Box, Text, Icon } from "zmp-ui";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

// Định nghĩa type cho comment và reply
type ReplyType = {
  id: string;
  text: string;
  user: string;
  replyTo: string;
  replyToName: string;
};

type CommentType = {
  id: string;
  text: string;
  user: string;
  replies: ReplyType[];
};

// Định nghĩa kiểu cho subtask
interface SubtaskType {
  id: string;
  name: string;
  done: boolean;
  approval: string;
  assignees: string[];
  startDate: string;
  endDate: string;
  wasOverdue?: boolean; // Thêm thuộc tính wasOverdue
}

// Định nghĩa kiểu cho task
interface TaskType {
  id: string;
  name: string;
  status: string;
  approval: string;
  assignees: string[];
  percent: number;
  startDate: string;
  endDate: string;
  subtasks: SubtaskType[];
  wasOverdue?: boolean; // Thêm thuộc tính wasOverdue
}

// Mock data
const initialTasks: TaskType[] = [
  {
    id: "1",
    name: "Thiết kế UI",
    status: "Đang làm",
    approval: "chưa duyệt",
    assignees: ["Nguyễn Văn A", "Lê Văn C"],
    percent: 40,
    startDate: "2025-07-01",
    endDate: "2025-07-10",
    subtasks: [
      {
        id: "1-1",
        name: "Vẽ wireframe",
        done: true,
        approval: "chưa duyệt",
        assignees: ["Nguyễn Văn A"],
        startDate: "2025-07-01",
        endDate: "2025-07-03",
      },
      {
        id: "1-2",
        name: "Thiết kế màu sắc",
        done: false,
        approval: "chưa duyệt",
        assignees: ["Lê Văn C"],
        startDate: "2025-07-04",
        endDate: "2025-07-06",
      },
      {
        id: "1-3",
        name: "Chuẩn hoá icon",
        done: false,
        approval: "chưa duyệt",
        assignees: ["Nguyễn Văn A", "Lê Văn C"],
        startDate: "2025-07-07",
        endDate: "2025-07-10",
      },
    ],
  },
  {
    id: "2",
    name: "Phân tích yêu cầu",
    status: "Tạm hoãn",
    approval: "chưa duyệt",
    assignees: ["Trần Thị B", "Nguyễn Văn A"],
    percent: 20,
    startDate: "2025-07-05",
    endDate: "2025-07-15",
    subtasks: [
      {
        id: "2-1",
        name: "Thu thập yêu cầu",
        done: true,
        approval: "chưa duyệt",
        assignees: ["Trần Thị B"],
        startDate: "2025-07-05",
        endDate: "2025-07-08",
      },
      {
        id: "2-2",
        name: "Phân tích nghiệp vụ",
        done: false,
        approval: "chưa duyệt",
        assignees: ["Nguyễn Văn A"],
        startDate: "2025-07-09",
        endDate: "2025-07-15",
      },
    ],
  },
  {
    id: "3",
    name: "Viết tài liệu",
    status: "Hoàn thành",
    approval: "chưa duyệt",
    assignees: ["Lê Văn C"],
    percent: 100,
    startDate: "2025-07-10",
    endDate: "2025-07-20",
    subtasks: [
      {
        id: "3-1",
        name: "Tài liệu kỹ thuật",
        done: true,
        approval: "chưa duyệt",
        assignees: ["Lê Văn C"],
        startDate: "2025-07-10",
        endDate: "2025-07-15",
      },
      {
        id: "3-2",
        name: "Tài liệu hướng dẫn sử dụng",
        done: true,
        approval: "chưa duyệt",
        assignees: ["Lê Văn C"],
        startDate: "2025-07-16",
        endDate: "2025-07-20",
      },
    ],
  },
  {
    id: "4",
    name: "Demo quá hạn",
    status: "Đang làm",
    approval: "chưa duyệt",
    assignees: ["Nguyễn Văn A"],
    percent: 60,
    startDate: "2025-06-20",
    endDate: "2025-07-01",
    subtasks: [],
    wasOverdue: true, // Khởi tạo wasOverdue cho task quá hạn
  },
];

// Các styled components giữ nguyên
const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(4, 109, 214, 0.10);
  margin-bottom: 18px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 6px 20px rgba(4, 109, 214, 0.18);
  }
`;
const Status = styled.span<{ active?: boolean; done?: boolean }>`
  color: ${({ done, active }) => {
    if (done) return "#43b244";
    if (active) return "#046DD6";
    return "#888";
  }};
  font-weight: 600;
  margin-left: 8px;
`;
const ApprovalStatus = styled.span<{ approved?: boolean }>`
  color: ${({ approved }) => (approved ? '#43b244' : '#e53935')};
  font-weight: 700;
  font-size: 14px;
  margin-left: 8px;
`;
const BackButton = styled.button`
  background: #f4f8fb;
  border: none;
  color: #046dd6;
  font-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 16px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(4, 109, 214, 0.08);
`;
const SubtaskList = styled.ul`
  margin: 18px 0 24px 0;
  padding: 0 0 0 24px;
  list-style: none;
  background: #f7fafd;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(4, 109, 214, 0.07);
  padding: 16px 18px 10px 18px;
`;
const SubtaskItem = styled.li<{ done?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 15px;
  color: ${({ done }) => (done ? "#43b244" : "#222")};
  font-weight: ${({ done }) => (done ? 600 : 400)};
  background: ${({ done }) => (done ? "#eafaf0" : "transparent")};
  border-radius: 6px;
  padding: 6px 10px;
  transition: background 0.2s;
`;
const ProgressBar = styled.div`
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 8px;
  margin-bottom: 8px;
  overflow: hidden;
`;
const Progress = styled.div<{ percent: number }>`
  height: 100%;
  background: linear-gradient(90deg, #046DD6, #43b244);
  width: ${({ percent }) => percent}%;
  transition: width 0.3s;
`;
const SubtaskActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 18px;
  margin-left: 24px;
  margin-bottom: 24px;
`;
const ActionButton = styled.button`
  background: #046dd6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(4, 109, 214, 0.08);
  transition: background 0.2s;
  &:hover {
    background: #024a9c;
  }
`;
const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
`;
const CommentItem = styled.li`
  margin-bottom: 8px;
  font-size: 15px;
  color: #222;
  background: #f7fafd;
  border-radius: 6px;
  padding: 7px 12px;
`;
const CommentInputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;
const CommentInput = styled.textarea`
  flex: 1;
  min-height: 32px;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 15px;
  resize: vertical;
  background: #f9fbfd;
`;
const SendButton = styled.button`
  background: #046dd6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #024a9c;
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CommentModal = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 32px rgba(4, 109, 214, 0.18);
  width: 95vw;
  max-width: 420px;
  max-height: 80vh;
  padding: 24px 20px 16px 20px;
  display: flex;
  flex-direction: column;
  z-index: 1001;
`;
const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #046dd6;
`;
const ModalClose = styled.button`
  position: absolute;
  top: 18px;
  right: 22px;
  background: none;
  border: none;
  font-size: 22px;
  color: #888;
  cursor: pointer;
`;
const AssigneeInfoOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AssigneeInfoBox = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 32px rgba(4, 109, 214, 0.18);
  min-width: 260px;
  max-width: 90vw;
  padding: 24px 28px 18px 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2001;
  position: relative;
`;
const AssigneeName = styled.span`
  color: #046dd6;
  font-weight: 600;
  font-size: 17px;
`;
const AssigneeEmail = styled.span`
  color: #888;
  font-size: 15px;
  margin-top: 4px;
`;

// Helper để tạo id ngẫu nhiên cho comment
function randomId() {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}

// Helper để lấy tên user (mock, có thể thay bằng user thực tế)
function getCurrentUser() {
  return "Quản lý dự án";
}

// Helper mock email cho assignee
function getMockEmail(name: string) {
  const email = [
    name
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ''),
    'email.com',
  ].join('@');
  return email;
}

const getTaskIcon = (status: string) => {
  if (status === "Hoàn thành") return "zi-check-circle";
  if (status === "Đang làm") return "zi-more-horiz";
  if (status === "Tạm hoãn") return "zi-minus-circle";
  return "zi-more-horiz";
};

const getTaskColor = (status: string) => {
  if (status === "Hoàn thành") return "#43b244";
  if (status === "Đang làm") return "#046DD6";
  if (status === "Tạm hoãn") return "#888";
  return "#046DD6";
};

// Hàm getWasOverdue
const getWasOverdue = (item: { endDate: string; wasOverdue?: boolean }, todayStr: string) => {
  if (item.wasOverdue) return true;
  return item.endDate < todayStr;
};

const PhaseDetail: FC = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const [openTask, setOpenTask] = useState<string | null>(null);
  const [showComment, setShowComment] = useState<string | null>(null);
  const [showSubtaskComment, setShowSubtaskComment] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, CommentType[]>>({
    "1": [
      {
        id: "cmt-1",
        text: "Bình luận đầu tiên",
        user: "Nguyễn Văn A",
        replies: [
          {
            id: "reply-1",
            text: "Phản hồi bình luận đầu tiên",
            user: "Trần Thị B",
            replyTo: "cmt-1",
            replyToName: "Nguyễn Văn A",
          },
        ],
      },
    ],
  });
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [replyTarget, setReplyTarget] = useState<null | { commentId: string; replyTo: string; replyToName: string }>(null);
  const [subtaskComments, setSubtaskComments] = useState<Record<string, CommentType[]>>({});
  const [subtaskCommentInput, setSubtaskCommentInput] = useState<Record<string, string>>({});
  const [subtaskReplyInput, setSubtaskReplyInput] = useState<Record<string, string>>({});
  const [subtaskReplyTarget, setSubtaskReplyTarget] = useState<null | { subtaskId: string; commentId: string; replyTo: string; replyToName: string }>(null);
  const [statusChangeTaskId, setStatusChangeTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks); // Sử dụng TaskType
  const [approvalModalTaskId, setApprovalModalTaskId] = useState<string | null>(null);
  const [approvalText, setApprovalText] = useState<string>("");
  const [assigneeInfo, setAssigneeInfo] = useState<null | { assignees: string[] }>(null);
  const [showApprovalWarning, setShowApprovalWarning] = useState<string | null>(null);
  const [extendDeadlineModal, setExtendDeadlineModal] = useState<null | { type: 'task' | 'subtask'; taskId: string; subtaskId?: string }>(null);
  const [newEndDate, setNewEndDate] = useState<string>("");
  const [extendError, setExtendError] = useState<string>("");
  const [subtaskApprovalModal, setSubtaskApprovalModal] = useState<null | { taskId: string; subtaskId: string }>(null);
  const [subtaskApprovalText, setSubtaskApprovalText] = useState<string>("");

  return (
    <Page>
      <Box p={4}>
        <BackButton onClick={() => navigate(-1)}>
          <Icon icon="zi-arrow-left" style={{ fontSize: 22, marginRight: 8 }} />
          Quay lại
        </BackButton>
        <Text.Title style={{ marginBottom: 24 }}>{`Danh sách task của phase #${phaseId}`}</Text.Title>
        {tasks.map((task) => (
          <Fragment key={task.id}>
            <Card
              onClick={(e) => {
                // Đảm bảo không trigger khi bấm icon
                if ((e.target as HTMLElement).closest('.status-icon')) return;
                setOpenTask(openTask === task.id ? null : task.id);
              }}
            >
              <span
                className="status-icon"
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenTask(task.id); // Đảm bảo task mở khi đổi trạng thái
                  setStatusChangeTaskId(task.id); // Mở modal đổi trạng thái
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    setOpenTask(task.id);
                    setStatusChangeTaskId(task.id);
                  }
                }}
                title="Đổi trạng thái"
              >
                <Icon
                  icon={getTaskIcon(task.status)}
                  style={{ color: getTaskColor(task.status), fontSize: 36, minWidth: 36 }}
                />
              </span>
              <Box ml={3} flex flexDirection="column" style={{ flexGrow: 1, padding: 0 }}>
                <span style={{ fontSize: 18, fontWeight: 600, marginBottom: 2 }}>{task.name}</span>
                {task.assignees && task.assignees.length > 0 && (
                  <span
                    style={{ color: '#888', fontSize: 14, marginTop: 2, cursor: 'pointer', textDecoration: 'underline' }}
                    onPointerDown={() => {
                      const timeout = setTimeout(() => {
                        setAssigneeInfo({ assignees: task.assignees });
                      }, 500);
                      const upHandler = () => {
                        clearTimeout(timeout);
                        window.removeEventListener('pointerup', upHandler);
                        window.removeEventListener('pointercancel', upHandler);
                      };
                      window.addEventListener('pointerup', upHandler);
                      window.addEventListener('pointercancel', upHandler);
                    }}
                    aria-label="Thông tin người thực hiện"
                  >
                    Người thực hiện: {task.assignees.join(', ')}
                  </span>
                )}
                {/* Hiển thị ngày bắt đầu/kết thúc */}
                <span style={{ color: '#046dd6', fontSize: 13, marginTop: 2, fontWeight: 500 }}>
                  Bắt đầu: {task.startDate} | Kết thúc: {task.endDate}
                </span>
                <Text size="small" color="secondary" style={{ marginTop: 6 }}>
                  <Status done={task.status === 'Hoàn thành'} active={task.status === 'Đang làm'}>
                    {task.status}
                  </Status>
                  {/* Hiển thị nhãn Quá hạn hoặc nút Gia hạn */}
                  {getWasOverdue(task, todayStr) ? (
                    <span
                      style={{
                        color: '#e53935',
                        fontWeight: 700,
                        marginLeft: 10,
                        fontSize: 14,
                        border: '1px solid #e53935',
                        borderRadius: 4,
                        padding: '2px 8px',
                      }}
                    >
                      Quá hạn
                    </span>
                  ) : (
                    task.endDate < todayStr && (
                      <ActionButton
                        style={{ background: '#ff9800', marginLeft: 10, fontSize: 13, padding: '2px 10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExtendDeadlineModal({ type: 'task', taskId: task.id });
                          setNewEndDate('');
                        }}
                      >
                        Gia hạn
                      </ActionButton>
                    )
                  )}
                  <ApprovalStatus approved={task.approval === 'đã duyệt'}>
                    {task.approval === 'đã duyệt' ? 'Đã duyệt' : 'Chưa duyệt'}
                  </ApprovalStatus>
                </Text>
                <ProgressBar>
                  <Progress percent={task.percent} />
                </ProgressBar>
                <Text size="xSmall" color="secondary">
                  Hoàn thành: {task.percent}%
                </Text>
              </Box>
            </Card>
            {statusChangeTaskId === task.id && (
              <Overlay onClick={() => setStatusChangeTaskId(null)}>
                <CommentModal onClick={(e) => e.stopPropagation()}>
                  <ModalClose onClick={() => setStatusChangeTaskId(null)}>×</ModalClose>
                  <ModalTitle>Đổi trạng thái (task id: {task.id})</ModalTitle>
                  <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                    <ActionButton
                      style={{
                        background: getTaskColor('Hoàn thành'),
                        marginBottom: 8,
                        opacity: task.subtasks && task.subtasks.length > 0 && task.subtasks.some((s) => !s.done) ? 0.5 : 1,
                        cursor:
                          task.subtasks && task.subtasks.length > 0 && task.subtasks.some((s) => !s.done)
                            ? 'not-allowed'
                            : 'pointer',
                      }}
                      disabled={task.subtasks && task.subtasks.length > 0 && task.subtasks.some((s) => !s.done)}
                      onClick={() => {
                        if (task.subtasks && task.subtasks.length > 0 && task.subtasks.some((s) => !s.done)) return;
                        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'Hoàn thành' } : t)));
                        setStatusChangeTaskId(null);
                      }}
                    >
                      Hoàn thành
                    </ActionButton>
                    {task.subtasks && task.subtasks.length > 0 && task.subtasks.some((s) => !s.done) && (
                      <span style={{ color: '#e53935', fontSize: 13, marginBottom: 4 }}>
                        Không thể hoàn thành khi còn subtask chưa hoàn thành
                      </span>
                    )}
                    <ActionButton
                      style={{ background: getTaskColor('Đang làm'), marginBottom: 8 }}
                      onClick={() => {
                        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'Đang làm' } : t)));
                        setStatusChangeTaskId(null);
                      }}
                    >
                      Đang làm
                    </ActionButton>
                    <ActionButton
                      style={{ background: getTaskColor('Tạm hoãn') }}
                      onClick={() => {
                        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'Tạm hoãn' } : t)));
                        setStatusChangeTaskId(null);
                      }}
                    >
                      Tạm hoãn
                    </ActionButton>
                  </Box>
                  <ActionButton style={{ width: '100%', background: '#888' }} onClick={() => setStatusChangeTaskId(null)}>
                    Đóng
                  </ActionButton>
                </CommentModal>
              </Overlay>
            )}
            {openTask === task.id && (
              <>
                <SubtaskList>
                  {task.subtasks.map((sub, subIdx) => (
                    <SubtaskItem key={sub.id} done={sub.done}>
                      <span
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer', marginRight: 8, display: 'flex', alignItems: 'center' }}
                        title={sub.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id
                                ? {
                                    ...t,
                                    subtasks: t.subtasks.map((s, idx) => (idx === subIdx ? { ...s, done: !s.done } : s)),
                                  }
                                : t
                            )
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setTasks((prev) =>
                              prev.map((t) =>
                                t.id === task.id
                                  ? {
                                      ...t,
                                      subtasks: t.subtasks.map((s, idx) => (idx === subIdx ? { ...s, done: !s.done } : s)),
                                    }
                                  : t
                              )
                            );
                          }
                        }}
                      >
                        <Icon
                          icon={sub.done ? 'zi-check-circle' : 'zi-minus-circle'}
                          style={{ color: sub.done ? '#43b244' : '#888', fontSize: 20 }}
                        />
                      </span>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{sub.name}</span>
                        {sub.assignees && sub.assignees.length > 0 && (
                          <span style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                            Người thực hiện: {sub.assignees.join(', ')}
                          </span>
                        )}
                        {/* Hiển thị ngày bắt đầu/kết thúc cho subtask */}
                        <span style={{ color: '#046dd6', fontSize: 12, marginTop: 2, fontWeight: 500 }}>
                          Bắt đầu: {sub.startDate} | Kết thúc: {sub.endDate}
                        </span>
                        {/* Hiển thị nhãn Quá hạn hoặc nút Gia hạn cho subtask */}
                        <span style={{ marginTop: 2, fontSize: 13 }}>
                          {getWasOverdue(sub, todayStr) ? (
                            <span
                              style={{
                                color: '#e53935',
                                fontWeight: 700,
                                fontSize: 13,
                                border: '1px solid #e53935',
                                borderRadius: 4,
                                padding: '2px 8px',
                                marginRight: 8,
                              }}
                            >
                              Quá hạn
                            </span>
                          ) : (
                            sub.endDate < todayStr && (
                              <ActionButton
                                style={{ background: '#ff9800', fontSize: 12, padding: '2px 8px', marginRight: 8 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExtendDeadlineModal({ type: 'subtask', taskId: task.id, subtaskId: sub.id });
                                  setNewEndDate('');
                                }}
                              >
                                Gia hạn
                              </ActionButton>
                            )
                          )}
                          <ApprovalStatus approved={sub.approval === 'đã duyệt'}>
                            {sub.approval === 'đã duyệt' ? 'Đã duyệt' : 'Chưa duyệt'}
                          </ApprovalStatus>
                        </span>
                      </div>
                      <ActionButton
                        style={{ fontSize: 13, padding: '4px 12px', background: '#046dd6', alignSelf: 'flex-start', marginLeft: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSubtaskComment(sub.id);
                        }}
                      >
                        Bình luận
                      </ActionButton>
                      <ActionButton
                        style={{ fontSize: 13, padding: '4px 12px', background: '#e53935', alignSelf: 'flex-start', marginLeft: 8 }}
                        disabled={!sub.done}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubtaskApprovalModal({ taskId: task.id, subtaskId: sub.id });
                        }}
                        title={!sub.done ? 'Chỉ có thể duyệt khi subtask đã hoàn thành' : ''}
                      >
                        Duyệt
                      </ActionButton>
                    </SubtaskItem>
                  ))}
                </SubtaskList>
                <SubtaskActions>
                  <ActionButton
                    style={{ background: '#e53935' }}
                    onClick={() => {
                      if (task.status === 'Hoàn thành') {
                        setApprovalModalTaskId(task.id);
                      } else {
                        setShowApprovalWarning(task.id);
                      }
                    }}
                    title={task.status !== 'Hoàn thành' ? 'Chỉ có thể duyệt khi task đã hoàn thành' : ''}
                  >
                    Duyệt
                  </ActionButton>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComment(showComment === task.id ? null : task.id);
                    }}
                  >
                    Bình luận
                  </ActionButton>
                </SubtaskActions>
                {/* Modal duyệt task */}
                {approvalModalTaskId === task.id && (
                  <Overlay onClick={() => setApprovalModalTaskId(null)}>
                    <CommentModal onClick={(e) => e.stopPropagation()}>
                      <ModalClose onClick={() => setApprovalModalTaskId(null)}>×</ModalClose>
                      <ModalTitle>Đánh giá công việc: {task.name}</ModalTitle>
                      <textarea
                        style={{ width: '100%', minHeight: 60, border: '1px solid #e0e6ed', borderRadius: 6, padding: 8, fontSize: 15, marginBottom: 16 }}
                        placeholder="Nhập nhận xét đánh giá..."
                        value={approvalText}
                        onChange={(e) => setApprovalText(e.target.value)}
                      />
                      <Box style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <ActionButton
                          style={{ background: '#43b244', flex: 1 }}
                          onClick={() => {
                            setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, approval: 'đã duyệt' } : t)));
                            setApprovalModalTaskId(null);
                            setApprovalText('');
                          }}
                        >
                          Đạt
                        </ActionButton>
                        <ActionButton
                          style={{ background: '#e53935', flex: 1 }}
                          onClick={() => {
                            setTasks((prev) =>
                              prev.map((t) => (t.id === task.id ? { ...t, approval: 'chưa duyệt', status: 'Đang làm' } : t))
                            );
                            setApprovalModalTaskId(null);
                            setApprovalText('');
                          }}
                        >
                          Không đạt
                        </ActionButton>
                      </Box>
                    </CommentModal>
                  </Overlay>
                )}
                {showComment === task.id && (
                  <Overlay onClick={() => setShowComment(null)}>
                    <CommentModal onClick={(e) => e.stopPropagation()}>
                      <ModalClose onClick={() => setShowComment(null)}>×</ModalClose>
                      <ModalTitle>Bình luận cho task: {task.name}</ModalTitle>
                      <CommentList style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
                        {(comments[task.id] || []).length === 0 && (
                          <CommentItem style={{ color: '#888', fontStyle: 'italic' }}>Chưa có bình luận nào</CommentItem>
                        )}
                        {(comments[task.id] || []).map((cmt) => (
                          <CommentItem key={cmt.id}>
                            <span style={{ color: '#046dd6', fontWeight: 600 }}>{cmt.user}:</span> {cmt.text}
                            <span style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                              <button
                                type="button"
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                onClick={() => setReplyTarget({ commentId: cmt.id, replyTo: cmt.id, replyToName: cmt.user })}
                                tabIndex={0}
                                aria-label="Phản hồi bình luận"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    setReplyTarget({ commentId: cmt.id, replyTo: cmt.id, replyToName: cmt.user });
                                  }
                                }}
                              >
                                <Icon icon="zi-reply" style={{ fontSize: 18, color: '#888', marginRight: 4 }} />
                                <span style={{ fontSize: 13, color: '#888' }}>Phản hồi</span>
                              </button>
                            </span>
                            {Array.isArray(cmt.replies) && cmt.replies.length > 0 && (
                              <ul style={{ marginTop: 8, marginLeft: 24, paddingLeft: 0, listStyleType: 'none' }}>
                                {cmt.replies.map((reply) => (
                                  <li
                                    key={reply.id}
                                    style={{ fontSize: 14, color: '#222', background: '#f0f6ff', borderRadius: 5, padding: '6px 10px', marginBottom: 4 }}
                                  >
                                    <span style={{ fontWeight: 600, color: '#046dd6' }}>
                                      {reply.user} → {reply.replyToName}:
                                    </span>{' '}
                                    {reply.text}
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                                      <span
                                        style={{ fontSize: 13, color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Phản hồi cho ${reply.user}`}
                                        onClick={() => setReplyTarget({ commentId: cmt.id, replyTo: reply.id, replyToName: reply.user })}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            setReplyTarget({ commentId: cmt.id, replyTo: reply.id, replyToName: reply.user });
                                          }
                                        }}
                                      >
                                        <Icon icon="zi-reply" style={{ fontSize: 16, color: '#888', marginRight: 3 }} />
                                        Phản hồi
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </CommentItem>
                        ))}
                      </CommentList>
                      <CommentInputRow>
                        <CommentInput
                          placeholder={replyTarget ? `Phản hồi cho ${replyTarget.replyToName}...` : 'Nhập bình luận...'}
                          value={replyTarget ? replyInput[replyTarget.replyTo] || '' : commentInput[task.id] || ''}
                          onChange={(e) => {
                            if (replyTarget) {
                              setReplyInput((prev) => ({ ...prev, [replyTarget.replyTo]: e.target.value }));
                            } else {
                              setCommentInput((prev) => ({ ...prev, [task.id]: e.target.value }));
                            }
                          }}
                          style={{ minHeight: 28, fontSize: 14 }}
                        />
                        <SendButton
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            if (replyTarget) {
                              if ((replyInput[replyTarget.replyTo] || '').trim() === '') return;
                              setComments((prev) => ({
                                ...prev,
                                [showComment || task.id]: prev[showComment || task.id].map((comment) =>
                                  comment.id === replyTarget.commentId
                                    ? {
                                        ...comment,
                                        replies: [
                                          ...comment.replies,
                                          {
                                            id: randomId(),
                                            text: replyInput[replyTarget.replyTo],
                                            user: getCurrentUser(),
                                            replyTo: replyTarget.replyTo,
                                            replyToName: replyTarget.replyToName,
                                          },
                                        ],
                                      }
                                    : comment
                                ),
                              }));
                              setReplyInput((prev) => ({ ...prev, [replyTarget.replyTo]: '' }));
                              setReplyTarget(null);
                            } else {
                              if ((commentInput[task.id] || '').trim() === '') return;
                              setComments((prev) => ({
                                ...prev,
                                [task.id]: [
                                  ...(prev[task.id] || []),
                                  { id: randomId(), text: commentInput[task.id], user: getCurrentUser(), replies: [] },
                                ],
                              }));
                              setCommentInput((prev) => ({ ...prev, [task.id]: '' }));
                            }
                          }}
                        >
                          Gửi
                        </SendButton>
                        {replyTarget && (
                          <SendButton
                            style={{ fontSize: 14, background: '#888', marginLeft: 4 }}
                            onClick={() => setReplyTarget(null)}
                          >
                            Huỷ
                          </SendButton>
                        )}
                      </CommentInputRow>
                    </CommentModal>
                  </Overlay>
                )}
                {showSubtaskComment && (
                  <Overlay onClick={() => setShowSubtaskComment(null)}>
                    <CommentModal onClick={(e) => e.stopPropagation()}>
                      <ModalClose onClick={() => setShowSubtaskComment(null)}>×</ModalClose>
                      <ModalTitle>Bình luận cho subtask: {task.subtasks.find((s) => s.id === showSubtaskComment)?.name}</ModalTitle>
                      <CommentList style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
                        {(subtaskComments[showSubtaskComment] || []).length === 0 && (
                          <CommentItem style={{ color: '#888', fontStyle: 'italic' }}>Chưa có bình luận nào</CommentItem>
                        )}
                        {(subtaskComments[showSubtaskComment] || []).map((cmt) => (
                          <CommentItem key={cmt.id}>
                            <span style={{ color: '#046dd6', fontWeight: 600 }}>{cmt.user}:</span> {cmt.text}
                            <span style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                              <button
                                type="button"
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                onClick={() =>
                                  setSubtaskReplyTarget({
                                    subtaskId: showSubtaskComment,
                                    commentId: cmt.id,
                                    replyTo: cmt.id,
                                    replyToName: cmt.user,
                                  })
                                }
                                tabIndex={0}
                                aria-label="Phản hồi bình luận"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    setSubtaskReplyTarget({
                                      subtaskId: showSubtaskComment,
                                      commentId: cmt.id,
                                      replyTo: cmt.id,
                                      replyToName: cmt.user,
                                    });
                                  }
                                }}
                              >
                                <Icon icon="zi-reply" style={{ fontSize: 18, color: '#888', marginRight: 4 }} />
                                <span style={{ fontSize: 13, color: '#888' }}>Phản hồi</span>
                              </button>
                            </span>
                            {Array.isArray(cmt.replies) && cmt.replies.length > 0 && (
                              <ul style={{ marginTop: 8, marginLeft: 24, paddingLeft: 0, listStyleType: 'none' }}>
                                {cmt.replies.map((reply) => (
                                  <li
                                    key={reply.id}
                                    style={{ fontSize: 14, color: '#222', background: '#f0f6ff', borderRadius: 5, padding: '6px 10px', marginBottom: 4 }}
                                  >
                                    <span style={{ fontWeight: 600, color: '#046dd6' }}>
                                      {reply.user} → {reply.replyToName}:
                                    </span>{' '}
                                    {reply.text}
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                                      <span
                                        style={{ fontSize: 13, color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Phản hồi cho ${reply.user}`}
                                        onClick={() =>
                                          setSubtaskReplyTarget({
                                            subtaskId: showSubtaskComment,
                                            commentId: cmt.id,
                                            replyTo: reply.id,
                                            replyToName: reply.user,
                                          })
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            setSubtaskReplyTarget({
                                              subtaskId: showSubtaskComment,
                                              commentId: cmt.id,
                                              replyTo: reply.id,
                                              replyToName: reply.user,
                                            });
                                          }
                                        }}
                                      >
                                        <Icon icon="zi-reply" style={{ fontSize: 16, color: '#888', marginRight: 3 }} />
                                        Phản hồi
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </CommentItem>
                        ))}
                      </CommentList>
                      <CommentInputRow>
                        <CommentInput
                          placeholder={subtaskReplyTarget ? `Phản hồi cho ${subtaskReplyTarget.replyToName}...` : 'Nhập bình luận...'}
                          value={
                            subtaskReplyTarget ? subtaskReplyInput[subtaskReplyTarget.replyTo] || '' : subtaskCommentInput[showSubtaskComment] || ''
                          }
                          onChange={(e) => {
                            if (subtaskReplyTarget) {
                              setSubtaskReplyInput((prev) => ({ ...prev, [subtaskReplyTarget.replyTo]: e.target.value }));
                            } else {
                              setSubtaskCommentInput((prev) => ({ ...prev, [showSubtaskComment]: e.target.value }));
                            }
                          }}
                          style={{ minHeight: 28, fontSize: 14 }}
                        />
                        <SendButton
                          style={{ fontSize: 14 }}
                          onClick={() => {
                            if (subtaskReplyTarget) {
                              if ((subtaskReplyInput[subtaskReplyTarget.replyTo] || '').trim() === '') return;
                              setSubtaskComments((prev) => ({
                                ...prev,
                                [subtaskReplyTarget.subtaskId]: prev[subtaskReplyTarget.subtaskId].map((comment) =>
                                  comment.id === subtaskReplyTarget.commentId
                                    ? {
                                        ...comment,
                                        replies: [
                                          ...comment.replies,
                                          {
                                            id: randomId(),
                                            text: subtaskReplyInput[subtaskReplyTarget.replyTo],
                                            user: getCurrentUser(),
                                            replyTo: subtaskReplyTarget.replyTo,
                                            replyToName: subtaskReplyTarget.replyToName,
                                          },
                                        ],
                                      }
                                    : comment
                                ),
                              }));
                              setSubtaskReplyInput((prev) => ({ ...prev, [subtaskReplyTarget.replyTo]: '' }));
                              setSubtaskReplyTarget(null);
                            } else {
                              if ((subtaskCommentInput[showSubtaskComment] || '').trim() === '') return;
                              setSubtaskComments((prev) => ({
                                ...prev,
                                [showSubtaskComment]: [
                                  ...(prev[showSubtaskComment] || []),
                                  { id: randomId(), text: subtaskCommentInput[showSubtaskComment], user: getCurrentUser(), replies: [] },
                                ],
                              }));
                              setSubtaskCommentInput((prev) => ({ ...prev, [showSubtaskComment]: '' }));
                            }
                          }}
                        >
                          Gửi
                        </SendButton>
                        {subtaskReplyTarget && (
                          <SendButton
                            style={{ fontSize: 14, background: '#888', marginLeft: 4 }}
                            onClick={() => setSubtaskReplyTarget(null)}
                          >
                            Huỷ
                          </SendButton>
                        )}
                      </CommentInputRow>
                    </CommentModal>
                  </Overlay>
                )}
                {/* Modal duyệt subtask */}
                {subtaskApprovalModal && (
                  <Overlay onClick={() => setSubtaskApprovalModal(null)}>
                    <CommentModal onClick={(e) => e.stopPropagation()}>
                      <ModalClose onClick={() => setSubtaskApprovalModal(null)}>×</ModalClose>
                      <ModalTitle>Đánh giá subtask</ModalTitle>
                      <textarea
                        style={{ width: '100%', minHeight: 60, border: '1px solid #e0e6ed', borderRadius: 6, padding: 8, fontSize: 15, marginBottom: 16 }}
                        placeholder="Nhập nhận xét đánh giá..."
                        value={subtaskApprovalText}
                        onChange={(e) => setSubtaskApprovalText(e.target.value)}
                      />
                      <Box style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <ActionButton
                          style={{ background: '#43b244', flex: 1 }}
                          onClick={() => {
                            setTasks((prev) =>
                              prev.map((t) =>
                                t.id === subtaskApprovalModal.taskId
                                  ? {
                                      ...t,
                                      subtasks: t.subtasks.map((s) =>
                                        s.id === subtaskApprovalModal.subtaskId ? { ...s, approval: 'đã duyệt' } : s
                                      ),
                                    }
                                  : t
                              )
                            );
                            setSubtaskApprovalModal(null);
                            setSubtaskApprovalText('');
                          }}
                        >
                          Đạt
                        </ActionButton>
                        <ActionButton
                          style={{ background: '#e53935', flex: 1 }}
                          onClick={() => {
                            setTasks((prev) =>
                              prev.map((t) =>
                                t.id === subtaskApprovalModal.taskId
                                  ? {
                                      ...t,
                                      subtasks: t.subtasks.map((s) =>
                                        s.id === subtaskApprovalModal.subtaskId ? { ...s, approval: 'chưa duyệt', done: false } : s
                                      ),
                                    }
                                  : t
                              )
                            );
                            setSubtaskApprovalModal(null);
                            setSubtaskApprovalText('');
                          }}
                        >
                          Không đạt
                        </ActionButton>
                      </Box>
                    </CommentModal>
                  </Overlay>
                )}
              </>
            )}
          </Fragment>
        ))}
        {assigneeInfo && (
          <AssigneeInfoOverlay onClick={() => setAssigneeInfo(null)}>
            <AssigneeInfoBox onClick={(e) => e.stopPropagation()}>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#046dd6', marginBottom: 8 }}>Thông tin người thực hiện</div>
              {assigneeInfo.assignees.map((name) => (
                <div key={name} style={{ marginBottom: 14, display: 'flex', flexDirection: 'column' }}>
                  <AssigneeName>{name}</AssigneeName>
                  <AssigneeEmail style={{ marginTop: 2 }}>{getMockEmail(name)}</AssigneeEmail>
                </div>
              ))}
              <button
                type="button"
                style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}
                onClick={() => setAssigneeInfo(null)}
                aria-label="Đóng"
              >
                ×
              </button>
            </AssigneeInfoBox>
          </AssigneeInfoOverlay>
        )}
        {/* Modal cảnh báo khi duyệt task chưa hoàn thành */}
        {showApprovalWarning && (
          <Overlay onClick={() => setShowApprovalWarning(null)}>
            <CommentModal onClick={(e) => e.stopPropagation()}>
              <ModalClose onClick={() => setShowApprovalWarning(null)}>×</ModalClose>
              <ModalTitle>Cảnh báo</ModalTitle>
              <div style={{ color: '#e53935', fontSize: 16, margin: '16px 0', textAlign: 'center' }}>
                Chỉ có thể duyệt khi nhiệm vụ đã hoàn thành
              </div>
              <ActionButton style={{ width: '100%', background: '#888' }} onClick={() => setShowApprovalWarning(null)}>
                Đóng
              </ActionButton>
            </CommentModal>
          </Overlay>
        )}
        {/* Modal gia hạn deadline */}
        {extendDeadlineModal && (
          <Overlay
            onClick={() => {
              setExtendDeadlineModal(null);
              setExtendError('');
            }}
          >
            <CommentModal onClick={(e) => e.stopPropagation()}>
              <ModalClose
                onClick={() => {
                  setExtendDeadlineModal(null);
                  setExtendError('');
                }}
              >
                ×
              </ModalClose>
              <ModalTitle>Gia hạn ngày kết thúc</ModalTitle>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => {
                  setNewEndDate(e.target.value);
                  setExtendError('');
                }}
                style={{ fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #e0e6ed', marginBottom: 8 }}
              />
              {extendError && <div style={{ color: '#e53935', fontSize: 14, marginBottom: 8 }}>{extendError}</div>}
              <Box style={{ display: 'flex', gap: 12 }}>
                <ActionButton
                  style={{ background: '#43b244', flex: 1 }}
                  disabled={!newEndDate}
                  onClick={() => {
                    if (!newEndDate) return;
                    if (newEndDate < todayStr) {
                      setExtendError('Ngày kết thúc mới phải lớn hơn hoặc bằng hôm nay');
                      return;
                    }
                    if (extendDeadlineModal.type === 'task') {
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === extendDeadlineModal.taskId
                            ? {
                                ...t,
                                endDate: newEndDate,
                                wasOverdue: getWasOverdue(t, todayStr) || t.wasOverdue, // Giữ flag nếu đã từng quá hạn
                              }
                            : t
                        )
                      );
                    } else if (extendDeadlineModal.type === 'subtask' && extendDeadlineModal.subtaskId) {
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === extendDeadlineModal.taskId
                            ? {
                                ...t,
                                subtasks: t.subtasks.map((s) =>
                                  s.id === extendDeadlineModal.subtaskId
                                    ? {
                                        ...s,
                                        endDate: newEndDate,
                                        wasOverdue: getWasOverdue(s, todayStr) || s.wasOverdue,
                                      }
                                    : s
                                ),
                              }
                            : t
                        )
                      );
                    }
                    setExtendDeadlineModal(null);
                    setNewEndDate('');
                    setExtendError('');
                  }}
                >
                  Lưu
                </ActionButton>
                <ActionButton
                  style={{ background: '#888', flex: 1 }}
                  onClick={() => {
                    setExtendDeadlineModal(null);
                    setExtendError('');
                  }}
                >
                  Huỷ
                </ActionButton>
              </Box>
            </CommentModal>
          </Overlay>
        )}
      </Box>
    </Page>
  );
};

export default PhaseDetail;