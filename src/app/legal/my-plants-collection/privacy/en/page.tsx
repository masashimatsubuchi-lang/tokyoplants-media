import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | my Plants Collection",
  description: "Privacy Policy for the app \"my Plants Collection\"",
};

export default function PrivacyPolicyPageEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-gray-500">
        Effective date: July 14, 2026
        <br />
        Last updated: July 14, 2026
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          Masashi Matsubuchi (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) has established this Privacy Policy
          (the &quot;Policy&quot;) to describe how we handle user information in connection with our
          application &quot;my Plants Collection&quot; (the &quot;App&quot;).
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Basic Policy</h2>
          <p className="mt-2">
            The App lets users manage information, photos, and care records for the plants they
            register. All features of the App are available without signing in, and in that case
            the data you enter is <strong>stored only on your device and is never sent to or
            stored on our servers or any third party&apos;s servers</strong>. Only if you
            optionally sign in (via Google, Apple, Facebook, or LINE) will your data also be
            synced to the cloud, as described in Section 3, so that it can be carried over when
            you change devices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. Information We Collect and How
          </h2>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Type of Information
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    How It Is Collected
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    Where It Is Stored
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    Text information such as plant names, acquisition dates, care records, and
                    notes
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Entered by the user within the App
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    On your device (stored locally via SwiftData). Also stored in the cloud
                    (see Section 3) if you are signed in
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">Photos of plants</td>
                  <td className="border border-gray-200 px-3 py-2">
                    Taken using the App&apos;s camera feature
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    On your device (in the App&apos;s Documents directory). Also stored in the
                    cloud (see Section 3) if you are signed in
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    Email address and account identifier used for sign-in
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Obtained from Google, Apple, Facebook, or LINE&apos;s authentication service
                    at sign-in
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Cloud (see Section 3)
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    Push notification permission status
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    OS notification permission settings
                  </td>
                  <td className="border border-gray-200 px-3 py-2">On your device</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    Purchase and subscription status
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple Inc.&apos;s App Store payment system
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple Inc. and our subscription-management provider (see Section 5)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            The App does not collect location data, contacts, device identifiers, or any other
            information not listed above.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. Sign-In and Cloud Sync
          </h2>
          <p className="mt-2">
            The App lets you optionally sign in using a Google, Apple, Facebook, or LINE account.
            Signing in is not required, and if you do not sign in you can continue to use all
            features of the App as before.
          </p>
          <p className="mt-2">
            If you sign in, your plant information, care records, and photos are stored on the
            servers of the cloud service &quot;Supabase&quot; (provided by Supabase, Inc.) that
            we use, separated per user, so that your data can be carried over even if you change
            devices or reinstall the App. Stored data is protected by access controls (Row Level
            Security) so that no third party other than us can access it. For information on how
            Supabase handles data, please see Supabase&apos;s Privacy Policy (
            <a
              className="text-emerald-700 underline"
              href="https://supabase.com/privacy"
            >
              https://supabase.com/privacy
            </a>
            ).
          </p>
          <p className="mt-2">
            To provide the sign-in feature, information necessary for authentication (such as
            your email address) is sent to Google, Apple, Facebook, or LINE&apos;s authentication
            service. Please refer to each provider&apos;s own privacy policy for how they handle
            this information.
          </p>
          <p className="mt-2">
            If you sign out after having signed in, cloud syncing stops, but the data already
            stored in the cloud is not deleted. If you would like your cloud data deleted, please
            use the &quot;Delete Account&quot; option in the App&apos;s settings screen, or
            contact us using the information in Section 10.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. Disclosure to Third Parties (AI Plant Identification Feature)
          </h2>
          <p className="mt-2">
            Only if you use the App&apos;s &quot;Identify with AI&quot; feature, the photo of the
            plant you took is sent to the plant identification service &quot;Pl@ntNet&quot; (run
            by the Pl@ntNet project). This is necessary to obtain identification results, and we
            do not store or otherwise reuse the images sent for this purpose. For information on
            how Pl@ntNet handles data, please see Pl@ntNet&apos;s Privacy Policy (
            <a
              className="text-emerald-700 underline"
              href="https://plantnet.org/en/privacy-policy/"
            >
              https://plantnet.org/en/privacy-policy/
            </a>
            ).
          </p>
          <p className="mt-2">
            If you do not use this feature, no photo data is sent externally.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. Information Related to Subscriptions (Pro Plan)
          </h2>
          <p className="mt-2">
            Subscribing to the Pro plan is handled through Apple&apos;s App Store payment system.
            We do not collect or retain payment information (such as credit card numbers); it is
            managed by Apple Inc.
          </p>
          <p className="mt-2">
            We also use RevenueCat, Inc.&apos;s service to manage subscription status (such as
            expiration dates). Purchase-related information (purchase date, expiration date, an
            anonymous device identifier, etc. — not including credit card information) is sent to
            RevenueCat, Inc. For information on how RevenueCat handles data, please see
            RevenueCat&apos;s Privacy Policy (
            <a
              className="text-emerald-700 underline"
              href="https://www.revenuecat.com/privacy"
            >
              https://www.revenuecat.com/privacy
            </a>
            ).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            6. Cookies and Other Tracking Technologies
          </h2>
          <p className="mt-2">
            The App is a native application and does not use cookies. We do not perform any
            tracking for advertising purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            7. Disclosure and Deletion of Information
          </h2>
          <p className="mt-2">
            If you are not signed in, your plant information and photos are stored only on your
            device, so deleting (uninstalling) the App also deletes this information from your
            device. If you are signed in, you can delete the information stored in the cloud by
            using the &quot;Delete Account&quot; option in the App&apos;s settings screen. For
            information sent to external services under Sections 4 and 5, please contact each
            provider using the method described in their own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">8. Use by Minors</h2>
          <p className="mt-2">
            The App is provided in accordance with the age rating assigned on the App Store.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            9. Changes to This Policy
          </h2>
          <p className="mt-2">
            Except where otherwise required by law or by this Policy, we may change the contents
            of this Policy without notifying users individually. The revised Privacy Policy will
            take effect once it is posted within the App or at a location we designate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">10. Contact</h2>
          <p className="mt-2">
            If you have any questions about this Policy, please contact us using the information
            below.
          </p>
          <p className="mt-2">
            Masashi Matsubuchi
            <br />
            Email: tokyoplants.shop@gmail.com
          </p>
        </section>

        <p className="mt-8 text-sm text-gray-500">
          This English translation is provided for convenience only. In the event of any
          discrepancy, the{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy"
          >
            Japanese version
          </a>{" "}
          shall prevail. A Traditional Chinese translation is also available{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy/zh-Hant"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
