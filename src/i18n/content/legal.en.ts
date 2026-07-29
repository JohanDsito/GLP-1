export const legalContentEn = {
  draftNotice: 'Preliminary draft — pending review by a lawyer before launch.',
  backToApp: 'Back',
  terms: {
    title: 'Terms and conditions',
    updated: 'Last updated: July 2026',
    sections: [
      {
        h: '1. Nature of the service',
        p: 'Lumea is a companion and educational app for people on GLP-1 treatment. It is not a medical service, does not replace consultation with a healthcare professional, and does not provide medical diagnosis or treatment.',
      },
      {
        h: '2. Not medical advice',
        p: 'All content (side-effect guides, nutrition, reference doses, reminders) is informational and general. Always consult your doctor or healthcare professional before making decisions about your treatment, dose, or supplements.',
      },
      {
        h: '3. Payment and access',
        p: 'Access requires a one-time payment processed by Stripe, which grants lifetime access to the app. It is not a subscription: there are no recurring charges and no automatic renewals. Prices may change with prior notice for new purchases.',
      },
      {
        h: '4. Your account',
        p: 'You are responsible for keeping your account and password confidential, and for the accuracy of the data you log. You must be of legal age to create an account.',
      },
      {
        h: '5. Acceptable use',
        p: 'You agree to use the app only for personal, legitimate purposes, and not to enter false information that could affect your health tracking.',
      },
      {
        h: '6. Limitation of liability',
        p: 'To the maximum extent permitted by law, we are not liable for decisions made based on the information in the app. For any warning sign or emergency, contact your doctor or emergency services.',
      },
      {
        h: '7. Contact',
        p: 'For questions about these terms, reach us at the support email shown in the app.',
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    updated: 'Last updated: July 2026',
    sections: [
      {
        h: '1. Data we collect',
        p: 'We collect the data you provide at sign-up (first name, last name, email, date of birth, and sex) and the tracking data you log (doses, symptoms, weight, mood, sleep), plus basic technical data needed to run the service.',
      },
      {
        h: '2. How we use it',
        p: 'We use your data to personalize your experience, show your progress, send reminders, and generate your medical report. We do not sell your data to third parties.',
      },
      {
        h: '3. Health data',
        p: 'The health information you log is sensitive and handled with special care. Only you can see your individual records; internally we only use aggregated, anonymized data.',
      },
      {
        h: '4. Where it is stored',
        p: 'Your data is stored securely in Supabase. Payments are processed by Stripe; we do not store your card details.',
      },
      {
        h: '5. Your rights',
        p: 'You can access, correct, or request deletion of your data and account at any time by contacting our support email. Since access is a one-time purchase, there is no subscription to cancel and no recurring charges.',
      },
      {
        h: '6. Notifications',
        p: 'If you enable push notifications, we store the technical information needed to send them. You can disable them anytime from your device or app settings.',
      },
      {
        h: '7. Contact',
        p: 'To exercise your rights or resolve privacy questions, reach us at the support email shown in the app.',
      },
    ],
  },
} as const;
