"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./BackButton";
import Header from "./Header";
import Social from "./Social";

const CardWrapper = ({
  children,
  headerLabel,
  backButtonlabel,
  backButtonHref,
  showSocial,
}) => {
  return (
    <Card className="w-100 shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}

      <CardFooter>
        <BackButton label={backButtonlabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
