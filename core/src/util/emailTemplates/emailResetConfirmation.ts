import { createEmailTemplate } from "../createEmailTemplate";
import mjml2html from 'mjml'

interface EmailResetConfirmationProps {
  confirmationUrl: string
}

export const emailResetConfirmation = createEmailTemplate<EmailResetConfirmationProps>((props) => {
  return mjml2html(`
  <mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Confirm email change.</mj-text>
        <mj-text>Below is a link to confirm this new email address in your attempt to change your email.</mj-text>
        <mj-button href="${props.confirmationUrl}">Confirm Email</mj-button>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `).html;
})