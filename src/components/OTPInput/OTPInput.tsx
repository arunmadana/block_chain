import { Input as BaseInput } from "@mui/base/Input";
import { Box, styled } from "@mui/system";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LocalStorageKeysEnum } from "../../Enums/LocalStorageKeysEnum";
import { PermissionTypeEnum } from "../../Enums/PermissionTypeEnum";
import { storeUserDetails } from "../../Store/ducks/adminUserDetails";
import { setAuth, storeAuthInfo } from "../../Store/ducks/auth";
import { validateAppOtp } from "../../services/Login/Login";
import { getStorage, setStorage } from "../../services/Storage";

function OTP({
  separator,
  length,
  value,
  onChange,
}: {
  separator: React.ReactNode;
  length: number;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = React.useRef<HTMLInputElement[]>(
    new Array(length).fill(null)
  );

  const isPwdExpired = useSelector(
    (store: any) => store.loginDetails.isPwdExpired
  );
  const [userAuthorities, setUserAuthorities] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const authorities = getStorage(LocalStorageKeysEnum?.authorities);

  React.useEffect(() => {
    if (authorities) {
      setUserAuthorities(JSON.parse(authorities));
    }
  }, []);

  const focusInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const selectInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case " ":
        event.preventDefault();
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case "Delete":
        event.preventDefault();
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });

        break;
      case "Backspace":
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;

      default:
        break;
    }
  };

  const handleAPI = (otp: string) => {
    setIsLoading(true);
    const payload = {
      otp: otp,
    };
    validateAppOtp(payload)
      .then((res) => {
        const { jwtToken, userId } = res.data.data;
        const businessProfilesPermission = Object?.values(
          userAuthorities
        )?.find((each) => each == PermissionTypeEnum?.BusinessProfiles);
        setStorage(LocalStorageKeysEnum.jwtToken, jwtToken);
        dispatch(storeUserDetails({ id: userId }));
        setStorage(LocalStorageKeysEnum.stepupToken, jwtToken);
        dispatch(setAuth());
        dispatch(storeAuthInfo({ stepupToken: jwtToken }));
        setTimeout(() => {
          if (isPwdExpired === true) {
            navigate("/login/update-password");
          } else if (businessProfilesPermission) {
            navigate("/dashboards/profiles");
          } else {
            navigate("/admin-profile/user-details");
          }
        }, 1000);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const currentValue = event.target.value;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter].value &&
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1;
      } else {
        break;
      }
    }
    onChange((prev) => {
      const otpArray = prev.split("");
      const lastValue = currentValue[currentValue.length - 1];
      otpArray[indexToEnter] = lastValue;
      if (otpArray.length === 6) {
        handleAPI(otpArray.join(""));
      }
      return otpArray.join("");
    });
    if (currentValue !== "") {
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    currentIndex: number
  ) => {
    selectInput(currentIndex);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {new Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <BaseInput
            slots={{
              input: InputElement,
            }}
            aria-label={`Digit ${index + 1} of OTP`}
            slotProps={{
              input: {
                ref: (ele) => {
                  inputRefs.current[index] = ele!;
                },
                onKeyDown: (event) => handleKeyDown(event, index),
                onChange: (event) => handleChange(event, index),
                onClick: (event) => handleClick(event, index),
                value: value[index] ?? "",
              },
            }}
            disabled={isLoading}
          />
          {index === length - 1 ? null : separator}
        </React.Fragment>
      ))}
    </Box>
  );
}

export function OTPInput() {
  const [otp, setOtp] = React.useState("");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <OTP
        separator={<span> </span>}
        value={otp}
        onChange={setOtp}
        length={6}
      />
    </Box>
  );
}

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const InputElement = styled("input")(
  ({ theme }) => `
  width: 50px;
  height: 68px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 0px;
  border-radius: 8px;
  text-align: center;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
