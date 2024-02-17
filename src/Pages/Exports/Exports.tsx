import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import * as React from "react";
import { FC, Fragment, useEffect, useState } from "react";
import uuid from "react-uuid";
import ENV from "../../EnvironmentVariables.json";
import { ExportedFilesStatusNumber } from "../../Enums/ExportedFileStatus";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { titleCase } from "../../helpers/capitalizeFirstLetter";
import {
  exportAllEvents,
  exportBulkDelete,
  exportDownloadReport,
} from "../../services/Exports/Exports";
import { getStorage } from "../../services/Storage";
import "./Exports.style.scss";

const getDate = (date: any) => {
  return date?.split("-")[0];
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Exports: FC = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<any>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const getData = () => {
    setIsLoading(true);
    exportAllEvents()
      .then((res) => {
        const data = res?.data?.data;
        setIsLoading(false);
        data.items = data?.items?.map((x: any) => {
          let createdAt = x?.createdDate;
          let startDate = x?.startDate;
          let endDate = x?.endDate;
          let dateRange = "";
          if (startDate != null)
            dateRange = getDate(startDate).concat(" - ", getDate(endDate));

          return { ...x, createdAt, startDate, endDate, dateRange };
        });
        setData(data?.items);
      })
      .catch(() => {
        setIsLoading(false);
      });
    setSelected([]);
  };

  function getPDF(downloadUrl: any) {
    return axios.get(downloadUrl, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    });
  }

  const updatedData = () => {
    exportAllEvents()
      .then((res) => {
        const data = res?.data?.data;

        data.items = data?.items?.map((x: any) => {
          const createdAt = x?.createdDate;

          const startDate = x?.startDate;
          const endDate = x?.endDate;
          let dateRange = "";
          if (startDate != null)
            dateRange = getDate(startDate).concat(" - ", getDate(endDate));

          return { ...x, createdAt, startDate, endDate, dateRange };
        });
        setData(data?.items);
      })
      .catch((error) => {
        console.log(error);
      });
    setSelected([]);
  };

  const handleDownload = (id: any) => {
    exportDownloadReport(id)
      .then((res) => {
        const downloadUrl = res?.data?.data?.downloadUrl;
        const file = downloadUrl?.substring(downloadUrl?.lastIndexOf("/") + 1);
        const fileName = file?.split(".csv")[0];
        getPDF(downloadUrl)
          .then((res: any) => {
            const blob = new Blob([res?.data], {
              type: "text/csv",
            });
            saveAs(blob, fileName);
          })
          .catch((err: any) => {
            console.log(err);
          });
        updatedData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  //Bulk Download
  const handleBulkDownload = () => {
    const sendPayload = { eventIds: selected };
    const token = getStorage(LocalStorageKeysEnum.stepupToken);
    const baseURL =
      process.env.NODE_ENV === "development"
        ? `${ENV.serverURL}${ENV.apiURL}`
        : `${ENV.apiURL}`;
    const sendURL = `${baseURL}/download/export/bulk`;
    return axios
      .post(sendURL, sendPayload, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "en-US",
          "X-REQUESTID": uuid(),
          SkipDecryption: false,
          accept: "application/json",
        },
      })
      .then((res) => {
        if (res?.status === 200) {
          const disposition = res?.request.getResponseHeader(
            "Content-Disposition"
          );
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, "");
          }
          var fileName = "Admin_ExportedFiles";
          let blob = new Blob([res?.data], { type: "application/zip" });

          const downloadUrl = URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = downloadUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
        }
        setSelected([]);
      })
      .catch((err) => {
        setSelected([]);
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //Bulk Trash
  const handleBulkTrash = () => {
    const sendData = {
      eventIds: selected,
    };
    exportBulkDelete(sendData)
      .then((res) => {
        if (res?.status === 200) {
          getData();
          setSelected([]);
        }
      })
      .catch((err) => {
        setSelected([]);
      });
  };

  const header: GridColDef[] = [
    {
      field: "id",
      headerName: "Export ID",
      width: 150,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return titleCase(params.row.reportName.replaceAll("_", " "));
      },
    },
    {
      field: "reportName",
      headerName: "Report Name",
      width: 400,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "createdDate",
      headerName: "Export Date",
      width: 250,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "startDate",
      headerName: "Date Range",
      width: 350,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return params.row?.dateRange === "Invalid date - Invalid date"
          ? "--"
          : params.row?.dateRange;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 300,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            className={`${"chip"} chip--${
              params.row?.status === ExportedFilesStatusNumber.UploadFail ||
              params.row?.status === ExportedFilesStatusNumber.Open ||
              params.row?.status ===
                ExportedFilesStatusNumber.ReportGenerateFail
                ? "red"
                : params.row?.status === ExportedFilesStatusNumber.Completed
                ? "green"
                : "orange"
            }`}
          >
            <div
              className={`chip__text--${
                params.row?.status === ExportedFilesStatusNumber.UploadFail ||
                params.row?.status === ExportedFilesStatusNumber.Open ||
                params.row?.status ===
                  ExportedFilesStatusNumber.ReportGenerateFail
                  ? "red"
                  : params.row?.status === ExportedFilesStatusNumber.Completed
                  ? "green"
                  : "orange"
              } `}
            >
              {params.row?.status === ExportedFilesStatusNumber.SentToMb ||
              params.row?.status ===
                ExportedFilesStatusNumber.ReportGenerated ||
              params.row?.status === ExportedFilesStatusNumber.UploadedToS3 ||
              params.row?.status === ExportedFilesStatusNumber.UploadingToS3
                ? "In Progress"
                : params.row?.status === ExportedFilesStatusNumber.Open ||
                  params.row?.status === ExportedFilesStatusNumber.UploadFail ||
                  params.row?.status ===
                    ExportedFilesStatusNumber.ReportGenerateFail
                ? "Failed"
                : params.row?.status === ExportedFilesStatusNumber.Completed &&
                  "Complete"}
            </div>
          </div>
        );
      },
    },
    {
      field: "download",
      headerName: "",
      width: 150,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => handleDownload(params.row.id)}
          >
            <DownloadIcon />
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <div className="my-4 d-block align-items-center justify-content-between page-header-breadcrumb">
        <div>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Bulk Actions
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                handleBulkDownload();
              }}
              disableRipple
            >
              Download
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleBulkTrash();
              }}
              disableRipple
            >
              Delete
            </MenuItem>
          </StyledMenu>
        </div>
        <Box sx={{ height: "100%", width: "100%", backgroundColor: "#FFF" }}>
          <DataGrid
            rows={data}
            columns={header}
            loading={isLoading}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            pageSizeOptions={[25]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(x) => setSelected(x)}
            rowSelectionModel={selected}
          />
        </Box>
      </div>
    </Fragment>
  );
};

export default Exports;

Exports.propTypes = {
  color: PropTypes.oneOf(["red", "green", "orange"]),
};

const bulkActions = [
  { value: "download", label: "Download" },
  { value: "delete", label: "Delete" },
];
