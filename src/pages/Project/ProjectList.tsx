import React from "react";
import { Page, Box, Text, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Mock data
const projects = [
  { id: "1", name: "Dự án A", description: "Quản lý tiến độ dự án A", status: "Đang làm" },
  { id: "2", name: "Dự án B", description: "Dự án phát triển sản phẩm B", status: "Tạm hoãn" },
  { id: "3", name: "Dự án C", description: "Triển khai hệ thống C", status: "Hoàn thành" },
];

const getProjectIcon = (status: string) => {
  if (status === "Đang làm") return "zi-more-horiz";
  if (status === "Tạm hoãn") return "zi-minus-circle";
  if (status === "Hoàn thành") return "zi-check-circle";
  return "zi-more-horiz";
};
const getProjectColor = (status: string) => {
  if (status === "Đang làm") return "#046DD6";
  if (status === "Tạm hoãn") return "#888";
  if (status === "Hoàn thành") return "#43b244";
  return "#046DD6";
};

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

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [projectList, setProjectList] = React.useState(projects);
  const [statusChangeProjectId, setStatusChangeProjectId] = React.useState<string | null>(null);

  return (
    <Page>
      <Box p={4}>
        <BackButton onClick={() => navigate(-1)}>
          <Icon icon="zi-arrow-left" style={{ fontSize: 22, marginRight: 8 }} />
          Quay lại
        </BackButton>
        <Text.Title style={{ marginBottom: 24 }}>Danh sách dự án</Text.Title>
        {projectList.map((project) => (
          <React.Fragment key={project.id}>
            <Card onClick={e => {
              if ((e.target as HTMLElement).closest('.status-icon')) return;
              navigate(`/projects/${project.id}`);
            }}>
              <span
                className="status-icon"
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 1 }}
                onClick={e => {
                  e.stopPropagation();
                  setStatusChangeProjectId(project.id);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    setStatusChangeProjectId(project.id);
                  }
                }}
                title="Đổi trạng thái"
              >
                <Icon icon={getProjectIcon(project.status)} style={{ color: getProjectColor(project.status), fontSize: 36, minWidth: 36 }} />
              </span>
              <Box ml={3} flexDirection="column" style={{ flexGrow: 1 }}>
                <Text.Title style={{ fontSize: 18, marginBottom: 4 }}>{project.name}</Text.Title>
                <Text size="small" color="secondary">{project.description}</Text>
              </Box>
            </Card>
            {statusChangeProjectId === project.id && (
              <Box style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setStatusChangeProjectId(null)}>
                <Box style={{ position: 'relative', background: '#fff', borderRadius: 14, boxShadow: '0 4px 32px rgba(4, 109, 214, 0.18)', width: '95vw', maxWidth: 420, maxHeight: '80vh', padding: '24px 20px 16px 20px', display: 'flex', flexDirection: 'column', zIndex: 1001 }} onClick={e => e.stopPropagation()}>
                  <button type="button" style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} onClick={() => setStatusChangeProjectId(null)}>&times;</button>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#046dd6' }}>Đổi trạng thái (project id: {project.id})</div>
                  <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                    <button type="button" style={{ background: getProjectColor('Hoàn thành'), color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }} onClick={() => { setProjectList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'Hoàn thành' } : p)); setStatusChangeProjectId(null); }}>Hoàn thành</button>
                    <button type="button" style={{ background: getProjectColor('Đang làm'), color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 8 }} onClick={() => { setProjectList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'Đang làm' } : p)); setStatusChangeProjectId(null); }}>Đang làm</button>
                    <button type="button" style={{ background: getProjectColor('Tạm hoãn'), color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }} onClick={() => { setProjectList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'Tạm hoãn' } : p)); setStatusChangeProjectId(null); }}>Tạm hoãn</button>
                  </Box>
                  <button type="button" style={{ width: '100%', background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }} onClick={() => setStatusChangeProjectId(null)}>Đóng</button>
                </Box>
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Page>
  );
};

export default ProjectList;
