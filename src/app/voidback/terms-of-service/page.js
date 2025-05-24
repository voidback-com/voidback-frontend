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
  <h2 class="text-3xl font-bold mb-6">Terms of Service</h2>

  <p class="mb-4 text-lg leading-relaxed">
    Welcome to Voidback! By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service. Please read them carefully. If you do not agree to these terms, you may not use Voidback.
  </p>

  <h3 class="text-2xl font-semibold mb-4">1. Content Guidelines</h3>
  <p class="mb-4 text-lg leading-relaxed">
    Voidback is dedicated to fostering a professional and constructive environment for developers and computer science enthusiasts. As such, we have strict content guidelines:
  </p>
  <ul class="list-disc list-inside mb-4 pl-4 text-lg leading-relaxed">
    <li class="mb-2">
      <strong class="font-semibold">No NSFW Content:</strong> Content that is Not Safe For Work (NSFW), including but not limited to pornography, sexually explicit material, or any other content that is inappropriate for a general audience, is strictly prohibited. Violation of this term will result in immediate content removal and potential account suspension or termination.
    </li>
    <li class="mb-2">
      <strong class="font-semibold">Respectful Communication:</strong> All interactions and content must be respectful and free from harassment, hate speech, discrimination, or personal attacks. We encourage constructive criticism and debate, but always in a civil manner.
    </li>
    <li class="mb-2">
      <strong class="font-semibold">Originality and Attribution:</strong> You are responsible for ensuring that the content you post is original or that you have the necessary rights and permissions to share it. If you use external resources or code, appropriate attribution is required. Plagiarism is not tolerated.
    </li>
    <li class="mb-2">
      <strong class="font-semibold">Relevance:</strong> While we encourage diverse topics within computer science and development, content should generally be relevant to the platform's focus.
    </li>
    <li class="mb-2">
      <strong class="font-semibold">No Spam or Malicious Content:</strong> Do not post spam, unsolicited advertisements, malware, phishing attempts, or any other malicious content.
    </li>
  </ul>

  <h3 class="text-2xl font-semibold mb-4">2. User Accounts</h3>
  <p class="mb-4 text-lg leading-relaxed">
    When you create an account on Voidback, you agree to:
  </p>
  <ul class="list-disc list-inside mb-4 pl-4 text-lg leading-relaxed">
    <li class="mb-2">
      Provide accurate and complete information.
    </li>
    <li class="mb-2">
      Maintain the confidentiality of your password and notify us immediately of any unauthorized use of your account.
    </li>
    <li class="mb-2">
      Be solely responsible for all activities that occur under your account.
    </li>
  </ul>

  <h3 class="text-2xl font-semibold mb-4">3. Intellectual Property</h3>
  <p class="mb-4 text-lg leading-relaxed">
    You retain ownership of the content you create and post on Voidback. However, by posting, you grant Voidback a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute your content on and through the platform for the purpose of operating and promoting Voidback.
  </p>

  <h3 class="text-2xl font-semibold mb-4">4. Disclaimer of Warranties</h3>
  <p class="mb-4 text-lg leading-relaxed">
    Voidback is provided "as is" and "as available" without any warranties, express or implied. We do not guarantee that the platform will be uninterrupted, error-free, or free from harmful components.
  </p>

  <h3 class="text-2xl font-semibold mb-4">5. Limitation of Liability</h3>
  <p class="mb-4 text-lg leading-relaxed">
    In no event shall Voidback, its affiliates, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform.
  </p>

  <h3 class="text-2xl font-semibold mb-4">6. Termination</h3>
  <p class="mb-4 text-lg leading-relaxed">
    We reserve the right to suspend or terminate your access to Voidback, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
  </p>

  <h3 class="text-2xl font-semibold mb-4">7. Changes to Terms</h3>
  <p class="mb-4 text-lg leading-relaxed">
    We may modify these Terms of Service at any time. We will notify you of any changes by posting the new Terms of Service on this page. Your continued use of the platform after any such modifications constitutes your acceptance of the new Terms of Service.
  </p>

  <h3 class="text-2xl font-semibold mb-4">8. Governing Law</h3>
  <p class="mb-4 text-lg leading-relaxed">
    These Terms shall be governed and construed in accordance with the laws of the state of Delaware, without regard to its conflict of law provisions.
  </p>

  <p class="mb-4 text-lg leading-relaxed">
    By using Voidback, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
  </p>
</div>
            


          </div>
        </div>
      } />
    </div>
  )
}
