import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import { Button, ModalClose, Sheet } from "@mui/joy";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tab from "@mui/material/Tab";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import * as React from "react";
import { FC, Fragment, useEffect } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Modals } from "../../components/Modals/Modals";
import {
  activateEmployee,
  deActivateEmployee,
  deletePermissionsList,
  getEmployeeList,
  getPermissionsList,
  resendEmployeeList,
} from "../../services/Employees/Employees";
import styles from "./Employees.module.scss";

interface EmployeesProps {}

const Employees: FC<EmployeesProps> = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("1");
  const [open, setOpen] = React.useState(false);
  const [dropdown, setDropdown] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [permissionsListData, setPermissionsListData] = React.useState([]);
  const [employeesListData, setEmployeesListData] = React.useState([]);
  const [role, setRole] = React.useState({});
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleButtonClick = () => {
    if (value === "1") {
      setOpen(true);
    }
    if (value === "2") {
      navigate("/dashboards/employees/new");
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleUpdateList = () => {
    const employeesPayload = {
      pageNo: 0,
      status: [],
      searchKey: "",
      pageSize: 10000,
    };
    setIsLoading(true);
    getEmployeeList(employeesPayload)
      .then((res) => {
        setIsLoading(false);
        setEmployeesListData(res?.data?.data?.items);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleDelete = (row: any) => {
    if (row?.userCount == 0) {
      setRole(row);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteRole = () => {
    setIsLoading(true);
    deletePermissionsList(role?.id)
      .then(() => {
        const rolesPayload = {
          pageNo: 0,
          pageSize: 10000,
          sortProperties: "id",
          sortDirection: "ASC",
        };
        getPermissionsList(rolesPayload)
          .then((res) => {
            setIsLoading(false);
            const data = res?.data?.data;
            setPermissionsListData(data?.items);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
        setIsLoading(false);
        setShowDeleteModal(false);
      })
      .catch(() => {
        setIsLoading(false);
        setShowDeleteModal(false);
      });
  };

  useEffect(() => {
    if (value === "2") {
      setIsLoading(true);
      const rolesPayload = {
        pageNo: 0,
        pageSize: 10000,
        sortProperties: "id",
        sortDirection: "ASC",
      };
      getPermissionsList(rolesPayload)
        .then((res) => {
          setIsLoading(false);
          const data = res?.data?.data;
          setPermissionsListData(data?.items);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } else {
      handleUpdateList();
    }
  }, [value]);

  const handleDropdownClick = (row: any, value: any) => {
    if (row === "Resend Invitation") {
      resendEmployeeList(value?.id)
        .then(() => {
          handleUpdateList();
          setDropdown(false);
        })
        .catch(() => {
          setDropdown(false);
        });
    } else if (row === "Activate Employee") {
      activateEmployee({
        userId: value?.id,
        status: 2,
      })
        .then(() => {
          handleUpdateList();
          setDropdown(false);
        })
        .catch(() => {
          setDropdown(false);
        });
    } else {
      deActivateEmployee({
        userId: value?.id,
        status: 3,
      })
        .then(() => {
          handleUpdateList();
          setDropdown(false);
        })
        .catch(() => {
          setDropdown(false);
        });
    }
  };

  const employeeHeader: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 450,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "id",
      headerName: "Employee ID",
      width: 150,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "permissionRole",
      headerName: "Permission Role",
      width: 250,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "department",
      headerName: "Department",
      width: 350,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <div
            className={`${"chips"} chips--${
              params.row.status === 2
                ? "green"
                : params.row.status === 1
                ? "orange"
                : params.row.status === 4
                ? "red"
                : "grey"
            }`}
          >
            <div
              className={`chips__text--${
                params.row.status === 2
                  ? "green"
                  : params.row.status === 1
                  ? "orange"
                  : params.row.status === 4
                  ? "red"
                  : "grey"
              } `}
            >
              {params.row.status === 2
                ? "Active"
                : params.row.status === 1
                ? "Pending"
                : params.row.status === 4
                ? "Expired"
                : params.row.status === 3
                ? "In active"
                : params.row.status}
            </div>
          </div>
        );
      },
    },
    {
      field: "menu",
      headerName: "",
      width: 158,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <LongMenu params={params} handleApiDropDown={handleDropdownClick} />
          </div>
        );
      },
    },
  ];

  const rolesHeader: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 350,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div className="d-flex align-items-center">
            <span>{params.row.name}</span>
            {params.row.isDefaultRole && (
              <StarIcon style={{ fontSize: "16px", color: "#0460e3" }} />
            )}
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 450,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "createdDate",
      headerName: "Created",
      width: 250,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "userCount",
      headerName: "Employees",
      width: 350,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "menu",
      headerName: "",
      width: 158,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return !params.row.isDefaultRole ? (
          <button
            onClick={() => handleDelete(params.row)}
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
            className="d-flex justify-content-between align-items-center"
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            }}
          >
            {params.row.userCount <= 0 && <DeleteIcon />}
          </button>
        ) : (
          ""
        );
      },
    },
  ];

  const handleRowEmployeesClick: GridEventListener<"rowClick"> = (params) => {
    if (dropdown) {
      return;
    } else {
      navigate("/dashboards/employees/details", {
        state: params.row,
      });
    }
  };

  const handleRowRolesClick: GridEventListener<"rowClick"> = (params) => {
    if (dropdown) {
      return;
    } else {
      navigate("/dashboards/employees/view", {
        state: params.row,
      });
    }
  };

  return (
    <Fragment>
      <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
        <div>
          <p className="fw-semibold text-black fs-30 mb-0">RYVYL Employees</p>
        </div>
      </div>
      <Col>
        <div className="card">
          <div className="card-body">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <div className={styles.tabs}>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        sx={{ fontWeight: "600" }}
                        label="All Employees"
                        value="1"
                      />
                      <Tab
                        sx={{ fontWeight: "600" }}
                        label="Permission Roles"
                        value="2"
                      />
                    </TabList>
                    <Modals
                      open={open}
                      setOpen={setOpen}
                      value={value}
                      handleClick={handleButtonClick}
                      handleList={handleUpdateList}
                    />
                  </div>
                </Box>
                <TabPanel value="1">
                  <DataGrid
                    sx={{
                      cursor: "pointer",
                      "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                        outline: "none !important",
                      },
                    }}
                    rows={employeesListData}
                    columns={employeeHeader}
                    loading={isLoading}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 25,
                        },
                      },
                    }}
                    pageSizeOptions={[25]}
                    onRowClick={handleRowEmployeesClick}
                  />
                </TabPanel>
                <TabPanel value="2">
                  <DataGrid
                    sx={{
                      cursor: "pointer",
                      "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                        outline: "none !important",
                      },
                    }}
                    rows={permissionsListData}
                    columns={rolesHeader}
                    loading={isLoading}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 25,
                        },
                      },
                    }}
                    pageSizeOptions={[25]}
                    onRowClick={handleRowRolesClick}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
        <Modal
          key={"deleteModal"}
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              minWidth: 500,
              minHeight: 200,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <h5 className={styles.deleteHeading}>Delete Permission Role</h5>
              <span className={styles.deleteText}>
                <strong style={{ fontWeight: "600" }}>{role?.name}</strong>
                &nbsp; will be permanently deleted from <br />
                the permission roles list.
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button onClick={handleDeleteRole} sx={{ width: "100px" }}>
                  Delete
                </Button>
              </div>
            </div>
          </Sheet>
        </Modal>
      </Col>
    </Fragment>
  );
};

type LongMenuProps = {
  params: object;
  handleApiDropDown: (value: any, values: any) => void;
};

export const LongMenu: React.FunctionComponent<LongMenuProps> = ({
  params,
  handleApiDropDown,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const options = [
    "View Profile",
    `${
      params.row.status === 4 || params.row.status === 1
        ? "Resend Invitation"
        : params.row.status === 2
        ? "Deactivate Employee"
        : "Activate Employee"
    }`,
  ];
  const ITEM_HEIGHT = 48;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "auto",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => {
              if (option === "View Profile") {
                navigate("/dashboards/employees/details", {
                  state: params.row,
                });
              } else {
                handleApiDropDown(option, params.row);
                handleClose();
              }
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Employees;
