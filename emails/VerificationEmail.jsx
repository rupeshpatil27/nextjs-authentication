import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

export default function VerificationEmail({ name, token }) {

  const verificationLink = `http://localhost:3000/new-verification?token=${token}`;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Complete your registration by verifying your email address.</Preview>
      <Section style={main}>
        <Row>
          <Heading as="h2">Hello {name || "there"},</Heading>
        </Row>
        <Row>
          <Text style={paragraph}>
            Thank you for registering. To complete your sign-up and secure your account, 
            please click the button below to verify your email address:
          </Text>
        </Row>
        <Row style={{ marginTop: '24px', marginBottom: '24px' }}>
          <Button
            href={verificationLink}
            style={button}
          >
            Verify Email Address
          </Button>
        </Row>
        <Row>
          <Text style={footer}>
            If the button doesn&apos;t work, copy and paste this link into your browser: <br />
            <span style={linkText}>{verificationLink}</span>
          </Text>
        </Row>
        <Row>
          <Text style={footer}>
            If you did not request this email, you can safely ignore it.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  padding: '20px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  padding: '12px 24px',
};

const footer = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '20px',
};

const linkText = {
  color: '#2563eb',
  fontSize: '12px',
};


// import {
//   Html,
//   Head,
//   Font,
//   Preview,
//   Heading,
//   Row,
//   Section,
//   Text,
//   Button,
// } from '@react-email/components';

// export default function VerificationEmail({ name, otp }) {
//   return (
//     <Html lang="en" dir="ltr">
//       <Head>
//         <title>Verification Code</title>
//         <Font
//           fontFamily="Roboto"
//           fallbackFontFamily="Verdana"
//           webFont={{
//             url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
//             format: 'woff2',
//           }}
//           fontWeight={400}
//           fontStyle="normal"
//         />
//       </Head>
//       <Preview>Here&apos;s your verification code: {otp}</Preview>
//       <Section>
//         <Row>
//           <Heading as="h2">Hello {name},</Heading>
//         </Row>
//         <Row>
//           <Text>
//             Thank you for registering. Please use the following verification
//             code to complete your registration:
//           </Text>
//         </Row>
//         <Row>
//           <Text>{otp}</Text> 
//         </Row>
//         <Row>
//           <Text>
//             If you did not request this code, please ignore this email.
//           </Text>
//         </Row>
//         {/* <Row>
//           <Button
//             href={`http://localhost:3000/verify/${username}`}
//             style={{ color: '#61dafb' }}
//           >
//             Verify here
//           </Button>
//         </Row> */}
//       </Section>
//     </Html>
//   );
// }