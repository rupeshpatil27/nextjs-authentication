import { FaExclamationTriangle } from "react-icons/fa";
import CardWrapper from "./CardWrapper";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Opps! Something went wrong!"
      backButtonHref="/sign-in"
      backButtonlabel="Back to login"
    >
      <div className="w-full flex justify-center"><FaExclamationTriangle  className="text-destructive"/></div>
    </CardWrapper>
  );
};

export default ErrorCard;
