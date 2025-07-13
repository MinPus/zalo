import React from "react";
import { Page, Box, Text, Icon } from "zmp-ui";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

// Mock data
const phasesData = [
  { id: "1", name: "Phase 1: Khởi động", status: "Đang làm", taskCount: 5, assignees: ["Nguyễn Văn A", "Trần Thị B"], startDate: "2025-07-01", endDate: "2025-07-10" },
  { id: "2", name: "Phase 2: Triển khai", status: "Tạm hoãn", taskCount: 8, assignees: ["Lê Văn C", "Nguyễn Văn A"], startDate: "2025-07-11", endDate: "2025-07-20" },
  { id: "3", name: "Phase 3: Nghiệm thu", status: "Hoàn thành", taskCount: 3, assignees: ["Trần Thị B", "Lê Văn C"], startDate: "2025-07-21", endDate: "2025-07-30" },
];

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(4, 109, 214, 0.1);
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
const Status = styled.span<{ active?: boolean }>`
  color: ${({ active }) => (active ? "#046DD6" : "#888")};
  font-weight: 600;
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

// Helper mock email
function getMockEmail(name: string) {
  // Chuyển tên thành email dạng: nguyenvana@email.com
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

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [phases, setPhases] = React.useState(phasesData);
  const [statusChangePhaseId, setStatusChangePhaseId] = React.useState<string | null>(null);
  const [assigneeInfo, setAssigneeInfo] = React.useState<null | { assignees: string[] }>(null);
  const getPhaseIcon = (status: string) => {
    if (status === "Đang làm") return "zi-more-horiz"; // ba chấm
    if (status === "Tạm hoãn") return "zi-minus-circle"; // gạch ngang
    if (status === "Hoàn thành") return "zi-check-circle"; // chữ v
    return "zi-more-horiz";
  };
  const getPhaseColor = (status: string) => {
    if (status === "Đang làm") return "#046DD6"; // xanh biển
    if (status === "Tạm hoãn") return "#888"; // xám
    if (status === "Hoàn thành") return "#43b244"; // xanh lá
    return "#046DD6";
  };
  return (
    <Page>
      <Box p={4}>
        <BackButton onClick={() => navigate(-1)}>
          <Icon icon="zi-arrow-left" style={{ fontSize: 22, marginRight: 8 }} />
          Quay lại
        </BackButton>
        <Text.Title style={{ marginBottom: 24 }}>{`Các phiên làm việc của dự án #${projectId}`}</Text.Title>
        {phases.map((phase) => (
          <React.Fragment key={phase.id}>
            <Card onClick={e => {
              if ((e.target as HTMLElement).closest('.status-icon')) return;
              navigate(`/projects/${projectId}/phases/${phase.id}`);
            }}>
              <span
                className="status-icon"
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 1 }}
                onClick={e => {
                  e.stopPropagation();
                  setStatusChangePhaseId(phase.id);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    setStatusChangePhaseId(phase.id);
                  }
                }}
                title="Đổi trạng thái"
              >
                <Icon icon={getPhaseIcon(phase.status)} style={{ color: getPhaseColor(phase.status), fontSize: 36, minWidth: 36 }} />
              </span>
              <Box ml={3} flex flexDirection="column" style={{ flexGrow: 1 }}>
                <Text.Title style={{ fontSize: 18, marginBottom: 4 }}>{phase.name}</Text.Title>
                {phase.assignees && phase.assignees.length > 0 && (
                  <span
                    style={{ color: '#888', fontSize: 14, marginBottom: 2, cursor: 'pointer', textDecoration: 'underline' }}
                    onPointerDown={() => {
                      const timeout = setTimeout(() => {
                        setAssigneeInfo({ assignees: phase.assignees });
                      }, 500);
                      const upHandler = () => {
                        clearTimeout(timeout);
                        window.removeEventListener('pointerup', upHandler);
                        window.removeEventListener('pointercancel', upHandler);
                      };
                      window.addEventListener('pointerup', upHandler);
                      window.addEventListener('pointercancel', upHandler);
                    }}
                    aria-label="Thông tin người cầm phiên"
                  >
                    Người cầm phiên: {phase.assignees.join(", ")}
                  </span>
                )}
                <Text size="small" color="secondary">
                  <Status active={phase.status === "Đang làm"}>{phase.status}</Status> | Số nhiệm vụ: {phase.taskCount}
                </Text>
              </Box>
            </Card>
            {statusChangePhaseId === phase.id && (
              <Box style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setStatusChangePhaseId(null)}>
                <Box style={{ position: 'relative', background: '#fff', borderRadius: 14, boxShadow: '0 4px 32px rgba(4, 109, 214, 0.18)', width: '95vw', maxWidth: 420, maxHeight: '80vh', padding: '24px 20px 16px 20px', display: 'flex', flexDirection: 'column', zIndex: 1001 }} onClick={e => e.stopPropagation()}>
                  <button type="button" style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} onClick={() => setStatusChangePhaseId(null)}>&times;</button>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#046dd6' }}>Đổi trạng thái (phase id: {phase.id})</div>
                  <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                    <button type="button" style={{ background: getPhaseColor('Hoàn thành'), color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }} onClick={() => { setPhases(prev => prev.map(p => p.id === phase.id ? { ...p, status: 'Hoàn thành' } : p)); setStatusChangePhaseId(null); }}>Hoàn thành</button>
                    <button type="button" style={{ background: getPhaseColor('Đang làm'), color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }} onClick={() => { setPhases(prev => prev.map(p => p.id === phase.id ? { ...p, status: 'Đang làm' } : p)); setStatusChangePhaseId(null); }}>Đang làm</button>
                    <button type="button" style={{ background: getPhaseColor('Tạm hoãn'), color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }} onClick={() => { setPhases(prev => prev.map(p => p.id === phase.id ? { ...p, status: 'Tạm hoãn' } : p)); setStatusChangePhaseId(null); }}>Tạm hoãn</button>
                  </Box>
                  <button type="button" style={{ width: '100%', background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }} onClick={() => setStatusChangePhaseId(null)}>Đóng</button>
                </Box>
              </Box>
            )}
          </React.Fragment>
        ))}
        {assigneeInfo && (
          <AssigneeInfoOverlay onClick={() => setAssigneeInfo(null)}>
            <AssigneeInfoBox onClick={e => e.stopPropagation()}>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#046dd6', marginBottom: 8 }}>Thông tin người cầm phiên</div>
              {assigneeInfo.assignees.map(name => (
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
                &times;
              </button>
            </AssigneeInfoBox>
          </AssigneeInfoOverlay>
        )}
      </Box>
    </Page>
  );
};

export default ProjectDetail;
