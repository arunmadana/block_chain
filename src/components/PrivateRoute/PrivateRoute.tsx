import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute({ component, ...rest }) {
  const isAuthed = useSelector((store) => store.auth.isAuthed);
  if (!isAuthed) {
    return <Navigate to={"login"} />;
  }
  return <Outlet />;
}
