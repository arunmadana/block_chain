export const MENUITEMS = [
  {
    Items: [
      {
        icon: <i className="side-menu__icon bx bx-home"></i>,
        type: "link",
        path: "dashboards/profiles",
        Name: "",
        active: false,
        selected: false,
        title: "Business Profiles",
        class: "badge bg-warning-transparent ms-2",
      },
      {
        icon: <i className="side-menu__icon bx bx-home"></i>,
        type: "link",
        path: "dashboards/employees",
        Name: "",
        active: false,
        selected: true,
        title: "RYVYL Employees",
        class: "badge bg-warning-transparent ms-2",
      },
      {
        icon: <i className="side-menu__icon bx bx-home"></i>,
        type: "link",
        path: "dashboards/exports",
        Name: "",
        active: true,
        selected: false,
        title: "Exports",
        class: "badge bg-warning-transparent ms-2",
      },
    ],
  },
];
