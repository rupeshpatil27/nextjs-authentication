import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export default function TwoFactorEmail({ name, otp }) {
  return (
    <Html>
      <Head />
      <Preview>Your {otp} is your security verification code</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg mx-auto p-10 my-10 max-w-116.25">
            <Heading className="text-black text-2xl font-bold p-0 my-8 mx-0 text-center">
              Security Verification
            </Heading>

            <Text className="text-black text-base leading-6">
              Hello {name},
            </Text>

            <Text className="text-gray-700 text-base leading-6">
              Use the verification code below to sign in to your account. This
              code will expire in **10 minutes**.
            </Text>

            <Section className="bg-gray-50 rounded-md my-8 p-4 text-center">
              <Text className="text-3xl font-bold m-0 text-blue-600">
                {otp}
              </Text>
            </Section>

            <Text className="text-gray-500 text-sm italic">
              If you didn't request this, you can safely ignore this email.
              Someone else might have typed your email address by mistake.
            </Text>

            <Hr className="border-gray-200 my-8" />

            <Text className="text-gray-400 text-xs text-center">
              © 2025 Your Company Name. All rights reserved. <br />
              This is an automated security notification.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
