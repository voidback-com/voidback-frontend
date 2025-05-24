'use client'
import { NavigationBar } from "@/app/components/Navigation"
import { useEffect, useState } from "react"




export default function Page() {


  return (
    <div className="w-full h-[100svh]">

      <NavigationBar selected="settings" feed={
        <div className="w-full h-[100svh] p-10 flex flex-col overflow-y-scroll gap-10">
          <p className="font-black text-5xl">
            Voidback.
          </p>

          <div className="">
            <div class="max-w-4xl mx-auto px-4 py-8">
  <h2 class="text-3xl font-bold mb-6">Privacy Policy</h2>

  <p class="mb-4 text-lg leading-relaxed">
    Your privacy is important to us. This Privacy Policy explains how Voidback ("we," "us," or "our") collects, uses, discloses, and protects your information when you use our platform. By using Voidback, you agree to the collection and use of information in accordance with this policy.
  </p>

  <h3 class="text-2xl font-semibold mb-4">1. Information We Collect</h3>
  <p class="mb-4 text-lg leading-relaxed">
    We collect various types of information for different purposes to provide and improve our service to you.
  </p>
  <ul class="list-disc list-inside mb-4 pl-4 text-lg leading-relaxed">
    <li class="mb-2">
      <strong class="font-semibold">Personal Data:</strong> While using our platform, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
      <ul class="list-circle list-inside ml-6 mt-2">
        <li>Email address</li>
        <li>Username</li>
        <li> Name</li>
        <li>Any other information you voluntarily provide in your profile or content</li>
      </ul>
    </li>
    <li class="mb-2">
      <strong class="font-semibold">Usage Data:</strong> We may also collect information about how the platform is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
    </li>
    <li class="mb-2">
      <strong class="font-semibold">Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
    </li>
  </ul>

  <h3 class="text-2xl font-semibold mb-4">2. How We Use Your Information</h3>
  <p class="mb-4 text-lg leading-relaxed">
    Voidback uses the collected data for various purposes:
  </p>
  <ul class="list-disc list-inside mb-4 pl-4 text-lg leading-relaxed">
    <li class="mb-2">To provide and maintain our platform</li>
    <li class="mb-2">To notify you about changes to our platform</li>
    <li class="mb-2">To allow you to participate in interactive features of our platform when you choose to do so</li>
    <li class="mb-2">To provide customer support</li>
    <li class="mb-2">To gather analysis or valuable information so that we can improve our platform</li>
    <li class="mb-2">To monitor the usage of our platform</li>
    <li class="mb-2">To detect, prevent, and address technical issues</li>
  </ul>

  <h3 class="text-2xl font-semibold mb-4">3. Disclosure of Your Information</h3>
  <p class="mb-4 text-lg leading-relaxed">
    We may disclose your Personal Data in the good faith belief that such action is necessary to:
  </p>
  <ul class="list-disc list-inside mb-4 pl-4 text-lg leading-relaxed">
    <li class="mb-2">Comply with a legal obligation</li>
    <li class="mb-2">Protect and defend the rights or property of Voidback</li>
    <li class="mb-2">Prevent or investigate possible wrongdoing in connection with the platform</li>
    <li class="mb-2">Protect the personal safety of users of the platform or the public</li>
    <li class="mb-2">Protect against legal liability</li>
  </ul>
  <p class="mb-4 text-lg leading-relaxed">
    We do not sell, trade, or otherwise transfer to outside parties your Personal Data unless we provide you with advance notice, except as described below. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
  </p>

  <h3 class="text-2xl font-semibold mb-4">4. Security of Your Information</h3>
  <p class="mb-4 text-lg leading-relaxed">
    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
  </p>

  <h3 class="text-2xl font-semibold mb-4">5. Links to Other Sites</h3>
  <p class="mb-4 text-lg leading-relaxed">
    Our platform may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
  </p>

  <h3 class="text-2xl font-semibold mb-4">6. Children's Privacy</h3>
  <p class="mb-4 text-lg leading-relaxed">
    Our platform is not intended for anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
  </p>

  <h3 class="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h3>
  <p class="mb-4 text-lg leading-relaxed">
    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
  </p>

  <h3 class="text-2xl font-semibold mb-4">8. Contact Us</h3>
  <p class="mb-4 text-lg leading-relaxed">
    If you have any questions about this Privacy Policy, please contact us at privacy@voidback.com.
  </p>
</div>
          </div>
        </div>
      } />
    </div>
  )
}
