import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import {
  Box,
  Checkbox,
  ListItemText,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC, Fragment, useEffect, useState } from "react";
import { APIKeyEnum } from "../../Enums/APIKeyEnum";
import { PhoneCountryListEnum } from "../../Enums/PhoneCountryListEnum";
import formatPhoneNumber from "../../helpers/formatPhoneNumber";
import {
  businessProfiles,
  profileListCount,
} from "../../services/customerProfiles/customerProfiles";
import { getPhoneCountryList } from "../../services/profiles/poc";
import styles from "./BusinessProfiles.module.scss";
import './BusinessProfiles.styles.scss'
import { internationalPhoneFormat } from "../../helpers/internationalPhoneFormat";

const BusinessProfiles: FC = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileCountries, setProfileCountries] = useState([]);
  const [activeCount, setActiveCount] = useState();
  const [underReviewCount, setUnderReviewCount] = useState();
  const [draftCount, setDraftCount] = useState();
  const [terminateCount, setTerminateCount] = useState();
  const [cancelledCount, setCancelledCount] = useState();
  const [statusDrop, setStatusDrop] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [openStatusKey, setOpenStatusKey] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  const getData = (payload: any) => {
    // Fetch business profiles
    const fetchBusinessProfiles = businessProfiles(payload)
      .then((res) => {
        const data = res?.data?.data;
        setIsLoading(false);
        setData(data?.items);
        const profilesCountryList = data?.items?.map((x: any) => ({
          countryShortCode: x?.phoneNumberDto?.countryCode,
          phoneCountryCode: null,
        }));

        return profilesCountryList;
      })
      .catch((error) => {
        setIsLoading(false);
      });

    // Fetch country list
    const fetchCountryList = getPhoneCountryList(
      PhoneCountryListEnum.POCCountryList
    )
      .then((res) => {
        const data = res?.data?.data;
        const countryList = data?.map((item: any) => ({
          countryShortCode: item?.countryShortCode,
          phoneCountryCode: item?.phoneCountryCode,
        }));
        return countryList;
      })
      .catch((err) => {
        console.log(err);
      });

    Promise.all([fetchBusinessProfiles, fetchCountryList]).then(
      ([profilesCountryList, countryList]) => {
        // Update phoneNumber with countryShortCode if there's a match
        profilesCountryList?.map((profile: any) => {
          const matchingCountry = countryList?.find(
            (country: any) =>
              country?.countryShortCode === profile?.countryShortCode
          );
          if (matchingCountry) {
            profile.phoneCountryCode = matchingCountry?.phoneCountryCode;
          }
        });
        setProfileCountries(profilesCountryList);
        setIsLoading(false);
      }
    );

    // After both API calls are complete, modify the data
  };

  const countData = (countPayload: any) => {
    profileListCount(countPayload)
      .then((res) => {
        const data = res?.data?.data;
        const active = data?.filter(
          (x: any) => x?.statusType === APIKeyEnum.Active
        );
        const draft = data?.filter(
          (x: any) => x?.statusType === APIKeyEnum.Draft
        );
        const underReview = data?.filter(
          (x: any) => x?.statusType === APIKeyEnum["Under Review"]
        );
        const terminated = data?.filter(
          (x: any) => x?.statusType === APIKeyEnum.Terminated
        );
        const cancelled = data?.filter(
          (x: any) => x?.statusType === APIKeyEnum.Cancelled
        );
        setActiveCount(active[0]?.count);
        setUnderReviewCount(underReview[0]?.count);
        setDraftCount(draft[0]?.count);
        setTerminateCount(terminated[0]?.count);
        setCancelledCount(cancelled[0]?.count);
      })
      .catch((err) => {
        const messgae = err?.response?.data?.data;
        console.log(messgae);
      });
  };

  const mergedData = data?.map((item: any) => {
    const matchingProfile = profileCountries?.find(
      (profile: any) =>
        profile?.countryShortCode === item?.phoneNumberDto?.countryCode
    );

    // Check if there is a matching profile and update the phoneNumber accordingly
    if (matchingProfile) {
      item.phoneNumberDto.phoneNumber = `${item?.phoneNumberDto?.phoneNumber} ${matchingProfile?.phoneCountryCode}`;
    }
    return item;
  });

  const handleSearchApi = (data: any) => {
    setIsLoading(true);
    const payload = {
      status: data,
      searchKey: searchInput?.toUpperCase().replace("BID-", ""),
      sortProperties: "name",
      sortDirection: "ASC",
      pageNo: 0,
      pageSize: 25,
    };
    getData(payload);
  };

  useEffect(() => {
    const payload = {
      status: [],
      searchKey: "",
      sortProperties: "name",
      sortDirection: "ASC",
      pageNo: 0,
      pageSize: 25,
    };
    getData(payload);

    const countPayload = {
      status: [
        APIKeyEnum.Active,
        APIKeyEnum.Draft,
        APIKeyEnum["Under Review"],
        APIKeyEnum.Terminated,
        APIKeyEnum.Cancelled,
      ],
      searchKey: "",
    };
    countData(countPayload);
  }, []);

  const header: GridColDef[] = [
    {
      field: "name",
      headerName: "BUSINESS NAME",
      width: 300,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "id",
      headerName: "BUSINESS ID",
      width: 400,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return <div>{`BID-${params.row.id}`}</div>;
      },
    },
    {
      field: "email",
      headerName: "COMPANY EMAIL",
      width: 300,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "companyNumber",
      headerName: "COMPANY NUMBER",
      width: 400,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <p>
            {params.row?.phoneNumberDto?.phoneNumber?.split(" ")[1]}
            &nbsp;
            {params.row?.phoneNumberDto?.countryCode === "US"
              ? formatPhoneNumber(
                  params.row?.phoneNumberDto?.phoneNumber?.split(" ")[0]
                )
              : internationalPhoneFormat(
                  params.row?.phoneNumberDto?.phoneNumber?.split(" ")[0]
                )}
          </p>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
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
              statusList[params.row.status]?.color
            }`}
          >
            <div
              className={`chip__text--${statusList[params.row.status]?.color} `}
            >
              {statusList[params.row.status]?.label}
            </div>
          </div>
        );
      },
    },
  ];

  const handleDeptChange = (data: any) => {
    let array: any = [];
    const dataT = statusDrops.data.filter((x: any) => x.name.includes(data));
    array.push(dataT);
    setStatusDrop(dataT);
    handleSearchApi([dataT[0].id]);
  };

  return (
    <Fragment>
      <div className={styles.topBar}>
        <div className={styles.headerName}>Business Profiles</div>
        <Button>{"Add Business"}</Button>
      </div>
      <Box sx={{ height: "100%", width: "100%", backgroundColor: "#FFF" }}>
        <div className={styles.headerTop}>
          <FormControl>
            <Select
              displayEmpty={true}
              renderValue={(value: any) =>
                value?.length
                  ? Array.isArray(value)
                    ? value.join(", ")
                    : value
                  : "All Status"
              }
              onChange={(name) => {
                handleDeptChange(name.target.value);
              }}
              style={{ height: "40px" }}
            >
              {statusDrops.data.map((name: any) => (
                <MenuItem key={name.id} value={name.name}>
                  <Checkbox
                    checked={
                      statusDrop.length > 0 && statusDrop[0]?.id === name.id
                        ? true
                        : false
                    }
                    defaultValue={"All Status"}
                  />
                  <ListItemText primary={name.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={styles.rightPane}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpenExport(true)}
            >
              {"Exports"}
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpenStatusKey(true)}
            >
              {"Status Key"}
            </Button>
            <FormControl
              style={{
                width: "300px",
              }}
            >
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchApi}
                placeholder="Search By Name or ID"
              />
            </FormControl>
          </div>
        </div>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "#FFF",
            padding: "30px",
          }}
        >
          <DataGrid
            rows={mergedData}
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
            checkboxSelection={false}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
      <StatusKey
        show={openStatusKey}
        handleClose={() => setOpenStatusKey(false)}
      />
      <Export show={openExport} handleClose={() => setOpenExport(false)} />
    </Fragment>
  );
};

export default BusinessProfiles;

const statusList: any = {
  1: { color: "green", label: "Active" },
  2: { color: "light-black", label: "Draft" },
  3: { color: "blue", label: "Under Review" },
  4: { color: "red", label: "Terminated" },
  5: { color: "light-gray", label: "Cancelled" },
};

const statusDrops: any = {
  data: [
    { id: 0, name: "In Progress" },
    { id: 1, name: "Active" },
    { id: 2, name: "Draft" },
    { id: 3, name: "Under Review" },
    { id: 4, name: "Terminated" },
    { id: 5, name: "Cancelled" },
  ],
};

const StatusKey = ({ show, handleClose = () => {} }) => {
  const statusKeyData = [
    {
      color: "light-black",
      status: "Draft",
      description:
        "Drafts are new businesses that have not been configured yet.",
    },
    {
      color: "green",
      status: "Active",
      description: "Active accounts are businesses that have no restrictions.",
    },
    {
      color: "blue",
      status: "Under Review",
      description:
        "Admin Risk manually changed the account status to Under Review. All account features are disabled under the business until a decision is made to terminate or reactivate.",
    },
    {
      color: "red",
      status: "Terminated",
      description:
        "Risk team manually changed the account status to Terminated and all account features are disabled.",
    },
    {
      color: "light-gray",
      status: "Cancelled",
      description:
        "Risk team manually changed the account status to Cancelled per user request, account was cancelled by client and no features available.",
    },
  ];

  return (
    <Modal open={show} onClose={handleClose}>
      <Box className={styles.statusKey}>
        <div>
          <h1 className={styles.statusHeader}>Status Key</h1>
        </div>
        <div className={styles.statusBody}>
          {statusKeyData?.map((data, i) => {
            return (
              <div
                className={`${styles.statusFullWidth} ${
                  data?.color === "light-gray" && styles.noBorder
                }`}
                key={i}
              >
                <div className={styles.statusPosition}>
                  <div className={`chips--${data?.color} ${styles.chipTop}`}>
                    <div className={`chips__text--${data?.color}`}>
                      {data?.status}
                    </div>
                  </div>
                  <div className={styles.activeChipBody}>
                    {data?.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </Modal>
  );
};

const Export = ({ show, handleClose = () => {} }) => {
  const statusKeyData = [
    {
      color: "light-black",
      status: "Draft",
      description:
        "Drafts are new businesses that have not been configured yet.",
    },
    {
      color: "green",
      status: "Active",
      description: "Active accounts are businesses that have no restrictions.",
    },
    {
      color: "blue",
      status: "Under Review",
      description:
        "Admin Risk manually changed the account status to Under Review. All account features are disabled under the business until a decision is made to terminate or reactivate.",
    },
    {
      color: "red",
      status: "Terminated",
      description:
        "Risk team manually changed the account status to Terminated and all account features are disabled.",
    },
    {
      color: "light-gray",
      status: "Cancelled",
      description:
        "Risk team manually changed the account status to Cancelled per user request, account was cancelled by client and no features available.",
    },
  ];

  return (
    <Modal open={show} onClose={handleClose}>
      <Box className={styles.statusKey}>
        <div>
          <h1 className={styles.statusHeader}>Status Key</h1>
        </div>
        <div className={styles.statusBody}>
          {statusKeyData?.map((data, i) => {
            return (
              <div
                className={`${styles.statusFullWidth} ${
                  data?.color === "light-gray" && styles.noBorder
                }`}
                key={i}
              >
                <div className={styles.statusPosition}>
                  <div className={`chips--${data?.color} ${styles.chipTop}`}>
                    <div className={`chips__text--${data?.color}`}>
                      {data?.status}
                    </div>
                  </div>
                  <div className={styles.activeChipBody}>
                    {data?.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </Modal>
  );
};
