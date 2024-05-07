import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { formatInTimeZone } from "date-fns-tz";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { transporter, mailOptions } from "@/lib/nodemailer";
import { Company, FatigueSleepReport, LogisticsCenter } from "@prisma/client";


const generateEmailContent = ({ report }: { report: FatigueSleepReport & { logisticsCenter: LogisticsCenter & { company: Company | null } | null } }) => {
  const baseUrl = process.env.NEXTAUTH_URL
  // const link = `${baseUrl}/${companyToken.token}`

  return {
    text: "Alerta de Reporte de Fatiga Crítico",
    html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="x-apple-disable-message-reformatting"><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><title></title><style type="text/css">@media only screen and (min-width: 620px) {.u-row {width: 600px !important;}.u-row .u-col {vertical-align: top;}.u-row .u-col-100 {width: 600px !important;}}@media (max-width: 620px) {.u-row-container {max-width: 100% !important;padding-left: 0px !important;padding-right: 0px !important;}.u-row .u-col {min-width: 320px !important;max-width: 100% !important;display: block !important;}.u-row {width: 100% !important;}.u-col {width: 100% !important;}.u-col>div {margin: 0 auto;}}body {margin: 0;padding: 0;}table,tr,td {vertical-align: top;border-collapse: collapse;}p {margin: 0;}.ie-container table,.mso-container table {table-layout: fixed;}* {line-height: inherit;}a[x-apple-data-detectors='true'] {color: inherit !important;text-decoration: none !important;}table,td {color: #000000;}#u_body a {color: #0000ee;text-decoration: underline;}</style><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css"><!--<![endif]--></head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000"><!--[if IE]><div class="ie-container"><![endif]--><!--[if mso]><div class="mso-container"><![endif]--><table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]--><div class="u-row-container" style="padding: 0px;background-color: transparent"><div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"><div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #e6f0fe;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"><div style="background-color: #e6f0fe;height: 100%;width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]--><table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px;padding-left: 0px;" align="center"><img align="center" border="0" src="${report.logisticsCenter?.company?.logoImgUrl}" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 32%;max-width: 179.2px;"width="179.2" /></td></tr></table></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"><div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"><div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #03787c;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 4px solid #1c2b50;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"><div style="background-color: #03787c;height: 100%;width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 4px solid #1c2b50;"><!--<![endif]--><table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"><!--[if mso]><table width="100%"><tr><td><![endif]--><h2 style="margin: 0px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word; font-family: inherit; font-size: 20px; font-weight: 400;"><strong>Reporte de Fatiga Crítico</strong></h2><!--[if mso]></td></tr></table><![endif]--></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"><div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"><div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #f9f9f9;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"><div style="background-color: #f9f9f9;height: 100%;width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]--><table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"><div style="font-family: inherit; font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;"><div>&nbsp;</div><div><p style="line-height: 140%;">Queremos informarle que se ha registrado un reporte de fatiga con estado crítico en nuestra plataforma. A continuación, encontrará los detalles del reporte:</p><ul style="list-style-type: disc;"><li style="line-height: 19.6px;"><strong>Conductor</strong>: [Nombre del Conductor]</li><li style="line-height: 19.6px;"><strong>Supervisor</strong>: [Nombre del Supervisor]</li><li style="line-height: 19.6px;"><strong>Ciudad</strong>: [Nombre de la Ciudad]</li></ul><p style="line-height: 140%;">Por favor, tome las medidas necesarias para abordar esta situación lo antes posible.</p></div></div></td></tr></tbody></table><table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"><!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]--><div align="center"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:60px; v-text-anchor:middle; width:93px;" arcsize="6.5%"  stroke="f" fillcolor="#03787c"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]--><a href="" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #03787c; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 15px;"><span style="display:block;padding:12px;line-height:120%;">ver reporte</span></a><!--[if mso]></center></v:roundrect><![endif]--></div></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"><div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"><div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"><div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]--><table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:30px 15px 11px;font-family:'Cabin',sans-serif;" align="left"><div style="font-size: 12px; line-height: 140%; text-align: center; word-wrap: break-word;"><p style="line-height: 140%;">Este correo ha sido generado automáticamente. No es necesario responder. </p></div></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"><div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;"><div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]--><!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #e6f0fe;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]--><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"><div style="background-color: #e6f0fe;height: 100%;width: 100% !important;"><!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]--><table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px;padding-left: 0px;" align="center"><img align="center" border="0" src="https://grupohseq.com/wp-content/uploads/2024/04/tisog-by-grupohseq.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;"width="150.8" /></td></tr></table></td></tr></tbody></table><!--[if (!mso)&(!IE)]><!--></div><!--<![endif]--></div></div><!--[if (mso)|(IE)]></td><![endif]--><!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]--></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></td></tr></tbody></table><!--[if mso]></div><![endif]--><!--[if IE]></div><![endif]--></body></html>`
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { reportId: string } }
) {
  const session = await getServerSession(authOptions);
  try {
    if (!session) return new NextResponse("Unauthorized", { status: 401 })
    if (!params.reportId) return new NextResponse("Bad request", { status: 400 })
    const values = await req.json();

    const date = new Date()
    const colombiaTime = formatInTimeZone(date, 'America/Bogota', 'yyyy-MM-dd HH:mm:ssXXX');
    const newDate = new Date(colombiaTime)

    const report = await db.fatigueSleepReport.findUnique({
      where: {
        id: params.reportId
      },
      include: {
        city: {
          select: {
            realName: true,
          }
        },
        logisticsCenter: {
          include: {
            company: true
          }
        },
        driver: {
          select: {
            fullname: true,
            position: {
              select: {
                name: true
              }
            },
          }
        },
      }
    })
    if (!report) return new NextResponse("Bad request", { status: 400 })

    let totalItems = 0;
    if (values.appearances && values.appearances.trim() !== "") totalItems += values.appearances.split(",").length;
    if (values.moods && values.moods.trim() !== "") totalItems += values.moods.split(",").length;
    if (values.performances && values.performances.trim() !== "") totalItems += values.performances.split(",").length;
    if (values.drivingModes && values.drivingModes.trim() !== "") totalItems += values.drivingModes.split(",").length;


    let riskLevel = "LOW";
    if (totalItems >= 5 && totalItems <= 10) {
      riskLevel = "MEDIUM";
    } else if (totalItems > 10) {
      riskLevel = "HIGH";
    }

    const admins = await db.user.findMany({
      where: {
        role: "ADMIN",
        active: true
      }
    })


    if (riskLevel === "HIGH") {
      try {
        for (const admin of admins) {
          await transporter.sendMail({
            ...mailOptions,
            to: admin.email,
            ...generateEmailContent({ report }),
            text: "Correo de reporte de fatiga nivel crítico",
            subject: `Correo de reporte de fatiga nivel crítico`,
          });
        }
        //  NextResponse.json({ message: "ok", status: 200 });
      } catch (error) {
        console.log("[SEND-EMAIL-CRITICAL-REPORT", error);
        //  new NextResponse("Internal Errorr", { status: 500 });
      }
    }


    if (report.state === "PENDING") {
      const reportUpdated = await db.fatigueSleepReport.update({
        where: { id: params.reportId },
        data: {
          date: newDate,
          riskLevel: riskLevel,
          ...values,
          state: "SEND"
        },
      });

      return NextResponse.json(reportUpdated);
    } else {
      const reportUpdated = await db.fatigueSleepReport.update({
        where: { id: params.reportId },
        data: { riskLevel: riskLevel, ...values },
      });

      // values.state == "SEND" ? (

      //   await db.fatigueReportEvent.create({
      //     data: {
      //       eventType: "SENT",
      //       userId: session.user.id!,
      //       fatigueReportId: report.id,
      //       reportData: JSON.stringify(report),
      //     }
      //   })) : (
      //   await db.fatigueReportEvent.create({
      //     data: {
      //       eventType: "UPDATED",
      //       userId: session.user.id!,
      //       fatigueReportId: report.id,
      //       reportData: JSON.stringify(report),
      //     }
      //   })
      // )


      return NextResponse.json(reportUpdated);
    }

  } catch (error) {
    console.log("[FATIGUE-SLEEP-REPORT-EDIT]", error);
    return new NextResponse("Internal Errorr " + error, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { reportId: string } }) {

  try {
      const session = await getServerSession(authOptions)
      const { reportId } = params;

      if (!session) return new NextResponse("Unauthorized", { status: 401 })
      if (!reportId) return new NextResponse("Not Found", { status: 404 })

      const reportCanceled = await db.fatigueSleepReport.update({
          where: {
              id: reportId,
              active: true
          },
          data: {
            state: "CANCELLED"
          }
      })

      return NextResponse.json(reportCanceled)

  } catch (error) {
      console.log("[CANCEL_ID_REPORT]", error)
      return new NextResponse("Internal Errorr " + error, { status: 500 })
  }
}
