import { Outlet } from "react-router-dom";
import classes from "./AppTemplate.module.css";
import cs from "classnames";

interface AppTemplateProps extends React.HTMLAttributes<HTMLDivElement> {}

const AppTemplate = ({
  children,
  className,
  ...props
}: AppTemplateProps): React.JSX.Element => {
  return (
    <div className={cs(classes.container, className)} {...props}>
      abc
      <Outlet />
    </div>
  );
};

export default AppTemplate;
