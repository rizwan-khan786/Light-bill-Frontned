import React, { useEffect, useState } from 'react';
import AddRole from '../components/modals/AddRole';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addRole,fetchRoles,deleteRole,editRole } from '../store/actions/roleActions';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import './Rolemaster.css';
import { styled } from '@mui/material/styles';
import { CircularProgress} from '@mui/material';

const columns = (handleDeleteRole,handleEditRole)=>[
  { field: 'id', headerName: 'ID', width: 40 },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params) => (
      <>
        {/* <IconButton sx={{color:'#FFA534'}}  onClick={() => handleDeleteRole(params.row._id)}> */}
         <IconButton sx={{color: '#F8A63F','&:hover': {color:'#e58e1f'},}}  onClick={() => handleDeleteRole(params.row._id)}>
          <DeleteIcon />
        </IconButton>
        <IconButton sx={{color:'#23CCEF','&:hover':{color:'#1AB3D1' }}}  onClick={() => handleEditRole(params.row)}>
          <EditIcon />
        </IconButton>
      </>
    ),
  },
  { field: 'name', headerName: 'ROLE NAME', width: 220 },
  // { field: 'username', headerName: 'USER NAME', width: 180 },
  { field: 'email', headerName: 'EMAIL', width: 220 },
  // { field: 'contactNumber', headerName: 'CONTACT', width: 150 },
  { field: 'ward', headerName: 'WARD AUTHORITY', width: 180 },
 
  {
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params?.row?.firstName || ''} ${params?.row?.lastName || ''} ${params?.row?.email || ''}`,
  },
];
const Rolemaster = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.roles);
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
const [roleOpen,setRoleOpen]=useState(false);
const [role, setRole] = useState('');
const [currentRole, setCurrentRole] = useState(null);
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);
  const handleAddRoleOpen=()=>{
    setCurrentRole(null);
    setRoleOpen(true)
  }
  const handleAddRoleClose=()=>{
    setRoleOpen(false)
  }
  const handleAddRole = (roleData) => {
    dispatch(addRole(roleData));
    handleAddRoleClose();
  };
  const handleEditRole = (role) => {
    setCurrentRole(role); 
    setRoleOpen(true);
  };
  const handleDeleteRole = (roleId) => {
    dispatch(deleteRole(roleId));
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const rows = roles.map((role,index) => ({
    id:index+1,
    _id: role._id||'-',
    name: role.name||'-',
    username: role.username||'-',
    email:role.email||'-',
    contactNumber: role.contactNumber||'-',
    password:role.password||'-',
    ward:role.ward||'-'
  }));
  const gridStyle = {
    height: 'auto',
    width: isSidebarOpen ? '80%' : '90%',
    marginLeft: isSidebarOpen ? '19%' : '7%',
    transition: 'margin-left 0.3s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 0px',
    paddingLeft: '10px',
  };
  const innerDivStyle = {
    border: '1px solid #F7F7F8',
    width: '99%',
    padding: '30px 10px',
  };
  const rowColors = ['#F7F9FB', 'white'];
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-cell': {
      padding: theme.spacing(1),
    },
    '& .MuiDataGrid-row': {
      '&:nth-of-type(odd)': {
        backgroundColor: rowColors[0],
      },
      '&:nth-of-type(even)': {
        backgroundColor: rowColors[1],
      },
    },
  }));
  return (
    <div style={gridStyle}>
      <Box sx={innerDivStyle}>
      <Box sx={{   width:'100%',display:'flex',justifyContent:'space-between',mb:2}}>
        <Typography  style={{color:'#0d2136'}} className='title-2'>ROLE MASTER</Typography>
        <Button
        size="small"
            sx={{
             backgroundColor:'#23CCEF',
              border: '0.1px solid #23CCEF',
              color: '#fff',
              cursor: 'pointer',
              textTransform: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              // width: '115px',
              '&:hover': {
              backgroundColor: '#1AB3D1',
           border:'1px solid #1AB3D1',
           color: '#fff',
              },
            }}
            onClick={handleAddRoleOpen}
          >
            <AddIcon fontSize="small"/>
            <Typography sx={{textTransform:'uppercase',fontSize:'12px'}} onClick={handleAddRoleOpen}>Add Role</Typography>
          </Button>
        </Box>
      <StyledDataGrid
      autoHeight  
        rows={rows}
        columns={columns(handleDeleteRole,handleEditRole)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5,10,30,40,50]}
        checkboxSelection
      />
      <AddRole
      open={roleOpen}
      handleClose={ handleAddRoleClose}
      handleAddRole={handleAddRole}
      currentRole={currentRole}
      editRole={(roleId, roleData) => {
        dispatch(editRole(roleId, roleData));
        dispatch(fetchRoles());
      }}
      />
      </Box>
    </div>
  );
};
export default Rolemaster;
