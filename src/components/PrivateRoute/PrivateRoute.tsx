import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute({ component, ...rest }: any) {
  const isAuthed = useSelector((store) => store.auth.isAuthed);
  if (false) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
}
