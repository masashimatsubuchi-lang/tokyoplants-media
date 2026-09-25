import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account and Data Deletion | Green Collection",
  description:
    "How to delete your account and stored data for the Green Collection app",
};

export default function DeleteAccountPageEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        Account and Data Deletion
      </h1>
      <p className="mt-4 text-sm text-gray-500">
        App: Green Collection
        <br />
        Provider: Masashi Matsubuchi
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            1. Deleting from within the app
          </h2>
          <p className="mt-2">
            If you are signed in, you can delete your account and the data stored
            in the cloud as follows:
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            <li>Open the app</li>
            <li>Open &ldquo;Settings&rdquo; from the tab bar at the bottom</li>
            <li>Select &ldquo;Delete account&rdquo;</li>
            <li>Read the confirmation screen and confirm the deletion</li>
          </ol>
          <p className="mt-3">
            Deletion cannot be undone. Once confirmed, your account and the data
            stored in the cloud are deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. If you cannot use the app
          </h2>
          <p className="mt-2">
            If you cannot perform the steps above — for example because you lost
            your device or have already uninstalled the app — please contact us by
            email. We will verify your identity and carry out the deletion.
          </p>
          <p className="mt-2">Email: tokyoplants.shop@gmail.com</p>
          <p className="mt-2">
            Please include the{" "}
            <strong>email address you used to sign in</strong> and use
            &ldquo;Account deletion request&rdquo; as the subject line.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. Data that is deleted
          </h2>
          <p className="mt-2">
            Deleting your account removes the following data stored in the cloud:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              Account information (the email address and account identifier used
              to sign in)
            </li>
            <li>
              Your registered plants (nickname, species, date acquired, location,
              notes, and so on)
            </li>
            <li>Care logs and events you added to the calendar</li>
            <li>Photos you uploaded</li>
            <li>Light check measurements and AI health check results</li>
            <li>Expense records and your wishlist</li>
            <li>Information relating to friends</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. If you are not signed in
          </h2>
          <p className="mt-2">
            If you use the app without signing in, your data is{" "}
            <strong>
              stored only on your device and is never sent to our servers
            </strong>
            . In that case, uninstalling the app from your device also removes the
            data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. What is not deleted
          </h2>
          <p className="mt-2">
            The following are outside our control and are not covered by account
            deletion:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              Purchase history held by the App Store and Google Play (subject to
              each store&rsquo;s terms)
            </li>
            <li>
              Purchase information held by RevenueCat, Inc., which we use to manage
              subscription status
            </li>
            <li>
              Non-identifying usage statistics sent to Amplitude, Inc., which we use
              for analytics
            </li>
          </ul>
          <p className="mt-3">
            For details, please see our{" "}
            <a
              href="/legal/my-plants-collection/privacy/en"
              className="text-emerald-700 underline"
            >
              Privacy Policy
            </a>{" "}
            and the privacy policies of each company.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Contact</h2>
          <p className="mt-2">
            Masashi Matsubuchi
            <br />
            Email: tokyoplants.shop@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
