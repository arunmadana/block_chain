import { Button } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { LocalStorageKeysEnum } from "../../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../../Enums/PermissionTypeEnum";
import Chip from "../../../components/Chip/Chip";
import {
  FormField,
  FormTextArea,
} from "../../../components/FormField/FormField";
import Modal from "../../../components/Modal/Modal";
import Spinner from "../../../components/Spinner/Spinner";
import { getStorage } from "../../../services/Storage";
import {
  addIPAddress,
  deleteIPAddress,
  getIPList,
} from "../../../services/profiles/poc";
import styles from "./BusinessDetailsIPAddress.module.scss";
import "./BusinessDetailsIPAddress.style.scss";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function BusinessDetailsIPAddress() {
  const { id: tenantId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ipData, setIpData] = useState([]);
  const [isDeleteIp, setIsDeleteIp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const getIPAddressList = () => {
    setIsLoading(true);
    const data = {
      tenantId: tenantId,
      //As per BE we need to hardcode the value, we are using this value here only i.e the reason i didn't create enum - Nagoor B
      sortProperties: "created_date",
    };
    getIPList(data)
      .then((res) => {
        const data = res?.data?.data?.items;
        setIpData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.data?.error?.errorDescription);
      });
  };

  useEffect(() => {
    getIPAddressList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (row) => {
    setIsDeleteIp(row);
    setIsOpen(true);
  };

  const handleRemoveIP = () => {
    const rowID = isDeleteIp.id;
    setIsLoading(true);
    deleteIPAddress(rowID)
      .then((res) => {
        const data = res?.data?.data?.message;
        console.log(data);
        setIsOpen(false);
        getIPAddressList();
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response?.data?.error?.errorDescription);
        setIsLoading(false);
      });
  };

  //  Checking with authorites to edit and disable Add IP Address.
  useEffect(() => {
    const userAuthority = getStorage(LocalStorageKeysEnum?.authorities);
    const isBusinessEditAuthority = JSON.parse(userAuthority);
    setIsEdit(
      isBusinessEditAuthority?.ADMIN_BUSINESS_EDIT ==
        PermissionTypeEnum?.BusinessProfilesEdit
    );
  }, []);

  const rolesHeader: GridColDef[] = [
    {
      field: "ipAddress",
      headerName: "IP ADDRESS",
      width: 150,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      width: 200,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "lastUsed",
      headerName: "LAST USED",
      width: 250,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 150,
      sortable: false,
      filterable: false,
      disableReorder: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "menu",
      headerName: "",
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
            <DeleteIcon />
          </button>
        ) : (
          ""
        );
      },
    },
  ];

  return (
    <>
      {isLoading === false ? (
        ipData?.length < 1 ? (
          <div className={styles.noData}>
            <p className={styles.noIPAddressData}>No IP Address Exists</p>
            {isEdit ? (
              <Button onClick={() => setIsModalOpen(true)}>
                Add IP Address
              </Button>
            ) : (
              <>
                <button
                  className={styles.noDefaultEdit}
                  disabled={isEdit}
                  data-tooltip-id="noEdit"
                  type="button"
                >
                  Add IP Address
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={styles.mainIpList}>
            <button
              className={!isEdit ? styles.noEdit : styles.addIpBtn}
              onClick={() => setIsModalOpen(true)}
              disabled={!isEdit}
              data-tooltip-id="noEdit"
            >
              <span className={`icon-plus`} />
              Add IP Address
            </button>
            {/* <div className={'tableIp'}>
              <Table
                BusinessTable={true}
                selectable={false}
                removeSpace={true}
                data={ipData}
                columns={[
                  {
                    column: 'ipAddress',
                    label: 'IP ADDRESS'
                  },
                  {
                    column: 'description',
                    label: 'DESCRIPTION',
                    cell: (row) => (
                      <div className={styles.desc}>
                        <p className={styles.word}>{row.description}</p>
                      </div>
                    )
                  },
                  {
                    column: 'lastUsed',
                    label: 'LAST USED',
                    cell: (row) => (
                      <div>
                        {userDateTime(
                          row.lastUsed,
                          false,
                          'MM/DD/YYYY HH:mm:ss.ma'
                        )}
                      </div>
                    )
                  },
                  {
                    column: 'status',
                    label: 'STATUS',
                    cell: (row) => {
                      return (
                        <div className={styles.mainStatus}>
                          <StatusChip status={row.status} />
                          <div
                            className={`${
                              isEdit
                                ? styles.statusDelete
                                : styles.statusDisable
                            }`}
                            onClick={() => {
                              isEdit && handleDelete(row);
                            }}
                          >
                            <p
                              className={`icon-trash ${styles.trashIcon}`}
                              // Taken confirmation from Taj to Add Remove IP toot-tip
                              data-tooltip-content={'Remove IP Address'}
                              data-tooltip-id={`deleteIcon`}
                              id="deleteIcon"
                            >
                              {isEdit && (
                                <ReactTooltip
                                  id="deleteIcon"
                                  className={styles.tooltipContainer}
                                  place="top"
                                  positionStrategy={'fixed'}
                                />
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  }
                ]}
              />
            </div> */}
            <DataGrid
              sx={{
                cursor: "pointer",
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                  outline: "none !important",
                },
                marginTop: "20px",
              }}
              rows={ipData}
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
            />
          </div>
        )
      ) : (
        <p className={styles.noData}>
          <Spinner />
        </p>
      )}
      <AddIPAddress
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={tenantId}
        getIPAddressList={() => getIPAddressList()}
        isLoading={isLoading}
      />
      <RemoveIPAddress
        show={isOpen}
        handleClose={() => setIsOpen(false)}
        hanldeRemove={() => handleRemoveIP()}
        isLoading={isLoading}
      />
    </>
  );
}

const statusList = {
  1: { status: "Approved", color: "green" },
  2: { status: "Declined", color: "red" },
};

const StatusChip = ({ status }) => (
  <Chip color={statusList[status]?.color}>{statusList[status]?.status}</Chip>
);

const AddIPAddress = ({ show, onClose, userId, getIPAddressList }) => {
  const [step, setStep] = useState(0);
  const businessDetails = localStorage.getItem("businessDetails");
  const businessName = JSON.parse(businessDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldId, setFieldId] = useState(0);
  const [isIpAddress, setIsIpAddress] = useState([]);
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  const handleClose = () => {
    onClose();
    setFieldId(0);
    setStep(0);
  };

  const validationSchema = Yup.object().shape({
    ipAddressArray: Yup.array().of(
      Yup.object().shape({
        ipAddress: Yup.string()
          .required("IP Address is required")
          .matches(
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
            "IP Address is Invalid"
          )
          .matches(/^(?!\s+$)/, "IP Address cannot contain only blank spaces")
          .test("unique-ip", "IP Address must be unique", function (value) {
            const { path, createError } = this;
            const ipAddressArray = this.from[1].value.ipAddressArray; // access the parent object
            const ipAddresses = ipAddressArray.map((item) => item.ipAddress); // get all the ipAddresses from the array
            const currentIndex = ipAddressArray.findIndex(
              (item) => item.ipAddress === value
            ); // find the index of the current field being validated
            const isUnique =
              ipAddresses
                .filter((item, index) => index !== currentIndex)
                .indexOf(value) === -1; // check if the value is unique within the array
            return (
              isUnique ||
              createError({ path, message: "IP Address already exists" })
            );
          }),

        description: Yup.string()
          .required("Description is required")
          .matches(/^(?!\s+$)/, "Description cannot contain only blank spaces")
          .test(
            "no-emojis",
            "Description cannot contain emojis.",
            function (value) {
              const hasEmoji = emojiRegex.test(value);
              return !hasEmoji;
            }
          ),
      })
    ),
  });

  const handleSubmit = async (values) => {
    const { ipAddressArray } = values;
    setIsIpAddress(ipAddressArray);
    setIsLoading(true);
    try {
      const promises = ipAddressArray.map(async (item) => {
        const IPdata = {
          tenantId: userId,
          ipAddressRequests: [item],
        };
        await addIPAddress(IPdata);
      });
      // Wait for all promises to resolve
      await Promise.all(promises);
      setStep(1);
      getIPAddressList();
      setIsLoading(false);
    } catch (err) {
      console.log(err.response?.data?.error?.errorDescription);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      showCloseButton={true}
      className={`${
        step === 0
          ? styles.addIPModal
          : step === 1
          ? styles.sucessModal
          : styles.AddIPModal1
      }`}
      show={show}
      onClose={handleClose}
    >
      {step === 1 ? (
        <div className={styles.sucessBody}>
          <p className={styles.title}>IP Address Added</p>
          <div className={styles.sucessContent}>
            <p>
              The following IP&nbsp;
              {isIpAddress?.length > 1 ? "Addresses" : "Address"}
              &nbsp;{isIpAddress?.length > 1 ? "have" : "has"}&nbsp;been added:
            </p>
            {isIpAddress?.map((ip, i) => (
              <span key={i}>{ip.ipAddress}</span>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.details}>
            <Formik
              initialValues={{
                ipAddressArray: [{ ipAddress: "", description: "" }],
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                isValid,
                dirty,
                errors,
                touched,
              }) => (
                <div>
                  <div className={styles.ipBody}>
                    <p className={styles.title}>New IP Address</p>
                    <p className={styles.subtitle}>
                      Authorize IP addresses for this business.
                    </p>
                  </div>
                  <p
                    className={`${
                      values?.ipAddressArray.length > 0
                        ? styles.businessNameBorder
                        : styles.businessName
                    }`}
                  >
                    <span>Business Name</span>
                    <span>{businessName?.name}</span>
                  </p>
                  <Form>
                    <FieldArray
                      name="ipAddressArray"
                      render={(filedHelpers) => (
                        <div>
                          {values?.ipAddressArray?.map((item, index) => {
                            return (
                              <div key={index}>
                                <details
                                  open={fieldId === index}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <summary
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setFieldId(
                                        fieldId === index ? null : index
                                      );
                                    }}
                                    className={styles.summary}
                                  >
                                    {fieldId === index ? null : (
                                      <>
                                        <div
                                          className={`${
                                            (index === 1 || index === 2) &&
                                            values.ipAddressArray.length - 1
                                              ? styles.noBorderBottom
                                              : styles.ViewIpAddress
                                          }`}
                                        >
                                          <p>
                                            IP Address&nbsp;
                                            {values.ipAddressArray.length > 1 &&
                                              index + 1}
                                          </p>
                                          {values.ipAddressArray[index]
                                            .ipAddress !== "" &&
                                          values.ipAddressArray[index]
                                            .description !== "" ? (
                                            <p className={styles.ipNumber}>
                                              {
                                                values.ipAddressArray[index]
                                                  .ipAddress
                                              }
                                              <p className="edit-background">
                                                <span
                                                  className="icon-edit"
                                                  data-tooltip-content={"Edit"}
                                                  data-tooltip-id="edit"
                                                  id="edit"
                                                />
                                              </p>
                                            </p>
                                          ) : (
                                            <span
                                              className={styles.incompleteIp}
                                            >
                                              Incomplete
                                            </span>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </summary>
                                  <div>
                                    <div
                                      className={` ${
                                        (index === 1 || index === 2) &&
                                        values.ipAddressArray.length - 1
                                          ? styles.noTopBorder
                                          : styles.ipAddressDetails
                                      }`}
                                    >
                                      <div className={styles.ipAddress}>
                                        <p>
                                          IP Address&nbsp;
                                          {values.ipAddressArray.length > 1 &&
                                            index + 1}
                                        </p>
                                        <p>
                                          <FormField
                                            className={styles.ipFlieds}
                                            autoFocus={true}
                                            placeholder="IP Address"
                                            label="IP Address"
                                            name={`ipAddressArray.[${index}].ipAddress`}
                                            value={item.ipAddress}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isSemibold={true}
                                            chargeBackText={false}
                                            error={
                                              errors.ipAddressArray &&
                                              errors.ipAddressArray[index] &&
                                              errors.ipAddressArray[index]
                                                .ipAddress &&
                                              touched.ipAddressArray &&
                                              touched.ipAddressArray[index] &&
                                              touched.ipAddressArray[index]
                                                .ipAddress
                                            }
                                          />
                                          <ErrorMessage
                                            name={`ipAddressArray.[${index}].ipAddress`}
                                            component="div"
                                            className={styles.error}
                                          />
                                        </p>
                                      </div>
                                      <div className={styles.ipAddress}>
                                        <p className={styles.ipDesc}>
                                          Description
                                        </p>
                                        <p>
                                          <FormTextArea
                                            className={styles.textarea}
                                            placeHolder="IP Address Description"
                                            label="IP Address Description"
                                            charLimit={120}
                                            disableSpace={true}
                                            name={`ipAddressArray.[${index}].description`}
                                            value={item.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isNormal={true}
                                            error={
                                              errors.ipAddressArray &&
                                              errors.ipAddressArray[index] &&
                                              errors.ipAddressArray[index]
                                                .description &&
                                              touched.ipAddressArray &&
                                              touched.ipAddressArray[index] &&
                                              touched.ipAddressArray[index]
                                                .description
                                            }
                                          />
                                          <ErrorMessage
                                            name={`ipAddressArray.${index}.description`}
                                            component="div"
                                            className={styles.desError}
                                          />
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </details>
                              </div>
                            );
                          })}
                          <div className={styles.btnSection}>
                            {values?.ipAddressArray.length < 3 && (
                              <p
                                className={`${
                                  !(isValid && dirty)
                                    ? styles.defaultCursor
                                    : styles.AddIco
                                }`}
                                onClick={() => {
                                  isValid &&
                                    dirty &&
                                    values.ipAddressArray.length < 3 &&
                                    filedHelpers.push({
                                      ipAddress: "",
                                      description: "",
                                    });
                                  isValid &&
                                    dirty &&
                                    setFieldId(values.ipAddressArray?.length);
                                }}
                              >
                                <>
                                  <span className="icon-plus" />
                                  <p>Add Additional IP Address</p>
                                </>
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    />
                    <div
                      className={`${
                        values?.ipAddressArray?.length === 3
                          ? styles.btnSectionBorder
                          : styles.btnSection
                      }`}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading || !(isValid && dirty)}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </div>
      )}
    </Modal>
  );
};

const RemoveIPAddress = ({
  show,
  handleClose,
  hanldeRemove,
  isLoading = false,
}) => {
  return (
    <Modal
      show={show}
      onClose={handleClose}
      showCloseButton={true}
      className={styles.removeIPModal}
    >
      <div className={styles.removeIPBody}>
        <p className={styles.removeTitle}>Remove IP Address?</p>
        <p className={styles.areuSure}>
          Are you sure you want to remove this IP address?
        </p>
        <div className={styles.removeBtn}>
          <Button onClick={hanldeRemove} disabled={isLoading}>
            Remove
          </Button>
          <p onClick={handleClose}>Cancel</p>
        </div>
      </div>
    </Modal>
  );
};
