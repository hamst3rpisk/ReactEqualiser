import classes from "./Header.module.css";
import cs from "classnames";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header = ({
  children,
  className,
  ...props
}: HeaderProps): React.JSX.Element => {
  return (
    <div className={cs(classes.main, className)} {...props}>
      Audio Visualizer
      {children}
    </div>
  );
};

export default Header;
