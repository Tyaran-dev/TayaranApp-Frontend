import FlightEmailTemplate from '../../components/shared/FlightEmailTemplte';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Tayyran.com <info@primespa.site>',
      to: 'hashimsalahalden5@gmail.com',
      subject: "Booking Done",
      react: FlightEmailTemplate() as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}