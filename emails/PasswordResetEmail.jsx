import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function PasswordResetEmail({ name = "User", token }) {
  const domain = process.env.NEXT_PUBLIC_APP_URL;
  const url = `${domain}/new-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email to reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Verify your email</Text>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Please verify your email address to continue with your password
            reset request.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={url}>
              Verify Email
            </Button>
          </Section>

          <Text style={footer}>
            If the button doesn&apos;t work, copy and paste this link into your
            browser: <br />
            <span style={linkText}>{url}</span>
          </Text>
          <Text style={footer}>
            If you didn't request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "24px",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
};

const btnContainer = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  padding: "12px 20px",
  textDecoration: "none",
};

const footer = {
  fontSize: "14px",
  color: "#8c8c8c",
  marginTop: "32px",
};

const linkText = {
  color: "#2563eb",
  fontSize: "12px",
};
