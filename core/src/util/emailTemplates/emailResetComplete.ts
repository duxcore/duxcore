import { createEmailTemplate } from "../createEmailTemplate";
import mjml2html from 'mjml'

interface EmailResetCompleteProps { }

export const emailResetComplete = createEmailTemplate<EmailResetCompleteProps>((props) => {
  return mjml2html(`
  <mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Email change success!</mj-text>
        <mj-text>This is just an email to notify you that your email has been updated successfully!</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `).html;
})